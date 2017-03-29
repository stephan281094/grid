const chokidar = require('chokidar')
const fs = require('fs')
const http = require('http')
const path = require('path')
const Server = require('socket.io')
const compile = require('./compile')
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

module.exports = (config, initialCSS = '') => {
  const app = http.createServer(handler)
  const io = new Server(app)

  app.listen(PORT, () => {
    console.log(`Started dev server on http://localhost:${PORT}`)
  })

  io.on('connection', (socket) => {
    // Emit initial CSS
    socket.emit('update', { css: initialCSS })

    chokidar.watch(config.input)
      .on('change', (file) => {
        compile(file, config.plugins)
          .then((css) => {
            socket.emit('update', { css })
          })
          .catch((err) => {
            throw err
          })
      })
  })
}
