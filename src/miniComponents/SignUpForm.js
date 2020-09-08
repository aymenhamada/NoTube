import React from "react";
import axios from "axios";
import { navigate, Link } from "@reach/router";
import { serverPort } from "../serverPort";


export default class signUpForm extends React.Component{
    constructor(){
        super();
        this.state = {errors: {}, email: "", emailConfirmation: "", password: "", confirmationPassword: ""};
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleError = this.handleError.bind(this);
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value});
    }


    handleError(errors){
        let nameOfErrors = Object.keys(errors);
        nameOfErrors.forEach((name) => {
            const target = document.querySelector(`input[name="${name}"]`);
            target.classList.add("errorInput");
        });
        this.setState({errors});
    }

    handleSubmit(e){
        e.preventDefault();
        const inputs = document.querySelectorAll(".frame input");
        inputs.forEach(input => input.classList.remove("errorInput"))
        const userData = {
            email: this.state.email,
            emailConfirmation: this.state.emailConfirmation,
            password: this.state.password,
            confirmationPassword: this.state.confirmationPassword,
        }
        axios.post(`${serverPort.host}/api/register`, userData)
        .then((res) => {
            navigate("/", {state: {newUser: true}});
        })
        .catch(err => {
            if(err.response.data){
                this.handleError(err.response.data);
            }
        })
    }

    render(){
        return(
            <div className="container">
                <div className="frame">
                <form onSubmit={this.handleSubmit}>
                    <div className="tab">
                        <p className="accountSurfeurText">Inscription</p>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="text" className="form-control customized" onChange={this.onChange} name="email" id="email"/>
                            <p className="error">{this.state.errors.email}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailConfirmation">Confirmation Email</label>
                            <input type="text" className="form-control customized" onChange={this.onChange} name="emailConfirmation" id="emailConfirmation"/>
                            <p className="error">{this.state.errors.emailConfirmation}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Mot de passe</label>
                            <input type="password" className="form-control customized" onChange={this.onChange} name="password" id="password"/>
                            <p className="error">{this.state.errors.password}</p>
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmationPassword">Confirmation mot de passe</label>
                            <input type="password" className="form-control customized" onChange={this.onChange} name="confirmationPassword" id="confirmationPassword"/>
                            <p className="error">{this.state.errors.confirmationPassword}</p>
                        </div>
                        <div className="buttonHolder">
                            <button type="submit" className="btn btn-primary">Inscription</button>
                        </div>
                        <Link  to="/login" className="anchorCustom">J'ai déjà un compte</Link>
                    </div>
                </form>
                </div>
            </div>
        )
    }
}