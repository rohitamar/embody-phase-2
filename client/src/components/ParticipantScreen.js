import React from 'react';

import { useNavigate } from "react-router";
import { withCookies } from "react-cookie";

class ParticipantScreen extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

    var App = <ParticipantScreen {...props} navigate = {navigation} />; 
    return withCookies(App);
}
