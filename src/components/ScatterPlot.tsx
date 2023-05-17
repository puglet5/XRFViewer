import { Scatter } from "react-chartjs-2"
import { Chart, registerables } from 'chart.js';
import zoomPlugin from "chartjs-plugin-zoom"
import { Colors } from 'chart.js';
Chart.register(...registerables, zoomPlugin, Colors);

interface Point {
  x: number
  y: number
}

interface ScatterPlotData {
  datasets: {
    label: string,
    data: Point[]
  }[]
}

const options = {
  animation: false,
  showLine: true,
  lineTension: 0,
  cubicInterpolationMode: "monotone",
  responsive: true,
  layout: {
    padding: {
      left: 20,
      right: 20,
      top: 20,
      bottom: 20
    },
  },
  elements: {
    point: {
      radius: 0
    },
    line: {
      borderWidth: 2
    }
  },
  scales: {
    y: {
      border: { dash: [4, 4] },
      title: {
        text: "Intensity, a.u.",
        display: true
      },
      min: 0,
      grid: {
        color: "#e1e1e1",
        tickBorderDash: [0, 0],
        tickLength: 10,
        tickWidth: 1,
      },
      grace: "5%"
    },
    x: {
      border: { dash: [4, 4] },
      title: {
        text: "Energy, keV",
        display: true
      },
      grid: {
        color: "#e1e1e1",
        tickBorderDash: [0, 0],
        tickLength: 10,
        tickWidth: 1,
      },
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false
  },
  plugins: {
    colors: {
      enabled: true,
      forceOverride: true
    },
    tooltip: {
      animation: false,
      displayColors: false,
      callbacks: {
        label: function (tooltipItem: any) {
          return tooltipItem.formattedValue
        },
        title: function () {
          return
        }
      },
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
        },
        pinch: {
          enabled: false
        },
        mode: "xy",
      },
      pan: {
        enabled: true
      },
      limits: {
        x: { min: "original", max: "original" },
        y: { min: "original", max: "original" }
      },
    },
    legend:
    {
      labels: {
        boxHeight: 1,
        boxWidth: 20,
      }
    },
    datalabels: {
      display: false
    }
  }
}

export default function ScatterPlot({ plotData }: { plotData: ScatterPlotData }) {
  return (
    <div className="flex h-screen">
      {/* @ts-expect-error */}
      <Scatter data={plotData} options={options} redraw />
    </div>
  )
}
