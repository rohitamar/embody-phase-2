import React from 'react';

import ParticipantScreen from './ParticipantScreen.js';
import BodilyMap from './BodilyMap.js';
import InstructionScreen from './InstructionScreen.js';
import ThankYouScreen from './ThankYouScreen.js';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

class EmbodyApp extends React.Component {
    render() {
        return (
            <Router>
                <Routes>
                    <Route path = "/" element = {<ParticipantScreen />} />
                    <Route path = "/instructions" element = {<InstructionScreen />} />
                    <Route path = "/activation"  element = {<BodilyMap color = "red"/>}/>
                    <Route path = "/deactivation" element = {<BodilyMap color = "blue" />}/>
                    <Route path = "/thankyou" element = {<ThankYouScreen />} />
                </Routes>
            </Router>
        );
    }
}

export default EmbodyApp;