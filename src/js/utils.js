export const printImage = fileData => {
  const imgToShow = fileData
  const img = document.createElement('img')
  img.classList.add('obj')
  img.setAttribute('id', 'removeMe')
  img.setAttribute('style', 'width:34px')
  img.file = imgToShow
  imageContent.appendChild(img)
  const reader = new FileReader()
  reader.onload = (function (aImg) {
    return function (e) {
      aImg.src = e.target.result
    }
  })(img)
  reader.readAsDataURL(imgToShow)
}

export const printItemInDom = (response) => {
  const itemLi = document.createElement('li')
  itemLi.setAttribute('id', response._id)
  const titemDv = document.createElement('div')
  titemDv.classList.add('itemNode')
  const imagePath = document.createElement('img')
  imagePath.classList.add('itemImg')
  imagePath.setAttribute('src', '/uploads/' + response.imageUrl)
  imagePath.setAttribute('style', 'width:34px')
  const itemEl = document.createElement('span')
  itemEl.textContent = response.description
  const removeItem = document.createElement('a')
  removeItem.classList.add('itemRemove')
  removeItem.textContent = 'Remove'
  removeItem.href = '#'
  const editItem = document.createElement('a')
  editItem.classList.add('itemEdit')
  editItem.textContent = 'Edit'
  editItem.href = '#'
  itemLi.appendChild(titemDv)
  titemDv.appendChild(imagePath)
  titemDv.appendChild(itemEl)
  titemDv.appendChild(removeItem)
  titemDv.appendChild(editItem)
  itemList.appendChild(itemLi)
}
export const removeItemInDom = _id => {
  const itemLi = document.getElementById(_id)
  itemList.removeChild(itemLi)
}
export const hiddeItemInDom = _id => {
  $('.list').find('li').removeClass('hidde')
  const hidde = document.getElementById(_id)
  hidde.classList.add('hidde')
  const hiddeBtn = document.getElementById('inputSubmit')
  hiddeBtn.classList.add('hidde')
  $('form').find('.inputUpdate').removeClass('hidde')
}

export const editElement = _id => {
  resetForm()
  const nodeId = _id
  const _Id = '#' + nodeId
  const textInSpan = $(_Id).find('span').text()
  const imgInItem = $(_Id).find('img').attr('src')
  const imgPath = imgInItem.replace('/uploads/', '')
  $('#descriptionField').val(textInSpan)
  const imagePath = document.createElement('img')
  imagePath.classList.add('itemImg')
  imagePath.setAttribute('id', 'removeMe')
  imagePath.setAttribute('src', imgInItem)
  imagePath.setAttribute('style', 'width:34px')
  imageContent.appendChild(imagePath)
}
export const showItemInDom = _id => {
  $('.list').find('li').removeClass('hidde')
  $('form').find('.inputSubmit').removeClass('hidde')
  const hiddeBtn = document.getElementById('inputUpdate')
  hiddeBtn.classList.add('hidde')
}

export const resetForm = () => {
  const img = document.getElementById('removeMe')
  if (img) {
    imageContent.removeChild(img)
  }
  const form = document.getElementById('formUpload')
  form.reset()
}
export const resetImage = () => {
  const img = document.getElementById('removeMe')
  if (img) {
    imageContent.removeChild(img)
  }
}

export class ItemList {
  constructor (_id) {
    const idItem = _id
  }
  giveMeTheId () {
    return idItem
  }
}

export class ImageValidation {
  constructor (file) {
    this.fileData = file
  }

  validateType () {
    const imageType = /image.*/
    if (this.fileData.type.match(imageType)) {
      return true
    } else {
      return false
    }
  }

  validateDimensions (imgWidth, imgHeight) {
    if (imgWidth == 320 && imgHeight == 320) {
      return true
    }
  }
}

