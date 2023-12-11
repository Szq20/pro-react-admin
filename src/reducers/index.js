import { combineReducers } from 'redux'
import inReducer from './increment'
import deReducer from './decrement'
import deReducer from './auth'

const reducers = {
  inReducer,
  deReducer,
}

const rootReducer = combineReducers(reducers)

export default rootReducer
