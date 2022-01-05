import React from 'react';

import ParticipantScreen from './ParticipantScreen.js';
import BodilyMap from './BodilyMap.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CookiesProvider } from 'react-cookie';


class EmbodyApp extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CookiesProvider>
                <Router>
                    <Routes>
                        <Route path = "/" element = {<ParticipantScreen />} />
                        <Route path = "/activation"  element = {<BodilyMap color = "red"/>}/>
                        <Route path = "/deactivation" element = {<BodilyMap color = "blue" />}/>
                    </Routes>
                </Router>
            </CookiesProvider>
        );
    }
}

export default EmbodyApp;