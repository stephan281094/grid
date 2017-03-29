const argv = require('minimist')(process.argv.slice(2))
const path = require('path')
const compile = require('./compile')
const write = require('./write')
const config = require('./config')
const resolve = (file) => path.join(__dirname, '..', file)

const build = async () => {
  if (argv.watch) {
    // Start dev server
    require('./dev-server')(config)
  } else {
    const compiledCSS = await compile(resolve(config.input), config.plugins)
    write(resolve(config.output), compiledCSS)
  }
}

build()
  .catch((err) => {
    console.error(`An error occurred while building: ${err}`)
  })
