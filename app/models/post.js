var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var PostsSchema = mongoose.Schema({
    estado : String,                                                             
    file: String,
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Post', PostsSchema);