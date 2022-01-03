import React from 'react';

import ParticipantScreen from './ParticipantScreen.js';
import BodilyMapCanvas from './BodilyMapCanvas.js';

import { BrowserRouter as Router, Route } from "react-router-dom";

export default class EmbodyApp extends React.Component {

      constructor(props) {
            super(props);
            this.state = {
                  sample: 1
            };
      }

      render() {
            return (
                  <Router>
                        <div>
                              <Route exact path = "/">
                                    <ParticipantScreen />
                              </Route>
                              <Route exact path = "/activation">
                                    <BodilyMapCanvas />
                              </Route>
                              <Route exact path = "/deactivation">
                                    <BodilyMapCanvas />
                              </Route>
                        </div>
                  </Router>
            );
      }
}