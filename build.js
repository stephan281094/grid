// Retrieve command line arguments.
const argv = require('minimist')(process.argv.slice(2))

// Import dependencies.
const path = require('path')
const fs = require('fs')
const sass = require('node-sass')
const chokidar = require('chokidar')
const postcss = require('postcss')

// Input and output files
const INPUT = path.join(__dirname, 'scss/grid.scss')
const OUTPUT = path.join(__dirname, 'example/grid.css')

// PostCSS plugins
let plugins = [
  require('css-mqpacker') // Merges common media queries into one
]

// Add PostCSS production plugins
if (process.env.NODE_ENV === 'production') {
  plugins = [
    ...plugins,
    require('cssnano') // Optimises and minifies CSS
  ]
}

// Compile SCSS to CSS, then pipe that to PostCSS
const build = (file) => {
  console.log('Compiling..')

  sass.render({ file }, (err, result) => {
    if (err || !result.css) {
      throw new Error(
        `Could not compile SCSS into CSS${err ? ': ' + err.message : ''}`
      )
    }

    postcss(plugins)
      .process(result.css, {
        from: INPUT,
        to: OUTPUT
      })
      .then((result) => {
        fs.writeFile(OUTPUT, result.css, (err) => {
          if (err) throw err

          console.log('Done!')
        })
      })
  })
}

// Watch for changes if --watch has been passed. Otherwise, just build
if (argv.watch) {
  console.log('Watching for changes..')

  chokidar.watch(INPUT).on('change', build)
} else {
  build(INPUT)
}
