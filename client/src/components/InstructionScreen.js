import React from 'react';
import Cookies from 'universal-cookie';
import { NavLink } from "react-router-dom";

class InstructionScreen extends React.Component {

    constructor(props) {
        super(props);
        this.cookies = new Cookies();
    }

    
    
    render() {
        return (
            <div className = "InstructionScreen__wrapper">
                <div className = "InstructionScreen__title">
                    In this task, you need to indicate where you feel sensations in your body at the present moment. 
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