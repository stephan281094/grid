let plugins = [
  require('css-mqpacker'), // Merges common media queries into one.
  require('autoprefixer') // Adds vendor prefixes.
]

if (process.env.NODE_ENV === 'production') {
  plugins = [
    ...plugins,
    require('cssnano') // Optimises and minifies CSS.
  ]
}

module.exports = {
  input: 'scss/grid.scss',
  output: 'dist/grid.css',
  plugins
}
