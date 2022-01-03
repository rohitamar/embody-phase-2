//React
import React from 'react';
import ReactDOM from 'react-dom';

//CSS
import './styles/EmbodyApp.css';

//App
import EmbodyApp from './components/EmbodyApp';

//Service Worker
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<EmbodyApp />, document.getElementById('root'));

//Register/Unregister
serviceWorker.unregister();
