'use strict';

module.exports = function () {
  var app = require('./serverConfig');
  var ItemList = require('./dbConfig');
  var multer = require('multer');
  var storage = multer.diskStorage({
    destination: function destination(req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function filename(req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
  });
  var upload = multer({ storage: storage });

  app.get('/', function (req, res) {
    ItemList.find(function (err, doc) {
      if (err) {
        console.log(err);
      }
      res.render('index', { Items: doc });
    });
  });

  app.post('/uploads', upload.single('fileField'), function (req, res) {
    res.send(req.file.filename);
  });

  app.post('/save', function (req, res) {
    var data = {
      description: req.body.description,
      imageUrl: req.body.pictureUrl
    };
    var itemList = new ItemList(data);
    itemList.save(function (err) {
      console.log(itemList);
      res.send(itemList);
    });
  });

  app.post('/update/:id', function (req, res) {
    if (req.body.pictureUrl) {
      var data = {
        _id: req.params.id,
        description: req.body.description,
        imageUrl: req.body.pictureUrl
      };
    } else {
      var data = {
        _id: req.params.id,
        description: req.body.description
      };
    }
    var itemList = new ItemList(data);
    ItemList.update({ _id: req.params.id }, data, function (itemList) {
      console.log(data);
      res.send(data);
    });
  });

  app.delete('/remove', function (req, res) {
    var data = {
      _id: req.body._id
    };
    var itemList = new ItemList(data);
    ItemList.findByIdAndRemove(req.body._id, {}, function (err) {
      if (err) next(err);
      res.sendStatus(200);
    });
  });
}();