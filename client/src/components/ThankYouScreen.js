import React from 'react';
import Cookies from 'universal-cookie';

class ThankYouScreen extends React.Component {

    constructor(props) {
        super(props);
        this.cookies = new Cookies();
    }

    componentDidMount() {
        const TIME_COOKIE = 2592000;
        const PATH_COOKIE = '/';

        const COOKIE_SETTINGS = {
            path: PATH_COOKIE,
            maxAge: TIME_COOKIE
        };

        this.cookies.set("dateEnteredActivation", "NO DATE", COOKIE_SETTINGS);
        this.cookies.set("dateEnteredDeactivation", "NO DATE", COOKIE_SETTINGS);
        this.cookies.set("dateLeftActivation", "NO DATE", COOKIE_SETTINGS);
        this.cookies.set("dateLeftDeactivation", "NO DATE", COOKIE_SETTINGS);
    }

    render() {
        return (
            <div className = "ThankYouScreen__wrapper">
                <div className = "ThankYouScreen__title">
                    Thank you! Please close this tab now and go back to Qualtrics.
                </div>
            </div>
        );
    }
}

export default ThankYouScreen;