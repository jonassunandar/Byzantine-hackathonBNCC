
let initialState = {
    data: '',
    loading: false,
    authed: false,
    accessList: [],
    err: false,
    errEng: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'REGISTER_START':
            // console.log('login start')
            state.loading = true;
            state.err= false
            return Object.assign({}, state)
        case 'REGISTER_END':
            state.loading = false;
            state.msg= action.msg;
            state.err= action.err;
            state.errEng= action.errEng;
            // console.log('login end', state)
            return Object.assign({}, state)
        case 'REGISTER_ERR':
            state.loading = false;
            state.result = action.data;
            state.err= action.err;
            state.errEng= action.errEng;
            // console.log('login err', state)
            return Object.assign({}, state)
        default:
            return state
    }
}