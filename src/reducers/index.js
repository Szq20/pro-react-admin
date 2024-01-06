import {combineReducers} from 'redux';
import inReducer from './increment';
import deReducer from './decrement';
import user from './user';


const reducers = {
    inReducer,
    deReducer,
    user
};

const rootReducer = combineReducers(reducers);

export default rootReducer;
