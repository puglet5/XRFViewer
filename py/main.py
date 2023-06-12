from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os, time
from pydantic import BaseModel
import numpy as np
from findpeaks import findpeaks
from scipy.ndimage import gaussian_filter1d
from scipy.interpolate import UnivariateSpline
from lmfit import Parameters
from lmfit.models import PseudoVoigtModel, Model


class XRFPlotData(BaseModel):
    data: dict[str, list[float]]
    range: list[float]


origins = [
    "http://localhost",
    "https://localhost",
    "http://localhost:4242",
    "http://localhost:5173",
    "http://127.0.0.1",
    "https://127.0.0.1",
    "http://127.0.0.1:4242",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:80",
    "http://127.0.0.1:8080",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["x-response-time"],
)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    response.headers["x-response-time"] = str(time.time() - start_time)
    return response


@app.get("/pid")
def get_pid() -> dict:
    return {"pid": str(os.getpid())}


@app.post("/deconvolve")
def deconvolve(data: XRFPlotData) -> dict:
    data_array = np.array([data.data["x"], data.data["y"]])
    selected_range = data.range
    data_to_deconvolve = data_array[
        :,
        (selected_range[0] <= data_array[0]) * (data_array[0] <= selected_range[1]),
    ]

    x, y = data_to_deconvolve

    spl = UnivariateSpline(x, y)
    spl_2d = spl.derivative(n=2)
    spl_2d_y = spl_2d(x)

    smth = gaussian_filter1d(spl_2d_y, 2)
    data_length = len(x)
    peak_detect_margin = 10

    fp = findpeaks(method="topology", lookahead=3, denoise="bilateral")
    result = fp.fit(
        -smth[peak_detect_margin : data_length - peak_detect_margin] / np.max(smth)
    )
    if result is None:
        return {"message": "Error. Counln't detect peaks in selected range"}

    df = result["df"]

    filtered_pos = (
        df.query("peak == True & rank != 0 & rank <= 20 & y > 0.01")
        .sort_values(by=["rank"])
        .head(5)
    )
    y_2d_peaks = [i + peak_detect_margin for i in filtered_pos["x"].to_numpy()]

    peak_model_list = []
    params = Parameters()
    for i, e in enumerate(y_2d_peaks):
        prefix = f"v{i}_"
        peak_model = PseudoVoigtModel(prefix=prefix)
        peak_model_list.append(peak_model)
        peak_model.set_param_hint("sigma", min=0, max=0.2)
        peak_model.set_param_hint("fraction", min=0, max=1)
        peak_model.set_param_hint("amplitude", min=0)
        peak_model.set_param_hint("height", min=0.8 * y[e], max=1.2 * y[e])
        peak_model.set_param_hint("center", min=x[e] - 0.1, max=x[e] + 0.1)
        params += peak_model.guess(y, x=x, center=x[e], amplitude=y[e] / 3)

    # bkg_model = PolynomialModel()
    # bkg_params = bkg_model.guess(y, x=x)
    # params += bkg_params

    model: Model = np.sum(peak_model_list)
    result = model.fit(y, params, x=x, max_nfev=2000)

    comps = result.eval_components()
    best_fit = result.best_fit.tolist()

    report = result.fit_report()
    return {
        "fittedData": {
            "bestFit": best_fit,
            "peaks": {"x": filtered_pos["x"].tolist(), "y": filtered_pos["y"].tolist()},
        },
        "fitReport": report,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=4242, reload=True)
