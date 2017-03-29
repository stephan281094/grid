const chokidar = require('chokidar')
const fs = require('fs')
const http = require('http')
const path = require('path')
const Server = require('socket.io')
const compile = require('./compile')
const resolve = (file) => path.join(__dirname, '..', file)
const PORT = 3000

const handler = (req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), (err, data) => {
    if (err) {
      res.writeHead(500)
      return res.end('Error loading index.html')
    }

    res.writeHead(200)
    res.end(data)
  })
}

module.exports = (config) => {
  const app = http.createServer(handler)
  const io = new Server(app)

  app.listen(PORT, () => {
    console.log(`Started dev server on http://localhost:${PORT}`)
  })

  const scssWatcher = chokidar.watch(config.input)
  io.on('connection', async (socket) => {
    const compiledCSS = await compile(resolve(config.input), config.plugins)
    socket.emit('update', compiledCSS)

    // Emit CSS update on change
    scssWatcher.on('change', (file) => {
      compile(resolve(file), config.plugins)
        .then((css) => {
          socket.emit('update', css)
        })
        .catch((err) => {
          throw err
        })
    })
  })
}
