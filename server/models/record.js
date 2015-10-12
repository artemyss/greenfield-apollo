// modules =================================================
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// schema ==================================================
var RecordSchema = new Schema({

  checkinDate: {
    type: String,
    required: true
  },

  checkinCount: {
    type: Number,
    default: 0
  }

});

module.exports = RecordSchema;