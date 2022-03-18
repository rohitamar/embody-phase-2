import React from 'react';
const axios = require('axios');

class DownloadMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: '',
            endDate: '',
            authentication: false
        };

        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
    }

    componentDidMount() {
        this.promptPassword();
    }

    //We are using a very primitive way to authenticate data collection
    //differenceBetweenActivationAndDeactivationPerhaps, in a more robust and secure system, you would want to look into React Authentication Routing (with React-Router)
    //Our system didn't need to be this complex, so I just use the prompt and ask for the password

    shouldComponentUpdate(prevState, prevProps) {
        return this.authentication;
    }

    promptPassword() {
        var promptedPassword = window.prompt("Enter password: ");

        if(promptedPassword == 'rohitamarnath') {
            this.setState({
                authentication: true
            });
        }
    }

    handleStartDateChange(event) {
        this.setState({
            startDate: event.target.startDate
        });
    }

    handleEndDateChange(event) {
        this.setState({
            endDate: event.target.endDate
        });
    }

    handleSubmit() {
        
    }

    render() {
        const auth = this.state.authentication;
        if(!this.authentication) {
            return (
                <div>
                    <b>Invalid Authentication.</b>
                </div>
            );
        }
        return (
        <div>
            <form
                onSubmit = {this.handleSubmit}
            >
                <input
                    value = {''}
                    onChange = {this.handleStartDateChange}
                />
                <input
                    value = {''}
                    onChange = {this.handleEndDateChange}
                />
            </form>
        </div>
        );
    }
}

export default DownloadMain;