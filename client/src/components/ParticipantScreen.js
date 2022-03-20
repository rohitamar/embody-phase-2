import { instanceOf } from 'prop-types';
import React from 'react';

import Cookies from 'universal-cookie';

import { useNavigate } from "react-router";
import axios from 'axios';

class ParticipantScreen extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.cookies = new Cookies();
        
        this.state = {
            participantID: this.cookies.get("participantID") || 0
        };
    }

    handleSubmit() {
        //Settings for the cookies we are using
        //These can be changed if you want the cookie to exist for longer
        //The one that I have used lasts for 1 month and 1 week
        //Essentially, you want TIME_COOKIE to be the duration of your experiment, so it'll vary from one experiment to the next

        const TIME_COOKIE = 2592000;
        const PATH_COOKIE = '/';

        const COOKIE_SETTINGS = {
            path: PATH_COOKIE,
            maxAge: TIME_COOKIE
        };

        if(this.state.participantID == 0) {
            alert('Please enter a participant ID before submitting!');
        } else {
            axios.get('https://bodily-maps.herokuapp.com/participant/find', {
                params: {
                    id: this.state.participantID
                }
            }).then((res) => {
                if(res) {
                    this.cookies.set("sessionNumber", res.sessionNumber + 1, COOKIE_SETTINGS);
                    axios.put('https://bodily-maps.herokuapp.com/participant/update', {
                        params: {
                            id: this.state.participantID,
                            sessNum: res.sessionNumber + 1
                        }
                    });
                } else {
                    
                    axios.post('https://bodily-maps.herokuapp.com/participant/add', {
                        participantID: this.state.participantID,
                        sessionNumber: 1
                    });

                    this.cookies.set("sessionNumber", 1, COOKIE_SETTINGS);
                }
            });
            //We always will just need to set whatever inputted participantID as the cookie's value
            this.cookies.set("participantID", this.state.participantID, COOKIE_SETTINGS);
            
            //Use Navigate from React-Router to manually route to the instructions page
            this.props.navigate('/instructions');
        }
    }

    handleInputChange(event) {
        this.setState({
            participantID: event.target.value
        });
    }

    render() {
        return (
            <div className = "ParticipantScreen__wrapper">
                <h1 className = "ParticipantScreen__header">Bodily Sensations Study</h1>
                <form 
                    className = "ParticipantScreen__form" 
                    onSubmit = {this.handleSubmit}
                >
                    <div className = "ParticipantScreen__inputWrapper">
                        <label className = "ParticipantScreen__inputLabel">
                            Participant ID: 
                            <input 
                                value = {this.state.participantID}
                                className = "ParticipantScreen__inputID" 
                                type = "number" 
                                onChange = {this.handleInputChange} 
                            />    
                        </label>
                        <input className = "ParticipantScreen__submitButton" type = "submit" value = "Submit" />
                    </div>
                </form>
            </div>
        );
    }
}

export default function App(props) {
    const navigation = useNavigate();

    return <ParticipantScreen {...props} navigate = {navigation} />; 
}
