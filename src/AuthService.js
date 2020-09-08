import decode from "jwt-decode";
import axios from "axios";
import { serverPort } from "./serverPort";

export default class AuthService{
    constructor(type){
        this.domain = serverPort.host;
        this.type = type;
        this.login = this.login.bind(this);
    }


    login(email, password, errorCallback){
        return axios.post(`${this.domain}/${this.type}/login`, {email, password})
            .then(res => {
                this.setToken(res.data.token);
                return Promise.resolve(res.data.token);
            })
            .catch(err => {
                errorCallback(err);
            })
    }

    loggedIn(){
        try{
            const token =  this.getToken();
            decode(token);
            return !!token && !this.isTokenExpired(token);
        } catch(error){
            return false;
        }
    }

    isTokenExpired(token){
        try{
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            } else {
                return false;
            }
        }
        catch(err){
            return false;
        }
    }

    setToken(idToken){
        localStorage.setItem("id_token", idToken);
    }

    getToken(){
        return localStorage.getItem("id_token");
    }

    logout(){
        localStorage.removeItem("id_token");
    }

    getProfile(){
        return decode(this.getToken());
    }

}