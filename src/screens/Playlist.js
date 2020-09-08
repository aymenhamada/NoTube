import React from "react";
import AuthService from "../AuthService";
import VideoRendering from "../Components/VideoRendering"
import axios from "axios";

import LoaderBar from "../miniComponents/LoaderBar";
import DownloableCard from "../Components/DownloableCard"
import List from "@material-ui/core/List"

import YouTubeIcon from '@material-ui/icons/YouTube';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';



import { serverPort } from "../serverPort"
import { socket } from "../socket"



export default class Playlist extends React.Component{
    constructor(){
        super();
        this.state = {playlist: [], currentPlaylist: [] ,videoId: "",  progressBar: 1, showProgressBar: false, showCard: false, fileSize: "", userHavePlaylist: false, currentSong: 1}
        this.AuthService =  new AuthService("api");
        this.getUserPlaylist = this.getUserPlaylist.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleConversion = this.handleConversion.bind(this);
        this.handleAddToPlaylist = this.handleAddToPlaylist.bind(this);
        this.handleDeleteOfPlaylist = this.handleDeleteOfPlaylist.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }


    componentWillMount(){
        if (!this.AuthService.loggedIn()){
            return window.location.replace(window.location.origin + "/login");
        }
    }

    componentDidMount(){
        let profile = this.AuthService.getProfile();
        axios.get(serverPort.host + "/api/getPlaylist?email=" + profile.email)
            .then((response) => {
                if(!response.data.noPlaylist && response.data.length > 0){
                    this.setState({playlist: response.data, currentPlaylist: response.data, userHavePlaylist: true});
                }
            }).catch(err => console.log(err))
            socket.on("timer", (progress) => this.setState({progressBar: progress}))
            socket.on("fileReadyForDownload", (fileSize) => this.setState({showProgressBar: false, progressBar: 1, showCard: true, fileSize}))
    }


    componentDidUpdate(){
        if(this.props.changeOccursNaturally &&  this.props.currentSong > 0 && this.state.playlist.length >= this.props.currentSong){
            this.props.changeCurrentSong(this.state.playlist[this.props.currentSong - 1])
        }
    }


    handlePlay(e){
        e.target.play();
        this.setState({isLoading: false})
    }


    handleUpdate(videoId, snippet){
        let serverUri =  serverPort.host + "/api/StreamAudio?videoId="
        this.setState({videoId: serverUri + videoId, isLoading: true})
        this.props.onVideoChange(serverUri + videoId, snippet);
    }

    async handleConversion(videoId, snippet){
        snippet.videoId = videoId;
        await this.setState({showProgressBar: true, snippet, showCard: false});
        socket.emit("newVideoToConvert", videoId);
        window.scrollTo(0, 0);
    }

    handleAddToPlaylist(videoId, snippet){
        const finalSnippet = Object.assign(snippet, {videoId});
        const user = this.AuthService.getProfile().email;
        axios.post(serverPort.host + "/api/AddPlaylist", {finalSnippet, user})
            .then((response) => {
                console.log(response)
            }).catch(err => console.log(err));
    }

    async handleDeleteOfPlaylist(videoId){
        await this.setState({currentPlaylist: this.state.playlist.filter(track =>  track.videoId !== videoId), playlist: this.state.playlist.filter(track =>  track.videoId !== videoId) });
        this.setState({userHavePlaylist: this.state.playlist.length > 0 })
        axios.post(serverPort.host + "/api/deletePlaylist", {
            videoId,
            email: this.AuthService.getProfile().email
        }).then((response) => {
            console.log(response);
        }).catch(err => console.log(err))
    }

    getUserPlaylist(){
        return this.state.currentPlaylist.map((track, i) => {
            return(
                <div className="row" style={{marginBottom: "150px"}} key={i}>
                        <VideoRendering snippet={track} videoId={track.videoId} handleUpdate={this.handleUpdate} handleConversion={this.handleConversion} handleAddToPlaylist={this.handleAddToPlaylist} addPlaylistButton={false} handleDeleteOfPlaylist={this.handleDeleteOfPlaylist}/>
                </div>
            )
        })
    }

    handleSearch(e){
        let searchWords = e.target.value.toLowerCase();
        let a = this.state.playlist.filter(song => song.title.toLowerCase().includes(searchWords));
        this.setState({currentPlaylist: this.state.playlist.filter(song => song.title.toLowerCase().includes(searchWords) || song.channelTitle.toLowerCase().includes(searchWords))});
    }

    render(){
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
        let userPlaylistGrantingText;
        if(this.state.userHavePlaylist){
            userPlaylistGrantingText =   <p>Voici votre playlist !</p>
        } else {
            userPlaylistGrantingText = <p>Oh vous n'avez pas encore de playlist</p>
        }
        return(
            <div>
                 <TextField
                    label="Recherchez une musique"
                    type="text"
                    fullWidth={true}
                    onChange={this.handleSearch}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <YouTubeIcon/>
                            </InputAdornment>
                        ),
                    }}
                />
                <div className="container">
                    {showCard}
                    {progressBar}
                    <List component="nav" aria-label="main mailbox folders">
                        {userPlaylistGrantingText}
                        {this.getUserPlaylist()}
                    </List>
                </div>
            </div>
        )
    }
}
//<PlayerFooter videoId={this.state.videoId} handlePlay={this.handlePlay}/>
