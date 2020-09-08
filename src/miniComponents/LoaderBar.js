import React from "react";



export default class LoaderBar extends React.Component{
    constructor(props){
        super(props);
    }


    render(){
        return(
            <div id="myProgress">
                <div id="myBar" style={{width: this.props.width + "%"}}></div>
            </div>
        )
    }
}