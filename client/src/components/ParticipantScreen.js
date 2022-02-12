import { instanceOf } from 'prop-types';
import React from 'react';

import Cookies from 'universal-cookie';

import { useNavigate } from "react-router";

class ParticipantScreen extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);

        const cookies = new Cookies();

        this.state = {
            participantID: cookies.get('participantID') || -1
        };
    }

    handleSubmit() {
        this.props.navigate('/instructions');
    }

    handleInputChange() {
        
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
                                value = {this.state.participantID == -1 ? null : this.state.participantID}
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
