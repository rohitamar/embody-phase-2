import React from 'react';

class ParticipantScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit() {

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

export default ParticipantScreen;
