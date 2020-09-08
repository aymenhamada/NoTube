import React from "react";
import { serverPort } from "../serverPort"


import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';

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


class DownloableCard extends React.Component{
    constructor(props){
        super(props);
    }

    getValidDate(date){
        let splited = date.split("-");
        let months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aôut", "Septembre", "Octobre", "Novembre", "Décembre"];
        return `Le ${splited[2][0] + splited[2][1]} ${months[ (parseInt( splited[1], 10) - 1) ]} ${splited[0]}`;
    }

    render(){
        const { classes } = this.props;
        return(
            <div className="container">
                <List>
                    <Card className={classes.root}>
                        <CardHeader
                            title={this.props.videoDetails.title.replace("&amp;", "&")}
                            subheader={this.getValidDate(this.props.videoDetails.publishTime)}
                        />
                        <CardMedia
                            className={classes.media}
                            image={this.props.videoDetails.thumbnails.high.url}
                            title="Paella dish"
                        />
                        <CardContent>
                            <Typography variant="body2" color="textSecondary" component="p" className={classes.text}>
                                {this.props.videoDetails.description}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing>
                            <a  className="btn btn-danger" download href={serverPort.host + "/api/youtube/download?videoId=" + this.props.videoDetails.videoId + "&fileName=" + this.props.videoDetails.title.replace(/&quot;/g,'"').replace(/ /g,"%20")}>Download your file ({this.props.fileSize})</a>
                        </CardActions>
                    </Card>
                </List>
            </div>
        )
    }
}

export default withStyles(styles)(DownloableCard);