window.onload = function () {
  [].slice.call(document.querySelectorAll('.c-item')).forEach((item) => {
    item.style.backgroundColor = `#${generateRandomHex()}`
  })
}

function generateRandomHex () {
  var hex = Math.floor(Math.random() * 16777215).toString(16)

  if (hex.length !== 6) {
    return generateRandomHex()
  }

  return hex
}
