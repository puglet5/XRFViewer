module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pbg": "#ffffff",
        "ptx": "#000000",
        "pfg": "#676765",
        "sfg": "#dedede",
        "acc": "#676765"
      },
      containers: {
        "2xs": '4rem'
      },
    },
  },
  plugins: [require('@tailwindcss/container-queries')],
}

