const express = require("express");
const router = express.Router();
const { catchErrors } = require("../errorHandlers");
const TrackController = require("../controllers/TrackController");
const UserController = require("../controllers/UserController");
const PlaylistController = require("../controllers/PlaylistController");


router.post("/api/login", catchErrors(UserController.login))

router.post("/api/register", catchErrors(UserController.register))


router.get("/api/youtube/search", catchErrors(TrackController.SearchForTrack))

router.get("/api/youtube/getVideo", catchErrors(TrackController.downloadVideo))

router.get('/api/youtube/download', catchErrors(TrackController.downloadMp3));

router.get("/api/StreamAudio", catchErrors(TrackController.streamAudio))

router.get("/api/getPlaylist", catchErrors(PlaylistController.getPlaylist));

router.post("/api/addPlaylist", catchErrors(PlaylistController.addPlaylist))

router.post("/api/deletePlaylist", catchErrors(PlaylistController.deletePlaylist))


router.get("/test", catchErrors(TrackController.testing))

module.exports = router;