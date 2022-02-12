import React from 'react';

import { NavLink } from "react-router-dom";

class InstructionScreen extends React.Component {

    render() {
        return (
            <div className = "InstructionScreen__wrapper">
                <div className = "InstructionScreen__title">
                    Instructions for participants are flexible and will be adapted depending on the experiment. Experimental conditions and titles during the task are also flexible.
                </div>
                <NavLink 
                    className = "InstructionScreen__button"
                    to = "/activation"
                    exact
                >
                    Proceed
                </NavLink>
            </div>
        );
    }
}

export default InstructionScreen;