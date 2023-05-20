import Plot from 'react-plotly.js';
import { Config, Layout, ScatterData } from 'plotly.js'

const config: Partial<Config> = {
  showTips: false,
  scrollZoom: true,
  editable: false,
  displaylogo: false,
  modeBarButtonsToRemove: ['zoom2d', "autoScale2d", "lasso2d", "select2d", "zoomIn2d", "zoomOut2d", "pan2d"],
  responsive: true,
  toImageButtonOptions: {
    format: 'png', // one of png, svg, jpeg, webp
    filename: 'XRFViewer_data',
  }
}

const layout: Partial<Layout> = {
  title: {
    text: 'XRFViewer',
  },
  showlegend: true,
  autosize: true,
  dragmode: "pan",
  legend: {
    borderwidth: 1,
    xanchor: 'right',
    x: 0.99,
    y: 0.99
  },
  xaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: 'ticks',
    title: {
      text: "Energy, keV"
    }
  },
  yaxis: {
    showgrid: true,
    zeroline: true,
    showline: true,
    mirror: 'ticks',
    title: {
      text: "Intensity, a.u."
    },
    exponentformat: "none",
    showexponent: 'all'
  },
  uirevision: 1
}

const style = {
}

export default function ScatterPlot({ plotData }: { plotData: Partial<ScatterData>[] }) {
  return (
    <Plot
      style={style}
      data={plotData}
      layout={layout}
      config={config}
    />
  )
}
