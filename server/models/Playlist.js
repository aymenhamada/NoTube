const mongoose = require("mongoose");
mongoose.Promise =  global.Promise;


const PlaylistSchema = new mongoose.Schema({
    channelId:{
        type: String
    },
    channelTitle:{
        type: String
    },
    description:{type: String
    },
    liveBroadcastContent:{type: String
    },
    publishTime:{type: String
    },
    publishedAt:{type: String
    },
    thumbnails:{
            default: {url: {type: String}, width: {type: Number}, height: {type: Number}},
            high: {url: {type: String}, width: {type: Number}, height: {type: Number}},
            medium: {url: {type: String}, width: {type: Number}, height: {type: Number}}
        },
    title:{type: String
    },
    videoId:{
        type: String
    },
    position:{
        type: Number
    }

})

module.exports = mongoose.model("Playlist", PlaylistSchema);