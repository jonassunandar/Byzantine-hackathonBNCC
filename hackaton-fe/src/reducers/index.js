import login from './login';
import register from './register';
import profile from './profile';
import {combineReducers} from 'redux';

const rootReducer = combineReducers({
    login,
    register,
    profile
});

export default rootReducer;
