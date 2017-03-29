const sass = require('node-sass')
const postcss = require('postcss')

// Compile SCSS to CSS, then pipe that to PostCSS.
module.exports = (file, plugins) => {
  console.log('Compiling..')

  return new Promise((resolve, reject) => {
    sass.render({ file }, (err, result) => {
      if (err || !result.css) {
        reject(new Error(
          `Could not compile SCSS into CSS${err ? ': ' + err.message : ''}`
        ))
      }

      postcss(plugins).process(result.css)
        .then((result) => {
          return resolve(result.css)
        })
        .catch((err) => {
          reject(err)
        })
    })
  })
}
