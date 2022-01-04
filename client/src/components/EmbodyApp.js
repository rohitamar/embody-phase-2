import React from 'react';

import ParticipantScreen from './ParticipantScreen.js';
import BodilyMapCanvas from './BodilyMapCanvas.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { CookiesProvider } from 'react-cookie';

import configureStore from '../store/configureStore';
import { Provider } from 'react-redux';

//const store = configureStore();

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
                            <Route path = "/activation" element = {<BodilyMapCanvas />} />
                        </Routes>
                    </Router>
                </CookiesProvider>
            
        );
    }
}

export default EmbodyApp;