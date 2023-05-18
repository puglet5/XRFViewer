import { Scatter } from "react-chartjs-2"
import { Chart, registerables } from 'chart.js'
import zoomPlugin from "chartjs-plugin-zoom"
import { Colors } from 'chart.js'
import type { ChartData, ChartOptions } from 'chart.js'
import ChartDataLabels from "chartjs-plugin-datalabels"
Chart.register(...registerables, zoomPlugin, Colors, ChartDataLabels)
import { elementSymbols, emissionLinesData } from "../data/elementData"

const options: ChartOptions<"scatter"> = {
  animation: false,
  showLine: true,
  normalized: true,
  responsive: true,
  color: "ffffff",
  maintainAspectRatio: true,
  spanGaps: false,
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
      borderWidth: 2,
    }
  },
  scales: {
    y: {
      ticks: {
        color: "black"
      },
      border: { dash: [4, 4] },
      title: {
        text: "Intensity, a.u.",
        color: "black",
        display: true
      },
      min: 0,
      grid: {
        color: "#e1e1e1",
        tickBorderDash: [0, 0],
        tickLength: 10,
        tickWidth: 1,
      },
      grace: "20%"
    },
    x: {
      ticks: {
        color: "black",
        minRotation: 0,
        maxRotation: 0,
        sampleSize: 10
      },
      border: { dash: [4, 4] },
      title: {
        text: "Energy, keV",
        color: "black",
        display: true
      },
      grid: {
        color: "#e1e1e1",
        tickBorderDash: [0, 0],
        tickLength: 10,
        tickWidth: 1,
      },
      grace: "1"
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false
  },
  plugins: {
    datalabels: {
      display: false
    },
    decimation: {
      enabled: true
    },
    colors: {
      enabled: true,
      forceOverride: true
    },
    tooltip: {
      animation: false,
      mode: "index",
      displayColors: true,
      intersect: false,
      callbacks: {
        label: function (tooltipItem: any) {
          return tooltipItem.formattedValue
        },
        title: function () {
          return
        }
      },
      filter: function (tooltipItem) {
        return !elementSymbols.includes(tooltipItem.dataset.label!)
      }
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
    legend: {
      position: "top",
      labels: {
        boxHeight: 1,
        boxWidth: 10,
      }
    },
  }
}


export default function ScatterPlot({ plotData }: { plotData: ChartData<'scatter'> }) {

  return (
    <div className="flex h-screen">
      <Scatter data={plotData} options={options} redraw />
    </div>
  )
}
