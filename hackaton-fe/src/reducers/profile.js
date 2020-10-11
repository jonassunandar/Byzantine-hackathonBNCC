
let initialState = {
    user: {
        // name: 'Jonas Sunandar',
        // firstName: 'Jonas',
        // lastName: 'Sunandar',
        // initial: 'JS',
        // email: 'jonassunandar@jonas.sunandar'
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
       
        case 'EVENT_GET_DETAIL_ERR':
            state.detailLoading = false
            state.loading = false
            state.err = action.err
            state.errEng = action.errEng
            return Object.assign({}, state);
        default:
            return state
    }
}