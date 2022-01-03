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
                              <Route path = "/">
                                    <ParticipantScreen />
                              </Route>
                              <Route path = "/activation">
                                    <div>
                                          Hello World
                                    </div>
                              </Route>
                              <Route path = "/deactivation">
                                    <BodilyMapCanvas />
                              </Route>
                        </div>
                  </Router>
            );
      }
}