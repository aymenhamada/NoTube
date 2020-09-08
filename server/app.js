const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./routes");
const app = express();
app.use(express.static('public'));


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
  }

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} [STARTED]`)
    const start = process.hrtime()

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds (start)
        console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds .toLocaleString()} ms`)
    })
    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds (start)
        console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds .toLocaleString()} ms`)
    })
    next()
  })

app.use('/', router);

app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).json({
        error: 'An unexpected error has occured' + err.message 
    })
});

module.exports = app;   