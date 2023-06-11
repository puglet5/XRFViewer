from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os, time
from pydantic import BaseModel


class XRFPlotData(BaseModel):
    data: dict[str, list[float]]
    range: tuple[float, float]


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
    return {"data": data}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=4242, reload=True)
