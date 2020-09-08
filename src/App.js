import React from 'react';
import './App.css';
import AuthService from "./AuthService"

//Router

import {Router, Link, navigate} from "@reach/router";

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { serverPort } from "./serverPort"


//Screens

import MainPage from "./screens/MainPage";
import Inscription from "./screens/Inscription";
import Login from "./screens/Login";
import Playlist from "./screens/Playlist";
import PlayerFooter from "./miniComponents/PlayerFooter"

import Header from "./Components/Header";

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

export default class App extends React.Component{
    constructor(){
        super();
        this.AuthService = new AuthService("api");
        this.state = {userName: "", videoId: "", snippet: {}, videoTriggered: false, showSnackLog: null, showSnackLogout: null, currentSong: 1, changeOccursNaturally: true}
        this.logout = this.logout.bind(this);
        this.login = this.login.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.changeVideo = this.changeVideo.bind(this);
        this.audioEnded = this.audioEnded.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.changeCurrentSong = this.changeCurrentSong.bind(this);
    }


    async componentWillMount(){
        console.log("no");
        if(this.AuthService.loggedIn()){
            this.setState({userName: this.AuthService.getProfile().email});
        }
        if(localStorage.getItem("video")){
            const videoInformation = JSON.parse(localStorage.getItem("video"));
            await this.setState({videoId: videoInformation.videoId, snippet: videoInformation.snippet});
            if(this.state.snippet.hasOwnProperty("position")){
                await this.setState({currentSong: this.state.snippet.position})
                console.log(this.state.currentSong);
            }
        }
    }

    logout(){
        this.AuthService.logout();
        this.setState({userName: false, showSnackLogout: true});
        return navigate('/login')
    }

    login(){
        this.setState({userName: this.AuthService.getProfile().email, showSnackLog: true});
        return navigate('/')
    }

    handlePlay(e){
        if(this.state.videoTriggered){
                e.target.play();
        }
    }

    async changeVideo(videoId, snippet){
        if(videoId == this.state.videoId){
            const audio = document.querySelector("audio");
            audio.play();
        }
        if(snippet.hasOwnProperty("position")){
            this.setState({changeOccursNaturally: false, currentSong: snippet.position})
        }
        this.setState({videoId, snippet, videoTriggered: true});
        localStorage.setItem("video", JSON.stringify({snippet, videoId}));
    }

    handleClose = (event, reason) => {
        if (reason === "clickaway"){
            return;
        }
        this.setState({showSnackLog: null, showSnackLogout: null})
    }

   async audioEnded(e){
        if(window.location.pathname === "/playlist"){
            this.setState({currentSong: this.state.currentSong + 1, changeOccursNaturally: true});
        }
    }

   async changeCurrentSong(snippet){
        let videoId =  serverPort.host + "/api/StreamAudio?videoId=" + snippet.videoId
        await this.setState({videoId, snippet, changeOccursNaturally: false})
        localStorage.setItem("video", JSON.stringify({snippet, videoId}));
    }

    render(){
        return(
            <div className="App">
                <Header isLoggedIn={this.state.userName} logout={this.logout}/>
                <Router>
                    <Login login={this.login} path="login"/>
                    <Inscription path="signup"/>
                    <MainPage onVideoChange={this.changeVideo} path="/"/>
                    <Playlist onVideoChange={this.changeVideo} currentSong={this.state.currentSong}  changeOccursNaturally={this.state.changeOccursNaturally}  changeCurrentSong={this.changeCurrentSong} path="playlist"/>
                </Router>
                <Snackbar open={this.state.showSnackLog} autoHideDuration={3000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="success">
                        Sucessfully logged in
                    </Alert>
                </Snackbar>
                <Snackbar open={this.state.showSnackLogout} autoHideDuration={3000} onClose={this.handleClose}>
                    <Alert onClose={this.handleClose} severity="error">
                        You just logged off
                    </Alert>
                </Snackbar>
                {this.state.userName ? <PlayerFooter videoId={this.state.videoId} handlePlay={this.handlePlay}  snippet={this.state.snippet} audioEnded={this.audioEnded}/> :  ""}
            </div>
        )
    }
}