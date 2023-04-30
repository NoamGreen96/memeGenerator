'use strict'

function onInit() {
  gElCanvas = document.getElementById('my-canvas')
  gCtx = gElCanvas.getContext('2d')
  addListeners()
  renderCanvas()
  renderGallery()
}

///////////////////////////////////////////////
//      Page layout functions               //
///////////////////////////////////////////////

function onToggleMenu() {
  if (window.innerWidth > 820) document.body.classList.remove('menu-open')
  else document.body.classList.toggle('menu-open')
  const elBtnMenu = document.querySelector('.btn-menu')
  elBtnMenu.innerText = document.body.classList.contains('menu-open')
    ? '✕'
    : '☰'
}

function onOpenPage(page) {
  onToggleMenu()
  _hideSections()
  switch (page) {
    case 'gallery':
      openGallery()
      break
    case 'memes':
      openMemes()
      break
    case 'about':
      openAbout()
      break
  }
}

function openGallery() {
  document.querySelector('.gallery-container').classList.remove('none')
  document.querySelector('.main-nav .btn-gallery').classList.add('active')
  document.querySelector('.my-memes-container').classList.add('none')
}

function openMemes() {
  document.querySelector('.main-nav .btn-memes').classList.add('active')
  document.querySelector('.my-memes-container').classList.remove('none')
  renderMyMemes()
}

function openAbout() {
  document.querySelector('.about-container').classList.remove('none')
  document.querySelector('.main-nav .btn-about').classList.add('active')
  document.querySelector('.my-memes-container').classList.add('none')
}

function _moveToEditorPage() {
  document.querySelector('.gallery-container').classList.add('none')
  document.querySelector('.editor-container').classList.remove('none')
}

function _hideSections() {
  // sections
  document.querySelector('.gallery-container').classList.add('none')
  document.querySelector('.editor-container').classList.add('none')
  document.querySelector('.about-container').classList.add('none')

  // nav buttons active
  document.querySelector('.main-nav .btn-gallery').classList.remove('active')
  document.querySelector('.main-nav .btn-memes').classList.remove('active')
  document.querySelector('.main-nav .btn-about').classList.remove('active')
}

///////////////////////////////////////////////
///////////////////////////////////////////////

function renderCanvas() {
  const meme = getMeme()
  var img = new Image()
  img.src = `img/${meme.selectedImgId}.jpg`
  img.onload = function () {
    gCtx.drawImage(img, 0, 0)
    meme.lines.forEach((line) => {
      gCtx.font = `${line.size}px ${line.font}`
      gCtx.fillStyle = line.color
      gCtx.strokeStyle = line.strokeColor
      gCtx.lineWidth = 1
      gCtx.textAlign = line.align
      gCtx.textBaseline = 'middle'
      let text = line.txt
      gCtx.fillText(text, line.pos.x, line.pos.y)
      gCtx.strokeText(text, line.pos.x, line.pos.y)
    })
    drawBorderLine()
  }
}

function drawBorderLine() {
  const line = getCurrLine()
  if (!line) return
  gCtx.beginPath()
  if (!line.pos.x) {
    gCtx.rect(
      0,
      line.pos.y - 20,
      gCtx.measureText(line.txt).width + 10,
      line.size + 20
    )
  } else if (line.pos.x + gCtx.measureText(line.txt).width > gElCanvas.width) {
    gCtx.rect(
      gElCanvas.width - gCtx.measureText(line.txt).width - 10,
      line.pos.y - 20,
      gElCanvas.width,
      line.size + 20
    )
  } else {
    gCtx.rect(
      line.pos.x - gCtx.measureText(line.txt).width / 2 - 10,
      line.pos.y - 20,
      gCtx.measureText(line.txt).width + 20,
      line.size + 20
    )
  }
  gCtx.lineWidth = 2
  gCtx.strokeStyle = 'black'
  gCtx.stroke()
  gCtx.closePath()
}

function addListeners() {
  addMouseListeners()
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', onDown)
}

function onDown(ev) {
  const { offsetX, offsetY } = ev
  const isClicked = isLineClicked(offsetX, offsetY)
  renderCanvas()
}

function isLineClicked(offsetX, offsetY) {
  const lines = getLines()
  const clickedLineIdx = lines.findIndex((line) => {
    clearText(line.txt)
    const lineWidth = gCtx.measureText(line.txt).width
    const lineHeight = line.size
    return (
      offsetX >= line.pos.x - lineWidth / 2 - 10 &&
      offsetX <= line.pos.x + lineWidth + 20 &&
      offsetY >= line.pos.y - 10 &&
      offsetY <= line.pos.y + lineHeight + 20
    )
  })
  if (clickedLineIdx !== -1) {
    updateLineIdx(clickedLineIdx)
    return true
  }
  clearText(lines.txt)
  return false
}

// Editing tools
function onDownloadMeme(elLink) {
  const memeContent = gElCanvas.toDataURL()
  elLink.href = memeContent
}

function onSaveMeme() {
  const memeOnGallery = gElCanvas.toDataURL()
  saveMeme(memeOnGallery)
  gIsMemeSave = false
  alert('meme is saved!')
}

function onAddLine(font) {
  const lines = getCurrLine()
  clearText(lines.txt)
  if (lines.length === 3) return
  const lineIdx = lines.length + 1
  const newLine = _createLine(font, lineIdx)
  gMeme.lines.push(newLine)
  gCurrLineIdx = gMeme.lines.length - 1
}

function onMoveLine(direction) {
  const diff = direction === 'up' ? -10 : 10
  moveLine(diff, 'y')
  renderCanvas()
}

function onChangeAlign(direction) {
  changeAlign(direction)
  renderCanvas()
}

function onChangeFontFamily(font) {
  changeFontFamily(font)
  renderCanvas()
}

function onRemoveLine() {
  if (confirm('You sure you want to delete this line?')) {
    removeLine(gCurrLineIdx)
    renderCanvas()
  }
}

function onChangetxt(txt) {
  const line = getCurrLine()
  line.txt = txt
  renderCanvas()
}

function onChangetxtcolor(color) {
  gMeme.lines[gCurrLineIdx].color = color
  renderCanvas()
}
function onChangeStrokecolor(strokeColor) {
  gMeme.lines[gCurrLineIdx].strokeColor = strokeColor
  console.log(gMeme)
  renderCanvas()
}

function increaseFont() {
  gMeme.lines[gCurrLineIdx].size++
  renderCanvas()
}

function decreaseFont() {
  gMeme.lines[gCurrLineIdx].size--
  renderCanvas()
}

function toggleLine() {
  swichLine()
  renderCanvas()
}
