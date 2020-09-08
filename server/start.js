const mongoose = require("mongoose");
const TrackController = require("./controllers/TrackController");


mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true}, function(err){
    if(err) throw err;
    console.log('Connected to database !');
});
mongoose.Promise = global.Promise;
mongoose.connection.on('error', (err) => {
  console.error(`🙅 🚫 🙅 🚫 🙅 🚫 🙅 🚫 → ${err.message}`);
});
mongoose.set('useFindAndModify', false);



require("./models/User");
require("./models/UserPlaylist");
const app = require('./app');
app.set('port', 4242);


mongoose.connect(process.env.DATABASE)
const server = app.listen(app.get('port'), () => {
    console.log(`🚀 📱 💻 Launched server on localhost:${app.get('port')}`);
});

const io = require("socket.io")(4000);


io.on("connection", socket => {
    socket.on("newVideoToConvert", async (videoId) => {
      try{
        let videoConverting = await TrackController.convertToMp3(videoId, socket);
        if(videoConverting == "err"){
          return socket.emit("err", ("Not a Valid Video Id"))
        }
        return socket.emit("fileReadyForDownload", videoConverting);
      }catch(err){
        console.log(err);
      }
    })
});