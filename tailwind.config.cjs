
const deep = require("./tailwind/deep.cjs");

module.exports = {
  important: "#app",
  content: [
    './index.html', 
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16B1FF"
      }
    }
  },
  plugins: [
    deep
  ],
}
