import React from "react";


import SignUpForm from "../miniComponents/SignUpForm";
import AuthService from "../AuthService"
import { navigate } from "@reach/router";


export default class Inscription extends React.Component{
    constructor(){
        super();
        this.state = {transition: false}
        this.AuthService = new AuthService("api")
    }

    componentWillMount(){
        if(this.AuthService.loggedIn()){
            return window.location.replace(window.location.origin);
        }
    }

    render(){
        return(
            <div>
               <SignUpForm/>
            </div>
        )
    }
}