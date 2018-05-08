var mongoose = require('mongoose');
// load up the user model
var Post = require('./models/post');
var User = require('./models/user');

var ObjectId = mongoose.Schema.Types.ObjectId;

function getPosts(user) {
    const queryResult = new Promise(function(resolve, reject) {
        Post.find({}, (err, post) => {
            if (err) {
                reject(err);
            }
            resolve(post);
        }).sort({'_id': -1});
    });

    return queryResult;
}




module.exports = {
    getPosts
};