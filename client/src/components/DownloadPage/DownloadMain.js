import React from 'react';

class DownloadMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stateDate: '',
            endDate: ''
        };

        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);

        alert('hello world');
    }

    handleStartDateChange(event) {

    }

    handleEndDateChange(event) {

    }

    handleSubmit() {
        
    }

    render() {
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