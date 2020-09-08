import React from "react";
import LoginForm from "../miniComponents/LoginForm"
import AuthService from "../AuthService";
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from "@material-ui/core/Paper"

import {navigate} from "@reach/router"



const styles = (theme) => ({
    root: {
        flexGrow: 1,
        marginTop: "5%",
      },
      paper: {
        height: 500,
        width: 400
      },
  });


class Login extends React.Component{
    constructor(props){
        super(props);
        this.AuthService = new AuthService("api");
    }

    async componentWillMount(){
        if (this.AuthService.loggedIn()){
            return window.location.replace(window.location.origin);
        }
    }


    render(){
        const { classes } = this.props;
        return(
            <Grid container spacing={2} className={classes.root}>
                <Grid item xs={12}>
                    <Grid container justify="center" spacing={2}>
                        <Paper className={classes.paper}>
                            <LoginForm login={this.props.login}/>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default withStyles(styles)(Login);