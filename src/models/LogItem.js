const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LogSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  request: {
    type: String,
    required: true,
  },
});

module.exports = log = mongoose.model("log", LogSchema);
