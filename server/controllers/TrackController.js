const axios = require("axios")
const fs = require('fs')
const ytdl = require("ytdl-core");
const ffmpeg = require('fluent-ffmpeg')
const through2 = require("through2");


const cache = {}
const downloadCache = {};

let musicPath = "/home/student/jukebox/server/public/music/";


require('dotenv').config({ path: 'variables.env' });


const youtubeApiToken = process.env.youtubeApiToken;





exports.SearchForTrack = async (req, res) => {
    const { q } = req.query
    axios.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${q}&type=video&key=${youtubeApiToken}`)
    .then((response) => {
        return res.status(200).json(response.data)
    })
    .catch(err => console.log(err))
}

const downloadAndStreamParralelly = (videoId, file) => {
    if (cache[videoId]) {
        const cached = cache[videoId]
        if (cached) return cached;
    }

      const video = ytdl(videoId)
      const ffmpegToStream = new ffmpeg(video)
      const ffmegToDownload = new ffmpeg(video);
      const stream = through2()
      try {
        ffmpegToStream
          .format('mp3')
          .on('end', () => {
            cache[videoId] = null
            ffmpegToStream.kill()
          })
          .pipe(
            stream,
            { end: true }
          )

        ffmegToDownload
          .format("mp3")
          .save(file)
          .on("end", () => {
            ffmegToDownload.kill();
            downloadCache[videoId] = null;
          })
        downloadCache[videoId] = videoId;
        cache[videoId] = stream
        return stream
      } catch (e) {
        throw e
      }
}

exports.streamAudio = async (req, res) => {
    if(req.query.videoId !== "" && req.query.videoId !== undefined){
        const { videoId } = req.query;
        const file = `${musicPath}/${videoId}.mp3`
        fs.access(file, fs.F_OK, (err) => {
            if(err || downloadCache[videoId]){
                downloadAndStreamParralelly(videoId, file).pipe(res);
            } else {
                res.sendFile(file);
            }
        })
        //return ytdl(`https://www.youtube.com/watch?v=${videoId}`, {filter: "audioonly"}).pipe(res);
    } else {
        return res.sendStatus(404)
    }
}




exports.downloadMp3 = async (req, res) => {
    let { videoId, fileName } = req.query;
    let filePath = musicPath + videoId + ".mp3";
    fs.access(filePath, fs.F_OK, (err) => {
        if(err){
            return res.status(400).json({err: "file not found"});
        }
        else {
            return res.status(200).download(filePath, fileName + ".mp3")
        }
    })
}

exports.convertToMp3 = async (videoId, socket) => {
    return new Promise((resolve, reject) => {
        let filePath = musicPath + videoId + ".mp3"
        fs.access(filePath, fs.F_OK, (err) => {
            if(err) {
                try{
                    let progress = 0;
                    let stream = ytdl(videoId, { quality: 'highestaudio'}).on("progress",(_, totalDownloaded, total) => {
                        progress += totalDownloaded;
                        console.log(Math.round( 100 * totalDownloaded / total));
                        socket.emit("timer", Math.round( 100 * totalDownloaded / total));
                    });
                    ffmpeg(stream)
                        .on('end', () => { resolve(getFilesizeInBytes(filePath)) })
                        .audioBitrate(160)
                        .format("mp3")
                        .save(filePath);
                }
                catch(err){
                        return resolve("err")
                }
            } else {
                resolve(getFilesizeInBytes(filePath))
            }
        })
    })
}

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    var fileSizeInMegabytes = fileSizeInBytes / 1000000.0
    return fileSizeInMegabytes.toFixed(2) + "MB";
}




function awaitFileExists(filename){
    return new Promise((resolve, reject) => {
        fs.access(filename, fs.F_OK, (err) => {
            if(err){
                resolve("Err");
            } else {
                resolve("Exist")
            }
        })
    })
}