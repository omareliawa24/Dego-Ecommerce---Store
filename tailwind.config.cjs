/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,css,scss,scss,less}',
    './src/**/**/*.{html,ts}',
    './node_modules/flowbite/**/*.js'
  ],
  theme: {
    extend: {}
  },
  safelist: [
    // Borders
    "border-green-700",
    "border-red-700",

    // Text Colors
    "text-green-700",
    "text-red-700",

  ],
  plugins: [    require("flowbite/plugin")
]
};
