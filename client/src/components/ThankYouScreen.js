import React from 'react';

class ThankYouScreen extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className = "ThankYouScreen__wrapper">
                <div className = "ThankYouScreen__title">
                    Thank you for participating in this study!
                </div>
            </div>
        );
    }
}

export default ThankYouScreen;