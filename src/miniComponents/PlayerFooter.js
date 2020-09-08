import React from "react";
import AppBar from "@material-ui/core/AppBar"

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
  root: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: "30%"
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 300,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});

class PlayerFooter extends React.Component{
    constructor(props){
        super(props);
    }




    render(){
        const { classes, handlePlay, snippet, audioEnded} = this.props;
        return(
            <AppBar position="fixed" color="primary" style={{top: "auto", bottom: 0, backgroundColor: "#2c2c2c", position: "fixed"}}>
                <Card className={classes.root}>
                  <div className={classes.details}>
                    <CardContent className={classes.content}>
                      <Typography component="h5" variant="h5">
                        {snippet.channelTitle}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {snippet.title}
                      </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                      <audio  controls src={this.props.videoId} onCanPlay={(e) => handlePlay(e)}  onEnded={(e) =>  audioEnded(e) }/>
                    </div>
                  </div>
                  <CardMedia
                    className={classes.cover}
                    image={snippet.thumbnails && snippet.thumbnails.default.url || "none"}
                    title="Live from space album cover"
                  />
                </Card>
            </AppBar>
        )
    }
}

export default  withStyles(styles)(PlayerFooter);