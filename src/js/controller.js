import {
  printImage,
  printItemInDom,
  removeItemInDom,
  hiddeItemInDom,
  editElement,
  showItemInDom,
  resetForm,
  resetImage,
  ItemList,
  ImageValidation
} from './utils'

function AddListenerController (view) {
  function ListenerController () {
    const form = document.getElementById('formUpload')
    const imageItem = document.getElementById('fileField')
    const imageContent = document.getElementById('imageContent')
    const descriptionItem = document.getElementById('descriptionField')
    const addItem = document.getElementById('addButton')
    const itemList = document.getElementById('itemList')
    const updateItem = document.getElementById('updateButton')

    this.imageSelected = function (e) {
      e.preventDefault()
      const formData = imageItem.files[0]
      console.log(formData)
      const validateImage = new ImageValidation(formData)
      if (validateImage.validateType()) {
        const img = new Image()
        img.onload = function () {
          const imgWidth = this.width.toFixed(0)
          const imgHeight = this.height.toFixed(0)
          if (validateImage.validateDimensions(imgWidth, imgHeight)) {
            printImage(formData)
          } else {
            alert('Image size should be 320 * 320')
            resetForm()
          }
        }
        img.src = URL.createObjectURL(formData)
      } else {
        alert('Please, select an image file')
        resetForm()
      }
    }

    this.fileUpload = function (e) {
      e.preventDefault()
      if (descriptionItem.value == '') {
        alert('Please, add description')
      } else if (imageItem.files[0]) {
        this.sendFileToServer(form)
      } else {
        alert('Please, select an image file')
      }
    }

    this.fileUpdate = function (e) {
      e.preventDefault()
      if (descriptionItem.value == '') {
        alert('Please, add description')
      } else if (imageItem.files[0]) {
        this.sendFileToServer(form, idObject)
      } else {
        const imgInItem = $('#imageContent').find('img').attr('src')
        const img = imgInItem.replace('/uploads/', '')
        this.saveData(img, idObject)
      }
    }

    this.sendFileToServer = function (form, _id) {
      const oldId = _id
      const formData = new FormData(form)
      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/uploads', true)
      xhr.upload.onprogress = function (e) {
        if (e.lengthComputable) {
          const percentage = e.loaded / e.total * 100
          console.log(percentage + '%')
        }
      }
      xhr.onerror = function (e) {
        console.log('Error')
        console.log(e)
      }
      xhr.onload = function (e) {
        if (oldId) {
          this.saveData(e.currentTarget.response, oldId)
        } else {
          this.saveData(e.currentTarget.response)
        }
      }.bind(this)
      xhr.send(formData)
    }

    this.saveData = function (fileSaved, _oldId) {
      const oldId = _oldId
      const filePath = fileSaved
      const description = descriptionItem.value
      const data = {
        description: description,
        pictureUrl: filePath
      };

      fetch( oldId ? `/update/${oldId}` : '/save' , {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(response => {
        console.log(response)
        if (oldId) {
          removeItemInDom(oldId)
          showItemInDom()
        }
        printItemInDom(response)
        resetForm()
      })
      .catch(err => (
        console.log(err)
      ));

    }

    this.removeData = function (node) {
      const nodeId = node
      const data = {
        _id: nodeId
      };
      fetch( '/remove' , {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => {
        console.log(response)
        removeItemInDom(nodeId)
      })
      .catch(err => (
        console.log(err)
      ));
    }

    let idObject = ''
    this.editData = function (nodeId) {
      idObject = nodeId
      editElement(nodeId)
      hiddeItemInDom(nodeId)
    }

    this.inputMaxLength = function () {
      const max = descriptionItem.attributes.maxLength.value
      if (descriptionItem.value.length >= max) {
        alert('max length 300 chars')
        return false
      }
    }

    this.listen = function () {
      imageItem.addEventListener('click', resetImage)

      imageItem.addEventListener(
        'change',
        function (e) {
          this.imageSelected(e)
        }.bind(this),
        false
      )

      descriptionItem.addEventListener(
        'keypress',
        function (e) {
          this.inputMaxLength(e)
        }.bind(this),
        false
      )

      addItem.addEventListener(
        'click',
        function (e) {
          this.fileUpload(e)
        }.bind(this),
        false
      )

      updateItem.addEventListener(
        'click',
        function (e) {
          this.fileUpdate(e)
        }.bind(this),
        false
      )

      $('#itemList').on(
        'click',
        '.itemRemove',
        function (e) {
          e.preventDefault()
          this.removeData(
            e.currentTarget.parentNode.parentNode.getAttribute('id')
          )
        }.bind(this)
      )

      $('#itemList').on(
        'click',
        '.itemEdit',
        function (e) {
          e.preventDefault()
          this.editData(
            e.currentTarget.parentNode.parentNode.getAttribute('id')
          )
        }.bind(this)
      )

      $('.inputUpdate').on(
        'click',
        '.cancelBtn',
        function (e) {
          e.preventDefault()
          resetForm()
          showItemInDom()
        }.bind(this)
      )
    }

    this.view = view
    return this
  }
  return new ListenerController(view)
}

const formChanges = AddListenerController(window)
formChanges.listen()
