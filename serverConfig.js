'use strict';

module.exports = function () {
  var express = require('express');
  var app = express();
  var bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set('view engine', 'jade');
  app.use(express.static('public'));
  app.listen(8080);
  console.log('APP running in http://localhost:8080');
  return app;
}();