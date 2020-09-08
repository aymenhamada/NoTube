import React from "react";
import AuthService from "../AuthService";
import axios from "axios";


import VideoRendering from "../Components/VideoRendering"
import LoaderBar from "../miniComponents/LoaderBar";
import DownloableCard from "../Components/DownloableCard"
import List from '@material-ui/core/List';


import YouTubeIcon from '@material-ui/icons/YouTube';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';




import { serverPort } from "../serverPort"
import { socket } from "../socket"



export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.AuthService = new AuthService("api");
        this.state = { user: {}, videos: [], videoId: "", progressBar: 1, showProgressBar: false, snippet: {}, showCard: false, fileSize: ""}
        this.searchForTrack = this.searchForTrack.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleConversion = this.handleConversion.bind(this);
        this.handleAddToPlaylist = this.handleAddToPlaylist.bind(this);
        this.timeout = 0;
    }

    componentWillMount(){
        if (!this.AuthService.loggedIn()) {
            return window.location.replace(window.location.origin + "/login");
        }
    }


    componentDidMount() {
        if(localStorage.getItem("videos")){
            const videos = JSON.parse(localStorage.getItem("videos"));
            this.setState({videos})
        }
        this.setState({ user: this.AuthService.getProfile() })
        socket.on("timer", (progress) => {
            if(progress > (this.state.progressBar + 3 ) ){
                this.setState({progressBar: progress})
            }
        })
        socket.on("fileReadyForDownload", (fileSize) => this.setState({showProgressBar: false, progressBar: 1, showCard: true, fileSize}))
    }


   handleUpdate(videoId, snippet){
        let serverUri =  serverPort.host + "/api/StreamAudio?videoId="
        this.setState({videoId: serverUri + videoId})
        this.props.onVideoChange(serverUri + videoId, snippet);

    }

    async handleConversion(videoId, snippet){
        snippet.videoId = videoId;
        await this.setState({showProgressBar: true, snippet, showCard: false});
        socket.emit("newVideoToConvert", videoId);
        window.scrollTo(0, 0);
    }


    anim(elem){
        var pos = 0;
        elem.style.position = "relative";
        elem.style.width = "800px";
        elem.style.height = "800px";
        var width = 800;
        var heigth = 800;
        var id = setInterval(frame, 10);
        function frame() {
            if (pos == -100) {
                clearInterval(id);
                elem.style.display = "none"
            } else {
                pos--;
                width -= 2;
                heigth -= 7;
                elem.style.width = width + "px";
                elem.style.height = heigth + "px";
                elem.style.right = (pos * 11) + 'px';
            }
        }
        let opacityToRemove = 1 / (1000 / 10);
        let realTimeout = 1000 / 10;
        for(let i = 0;  i <= realTimeout; i++){
            setTimeout(() => {
                elem.style.opacity = `${opacityToRemove * (realTimeout - i)}`
            }, i * 10)
        }
    }

    handleAddToPlaylist(videoId, snippet, id){
        const row = document.querySelector(`.row[data-id='${id}']`);
        this.anim(row)
        const finalSnippet = Object.assign(snippet, {videoId});
        const user = this.AuthService.getProfile().email;
        axios.post(serverPort.host + "/api/AddPlaylist", {finalSnippet, user})
            .then((response) => {
                console.log(response)
            }).catch(err => console.log(err));
    }

    renderVideo(){
        return this.state.videos.map((ele, i) => {
            return(
                <div className="row"  style={{marginBottom: "150px"}} key={i} data-id={i}>
                    <VideoRendering snippet={ele.snippet} videoId={ele.id.videoId} handleUpdate={this.handleUpdate} handleConversion={this.handleConversion} id={i} handleAddToPlaylist={this.handleAddToPlaylist} addPlaylistButton={true}/>
                </div>
            )
        })
    }


    searchForTrack(e){
        let query = e.target.value
        if(this.timeout) clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            axios.get(`${serverPort.host}/api/youtube/search?q=${query}`)
            .then((response) => {
                this.setState({videos: response.data.items})
                localStorage.setItem("videos", JSON.stringify(response.data.items));
            })
            .catch(err => console.log(err))
        }, 500)
    }

    render() {
        let progressBar;
        if(this.state.showProgressBar){
            progressBar = <div>
                                <p>Converting your file... {this.state.progressBar}%</p>
                                <LoaderBar width={this.state.progressBar}/>
                        </div>
        } else {
            progressBar = "";
        }
        let showCard;
        if(this.state.showCard){
            showCard = <DownloableCard videoDetails={this.state.snippet} fileSize={this.state.fileSize} />
        } else {
            showCard = "";
        }
        return (
            <div>
                <TextField
                    label="Recherchez une vidéo youtube.."
                    type="text"
                    fullWidth={true}
                    onChange={this.searchForTrack}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <YouTubeIcon/>
                            </InputAdornment>
                        ),
                    }}
                />
                {showCard}
                <div className="container">
                    {progressBar}
                </div>
                <div className="container">
                    <List component="nav" aria-label="main mailbox folders">
                        {this.renderVideo()}
                    </List>
                </div>
         </div>
        )
    }
}
//<PlayerFooter videoId={this.state.videoId} handlePlay={this.handlePlay}/>
