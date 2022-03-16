import React from 'react';

import ParticipantScreen from './ParticipantScreen.js';
import BodilyMap from './BodilyMap.js';
import InstructionScreen from './InstructionScreen.js';
import ThankYouScreen from './ThankYouScreen.js';
import DownloadScreen from './DownloadPage/DownloadMain.js';

import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

class EmbodyApp extends React.Component {
    constructor(props) {
        super(props);
        this.cookies = new Cookies();    
        this.authentication = this.cookies.get("participantID") == undefined;
    }

    render() {
        return (
            <Router>
                <Routes>
                    <Route path = "/" element = {<ParticipantScreen />} />
                    <Route path = "/instructions" element = {this.authentication ? <ParticipantScreen /> : <InstructionScreen />} />
                    <Route path = "/activation"  element = {this.authentication ? <ParticipantScreen /> : <BodilyMap color = "red"/>}/>
                    <Route path = "/deactivation" element = {this.authentication ? <ParticipantScreen /> : <BodilyMap color = "blue"/>}/>
                    <Route path = "/thankyou" element = {<ThankYouScreen />} />
                    <Route path = "/downloadData" element = {<DownloadScreen />} />
                </Routes>
            </Router>
        );
    }
}

export default EmbodyApp;