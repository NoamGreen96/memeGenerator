'use strict'

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
  var val = localStorage.getItem(key)
  return JSON.parse(val)
}

function _saveMemesToStorage() {
  saveToStorage(STORAGE_KEY, gSavedMeme)
}

function getSavedMemes() {
  gSavedMeme = loadFromStorage(STORAGE_KEY)
  console.log(gSavedMeme)
  if (!gSavedMeme) gSavedMeme = []
  return gSavedMeme
}
