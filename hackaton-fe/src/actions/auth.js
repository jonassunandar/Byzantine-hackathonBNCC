import { api } from '../api';

const login = (data) => {
    try{
        return async dispatch => {
            dispatch({
                type: 'LOGIN_START',
            })
            dispatch(await getLoginData(data))
        }
    }catch(e){
        console.log('error at login start', e);
    }
}

const getLoginData = async (data) => {
    let body = new FormData();
    body.set('email', data.email)
    body.set('password', data.password);
    
    try{
        const res = await api.post_noAuth('login', body)
        
        if (res.data.statusCode === 200 ){
            return async dispatch => {
                dispatch({
                    type: 'LOGIN_END',
                    msg: res.data.message,
                    err: res.data.error_message,
                    errEng: res.data.error_message,
                })
                if(res.data.message === 'Success'){
                    res.data.data.user.role_id === 1 ? dispatch(setProfile(res.data)) : 
                    dispatch({
                        type: 'LOGIN_END',
                        data: '',
                        err: 'Mohon maaf, akun ini tidak diberi akses masuk ke web, hubungi administrator untuk info lebih lanjut',
                        errEng: 'We are sorry, this account is unauthorized to login, please contact the administrator.',
                    })
                }
            }
        }else{
            return async dispatch => {
                dispatch(err('LOGIN_ERR'))
            }
        }
    }catch(e){
        console.log('error at Login', e)
        return async dispatch => {
            dispatch(err('LOGIN_ERR'))
        }
    }
}

const register = (data) => {
    try{
        return async dispatch => {
            dispatch({
                type: 'REGISTER_START',
            })
            dispatch(await callRegisterAPI(data))
        }
    }catch(e){
        console.log('error at login start', e);
    }
}

const callRegisterAPI = async (data) => {
    let body = new FormData();
    body.set('email', data.email)
    body.set('password', data.password);
    body.set('name', data.name);
    try{
        const res = await api.post_noAuth('register', body)
        
        if (res.data.statusCode === 200){
            return async dispatch => {
                dispatch({
                    type: 'REGISTER_END',
                    msg: res.data.message,
                    data: res.data.data,
                    err: res.data.error_message,
                    errEng: res.data.error_message
                })
            }
        }else{
            return async dispatch => {
                dispatch(err('REGISTER_ERR'))
            }
        }
    }catch(e){
        console.log('error at registering', e)
        return async dispatch => {
            dispatch(err('REGISTER_ERR'))
        }
    }
}

const setProfile = (data) => {
    try{
        localStorage.setItem('authed', true)
        localStorage.setItem('access', data.data.token)
        localStorage.setItem('profile', JSON.stringify(data.data.user))
        localStorage.setItem('expired', JSON.stringify([parseInt(data.data.expires/2) + Math.round((new Date()).getTime() / 1000), data.data.expires + Math.round((new Date()).getTime() / 1000),]))
        return async dispatch => {
            dispatch({
                type: 'LOGIN_END',
                msg: data.message,
                authed: true
            })
            dispatch(await getAccess())
        }
    }catch(e){
        console.log('error at getting profile', e)
        return async dispatch => {
            dispatch({type: 'LOGIN_ERR',})
        }
    }
}

const getAccess = async () => {
    try{
        const res = await api.get('user/access');
        
        if (res.data.statusCode === 200){
            localStorage.setItem('accessRight', JSON.stringify(res.data.data.map(item => item.user_access.access)))
            return async dispatch => {
                dispatch({
                    type: 'GETACCESS_SUCCESS',
                    // data: res.data.data,
                    // err: res.data.error_message,
                    // errEng: res.data.error_message
                })
            }
        }else{
            return async dispatch => {
                dispatch(err('GETACCESS_ERR'))
            }
        }
    }catch(e){
        console.log('error at getting access', e)
        return async dispatch => {
            dispatch(err('GETACCESS_ERR'))
        }
    }
}


const refreshToken = () => {
    return async dispatch => {
        try{
            const res = await api.post('token/refresh');
            if (res.data.statusCode === 200){
                localStorage.setItem('access', res.data.data.newToken)
                dispatch({
                    type: 'REFRESHTOKEN_SUCCESS',
                    data: res.data.data.newToken    
                })
            }
        }catch(e){
            console.log('error at refreshing token', e);
            dispatch(err('REFRESHTOKEN_ERR'))
        }
    }
}

const logout = () => {
    return async dispatch => {
        try{
            localStorage.clear();
            const res = await api.post('user/logout')
            dispatch({
                type: 'LOGOUT'
            })
        }catch(e){
            console.log('error at logout', e)
        }
    }
}


const err = (type) => {
    return async dispatch => {
        dispatch({
            type: type,
            data: '',
            err: 'Oops! Terjadi kesalahan pada network, mohon refresh.',
            errEng: 'Oops! Some mistake occurs on the network, please refresh the page.'
        })
    }
}

export {
    login,
    register,
    getAccess,
    logout,
    refreshToken,
}