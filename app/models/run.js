var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RunSchema = new Schema({
	runid : {type: Number, required: true, unique: true},
	start : {type: Date, required: true, default: Date.now,},
	end : {type: Date, default: null}
});

module.exports = mongoose.model('Run', RunSchema);