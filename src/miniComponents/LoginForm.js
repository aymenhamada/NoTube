import React from "react";
import { navigate, Link } from "@reach/router"
import AuthService from "../AuthService";

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import AccountCircle from '@material-ui/icons/AccountCircle';
import VpnLockIcon from '@material-ui/icons/VpnLock';
import Button from '@material-ui/core/Button';
import Logo from "../public/SPOTIFY.png";





export default class LoginForm extends React.Component{
    constructor(props){
        super(props);
        this.AuthService = new AuthService("api");
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {email: "", password: "", error: {}}
    }



    handleSubmit(e){
        e.preventDefault();
        this.AuthService.login(this.state.email, this.state.password, (err) => {
            this.setState({error: err.response.data});
        }).then((res) => {
            if(res !== undefined){
                this.props.login();
            }
        })

    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value});
    }

    render(){
        return(
            <div>
                <form onSubmit={this.handleSubmit} autoComplete="off">
                    <img src={Logo} style={{height: "200px", width: "200px", marginLeft: "20%"}}/>
                    <div style={{marginBottom: "50px"}}>
                        <TextField
                            error={this.state.error.hasOwnProperty("email") || this.state.error.hasOwnProperty("err")}
                            id="email"
                            label="Email"
                            name="email"
                            fullWidth={true}
                            variant="outlined"
                            onChange={this.onChange}
                            helperText={this.state.error.email || this.state.error.err}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccountCircle />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div>
                        <TextField
                            error={this.state.error.hasOwnProperty("password") || this.state.error.hasOwnProperty("err")}
                            id="password"
                            label="Mot de passe"
                            name="password"
                            type="password"
                            variant="outlined"
                            fullWidth={true}
                            onChange={this.onChange}
                            helperText={this.state.error.password || this.state.error.err}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VpnLockIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                    <div>
                        <Button style={{marginLeft: "40%", marginTop: "50px"}} type="submit" color="secondary" variant="contained">Login</Button>
                    </div>
                </form>
            </div>
        )
    }
}
    /*
                            <p className="error">{this.state.error.email || this.state.error.password || this.state.error.err}</p>
                            <button type="submit" className="btn  btn-primary">Connexion</button>
*/
