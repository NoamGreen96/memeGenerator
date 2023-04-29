'use strict'

function renderGallery() {
  const imgs = getImgs()
  let strHtmls = `<div class="img-gallery" style="margin: auto;">
</div>`
  strHtmls = imgs
    .map((img) => {
      return `<div class="img-gallery">
                <img src="${img.url}" onclick="onImgSelect(${img.id})">
              </div>`
    })
    .join('')

  const elGallery = document.querySelector('.images-container')
  elGallery.innerHTML = strHtmls
}

function onImgSelect(id) {
  setimgById(id)
  _moveToEditorPage()
  renderCanvas()
}

// function onUploadImg(ev) {
//   const reader = new FileReader()
//   reader.onload = function (event) {
//     let img = new Image()
//     img.src = event.target.result
//     setImg(50, img.src)
//     _moveToEditorPage()
//     renderCanvas()
//   }
//   reader.readAsDataURL(ev.target.files[0])
// }

// section memes
function renderMyMemes() {
  const memes = loadFromStorage(STORAGE_KEY)
  let strHtmls
  if (memes.length) {
    strHtmls = memes
      .map((meme) => {
        return `<div class="img-gallery" data-id="${meme.id}">
                <img src="${meme.url}"/>
              </div>`
      })
      .join('')
  }
  document.querySelector('.meme-container').innerHTML = strHtmls
}
