const mongoose = require("mongoose");
const UserPlaylist = mongoose.model("UserPlaylist");





exports.getPlaylist = async (req, res) => {
    const { email } = req.query;
    const userPlaylist = await UserPlaylist.findOne({email});
    if(userPlaylist){
        return res.status(200).json(userPlaylist.playlist);
    }

    return res.status(200).json({noPlaylist: "No playlist find to this user"});
}



exports.addPlaylist = async (req, res) => {
    let snippet = req.body.finalSnippet;
    const user = req.body.user;


    const userPlaylists = await UserPlaylist.findOne({email: user})
    if(userPlaylists){
        const findSame = userPlaylists.playlist.filter(userTrack => userTrack.videoId == snippet.videoId);
        if(findSame.length) return res.status(200).json({err: "User already have this track on his playlist"})
        snippet.position = userPlaylists.playlist.length + 1;
        userPlaylists.playlist.push(snippet);
        await UserPlaylist.findOneAndUpdate({email: user}, {playlist: userPlaylists.playlist});
        return res.status(200).send("OK");
    } else {
        snippet.position = 1;
        const newPlaylist = await new UserPlaylist({
            email: user,
            playlist: snippet,
        }).save();
        return res.status(200).send("ok");
    }
}

exports.deletePlaylist = async (req, res) => {
    const {email, videoId} = req.body;
    const userPlaylists = await UserPlaylist.findOne({email});

    if(userPlaylists){
        const userPlaylistFiltered = userPlaylists.playlist.filter(userTrack => userTrack.videoId !== videoId);
        if(userPlaylistFiltered.length < userPlaylists.playlist.length){
            userPlaylistFiltered.forEach(userTrack => {
                if(userTrack.position > 1){
                    userTrack.position -= 1;
                }
            });
            await UserPlaylist.findOneAndUpdate({email}, {playlist: userPlaylistFiltered});
            return res.status(200).send("OK");
        }
    }
    return res.status(400).json({err: "Nothing to delete, this user has no playlist"});
}