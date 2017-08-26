'use strict';

module.exports = function () {
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/itemsList');
  var itemSchema = {
    description: String,
    imageUrl: String,
    sort: Number
  };
  var ItemList = mongoose.model('items__list', itemSchema);
  return ItemList;
}();