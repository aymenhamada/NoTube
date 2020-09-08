import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Link, navigate } from "@reach/router";



const styles = (theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    appBar:{
        background: "#c00"
    }
  });


const renderIfExists = (component, condition) => {
    if(condition){
        return component;
    } else {
        return "";
    }
}

class Header extends React.Component{
    constructor(props){
        super(props);
    }



    render(){
        const { classes, isLoggedIn, logout } = this.props
        return(
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={() => navigate("/")}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                        </Typography>
                            {renderIfExists(<Button  onClick={() => navigate("/login")} color="inherit">Login</Button>, !isLoggedIn)}
                            {renderIfExists(<Button  onClick={() => navigate("/signup")} color="inherit">Register</Button>, !isLoggedIn)}
                            {renderIfExists(<Button  onClick={() => navigate("/playlist")} color="inherit">Playlist</Button>, isLoggedIn)}
                            {renderIfExists(<Button  onClick={() => logout()} color="inherit">Logout</Button>, isLoggedIn)}
                    </Toolbar>
                </AppBar>
          </div>
        )
    }
}

export default withStyles(styles)(Header);