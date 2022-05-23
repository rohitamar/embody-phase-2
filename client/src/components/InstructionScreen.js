import React from 'react';
import Cookies from 'universal-cookie';
import { NavLink } from "react-router-dom";
import axios from 'axios';

class InstructionScreen extends React.Component {

    constructor(props) {
        super(props);
        this.cookies = new Cookies();
        this.firstSessionInstruction = "Please read the instructions carefully.\n\nYou will first drink some water."
        + " Then, you will be presented with pictures of two blank human bodies. "
        + " Think carefully what you feel in your body, your task is to color the bodily regions whose activity you feel "
        + "changing after drinking water.\n\nFor the first body, color the regions whose activity you feel increasing or getting stronger. "
        + "For the second body, color the regions whose activity you feel decreasing or getting weaker. You can color any region of the bodies you feel appropriate," 
        + " from the head to the toes using your finger. "
        + "When you have finished coloring the bodies,  you can close the tab and continue with the Qualtrics questionnaire."

        this.otherSessionInstruction = "Please read the instructions carefully.\n\nToday we are interested in understanding where you feel sensations in your body at the present moment.\n\nYou will be presented with pictures of two blank human bodies. Think carefully what you feel in your body, your task is to color the bodily regions where you feel activity.\nFor the first body, color the regions whose activity you feel stronger. For the second body, color the regions whose activity you feel weaker. You can color any region of the bodies you feel appropriate, from the head to the toes using your finger. When you have finished coloring the bodies,  you can close the tab and continue with the Qualtrics questionnaire.";

        this.state = {
            participantID: this.cookies.get("participantID"),
            determineSession: true
        };

        axios.get('https://bodily-maps.herokuapp.com/participant/find', {
            params: {
                id: this.state.participantID
            }
        }).then((res) => {
            this.setState({
                determineSession: (res.data.sessionNumber == 1) 
            });
        });
    }

    
    
    render() {
        return (
            <div className = "InstructionScreen__wrapper">
                <div className = "InstructionScreen__title">
                    { this.state.determineSession ? this.firstSessionInstruction : this.otherSessionInstruction }
                </div>
                <NavLink 
                    className = "InstructionScreen__button"
                    to = {"/activation"}
                    exact
                >
                    Proceed
                </NavLink>
            </div>
        );
    }
}

export default InstructionScreen; 