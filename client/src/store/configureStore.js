import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import coordinatesReducer from '../reducers/coordinates.js';
import metadataReducer from '../reducers/metadata.js';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {

    const store = createStore(
        combineReducers({
            coordinates: coordinatesReducer,
            metadata: metadataReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
  
    return store;
 
};