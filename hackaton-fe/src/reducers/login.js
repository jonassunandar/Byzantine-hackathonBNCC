
let initialState = {
    data: '',
    loading: false,
    err: false,
    errEng: false,
    authed: false,
    msg: '',
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            state.loading = true;
            state.err= false
            return Object.assign({}, state)
        case 'LOGIN_END':
            state.loading = false;
            state.msg= action.msg;
            state.err= action.err;
            state.errEng= action.errEng;
            state.authed= action.authed;
            return JSON.parse(JSON.stringify(state))
            return Object.assign({}, state)
        case 'LOGIN_ERR':
            state.loading = false;
            state.err= action.err;
            state.errEng= action.errEng;
            return Object.assign({}, state)
        case 'LOGOUT':
        case 'GETACCESS_SUCCESS':
            return Object.assign({}, initialState)
        default:
            return state
    }
}