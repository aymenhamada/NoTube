const mongoose = require("mongoose");
mongoose.Promise =  global.Promise;
const Playlist = require("./Playlist");


const userPlaylistSchema = new mongoose.Schema({
    email:{
        type: String
    },
    playlist:{
        type: [Playlist.schema],
    }
})

module.exports = mongoose.model("UserPlaylist", userPlaylistSchema);