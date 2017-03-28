// Retrieve command line arguments.
const argv = require('minimist')(process.argv.slice(2))

// Import dependencies.
const path = require('path')
const fs = require('fs')
const sass = require('node-sass')
const chokidar = require('chokidar')
const postcss = require('postcss')

// Input and output files.
const INPUT = path.join(__dirname, 'scss/grid.scss')
const OUTPUT = path.join(__dirname, 'example/grid.css')

// PostCSS plugins.
let plugins = [
  require('css-mqpacker'), // Merges common media queries into one.
  require('autoprefixer') // Adds vendor prefixes.
]

// Add PostCSS production plugins
if (process.env.NODE_ENV === 'production') {
  plugins = [
    ...plugins,
    require('cssnano') // Optimises and minifies CSS.
  ]
}

// Compile SCSS to CSS, then pipe that to PostCSS.
const compile = (file) => {
  console.log('Compiling..')

  return new Promise((resolve, reject) => {
    sass.render({ file }, (err, result) => {
      if (err || !result.css) {
        reject(new Error(
          `Could not compile SCSS into CSS${err ? ': ' + err.message : ''}`
        ))
      }

      postcss(plugins)
        .process(result.css, {
          from: INPUT,
          to: OUTPUT
        })
        .then((result) => {
          return resolve(result.css)
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}

// Write a file with contents.
const write = (path, contents) => {
  fs.writeFile(path, contents, (err) => {
    if (err) throw err

    console.log(`Wrote ${path}`)
  })
}

// Watch for changes if --watch has been passed.
if (argv.watch) {
  console.log('Watching for changes..')

  chokidar.watch(INPUT)
    .on('change', (file) => {
      compile(file).then((css) => {
        // TODO: Emit results to allow hot reloading CSS.
        write(OUTPUT, css)
      })
    })
} else {
  compile(INPUT).then((css) => {
    write(OUTPUT, css)
  })
}
