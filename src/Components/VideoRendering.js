import React from "react"
import { serverPort } from "../serverPort"
import Button from '@material-ui/core/Button';
import ListItem from '@material-ui/core/ListItem';

import Card from '@material-ui/core/Card';

import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/core/styles';


const styles = (theme) => ({
    root: {
        maxWidth: 800,
      },
      media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        width: 800
      },
      expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
      },
      expandOpen: {
        transform: 'rotate(180deg)',
      },
      text:{
          maxWidth: 800
      }
  });



class VideoRendering extends React.Component{
    constructor(props){
        super(props);
    }


    getValidDate(date){
        let splited = date.split("-");
        let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aôut", "Septembre", "Octobre", "Novembre", "Décembre"];
        return `Le ${splited[2][0] + splited[2][1]} ${months[ (parseInt( splited[1], 10) - 1) ]} ${splited[0]}`;
    }

    render(){
        let button;
        const { classes, handleUpdate, handleConversion, handleAddToPlaylist, addPlaylistButton} = this.props;
        if(addPlaylistButton){
            button = <Button variant="contained" onClick={() => handleAddToPlaylist(this.props.videoId, this.props.snippet, this.props.id)}>Add to playlist</Button>
        } else {
            const handleDeleteOfPlaylist = this.props.handleDeleteOfPlaylist;
            button = <Button variant="contained" onClick={() => handleDeleteOfPlaylist(this.props.videoId)}>Delete of playlist</Button>
        }
        return(
            <ListItem>
                 <Card className={classes.root}>
                    <CardHeader
                        title={this.props.snippet.title.replace("&amp;", "&")}
                        subheader={this.getValidDate(this.props.snippet.publishTime)}
                    />
                    <CardMedia
                        className={classes.media}
                        image={this.props.snippet.thumbnails.high.url}
                        title="Paella dish"
                    />
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p" className={classes.text}>
                            {this.props.snippet.description}
                        </Typography>
                    </CardContent>
                    <CardActions disableSpacing>
                        <Button style={{backgroundColor: "black", color:"white"}} variant="contained" onClick={() => handleUpdate(this.props.videoId, this.props.snippet)}>Play this song</Button>
                        <Button   variant="contained" color="primary" onClick={() => handleConversion(this.props.videoId, this.props.snippet)}>Download to mp3</Button>
                        {button}
                    </CardActions>
            </Card>

            </ListItem>

        )
    }
}


export default withStyles(styles)(VideoRendering);