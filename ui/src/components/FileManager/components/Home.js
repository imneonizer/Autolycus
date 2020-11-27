import React, { Component } from 'react';
import AddMagnet from "./AddMagnet";
import TorrentCard from "./TorrentCard";
import FileCard from "./FileCard";
import "../styles/Home.css";
import {getFileDetails} from "../services/FileService";
import cogoToast from 'cogo-toast';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {card: null, data:null, parent_items: []}
        this.cardHandler = this.cardHandler.bind(this);
        this.goBack = this.goBack.bind(this);
        this.updateCard = this.updateCard.bind(this);
    }

    componentDidMount() {
        this.props.tFetcher(true);
    }
      
    componentWillUnmount() {
        this.props.tFetcher(false);
    }

    cardHandler(card){
        getFileDetails(card.hash)
        .then( response => {
            if (response.ok){
                response.json().then(json => {
                    this.setState({card:card, data:json})
                })
            }else {
                cogoToast.error("file not found", {position: "top-center", hideAfter: 1});
            }
        }).catch( err => {
            console.log("[ERROR] from getFileDetails:", err)
        })
    }

    goBack(){
        let previous_item = this.state.parent_items.slice(-1)[0];
        this.setState({data: previous_item, parent_items: this.state.parent_items.filter(i => i !== previous_item)});
    }

    updateCard(data, previous_item){
        if (data.type === "directory"){
            this.setState({ data: data, parent_items: this.state.parent_items.concat([previous_item]) })
        }else {
            if ([".mkv", ".mp4"].includes(data.ext)){
                console.log("video file clicked");
            }
        }
    }

    render(){
        if (this.state.data){
            return (
                <div>
                    <AddMagnet/>
                    <FileCard data={this.state.data} tFetcher={this.props.tFetcher} goBack={this.goBack} updateCard={this.updateCard}/>
                </div>
            )
        } else {
            return(
                <div>
                    <AddMagnet/>
                    {this.props.torrents.map((data) => {return <TorrentCard data={data} cardHandler={this.cardHandler}/>})}
                </div>
            )
        }
    }

}

export default Home;