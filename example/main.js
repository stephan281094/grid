window.onload = function () {
  // Give each item a bright random color
  [].slice.call(document.querySelectorAll('.c-item')).forEach((item) => {
    const hue = Math.floor(Math.random() * 360)
    item.style.backgroundColor = `hsla(${hue}, 100%, 70%, 1)`
  })
}
