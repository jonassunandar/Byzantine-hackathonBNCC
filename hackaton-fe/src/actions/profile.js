import { api } from '../api';

const getTableData = (perPage = 10, keyword = '', page=1) => {
    return async (dispatch) => {
        try{
            dispatch({type: 'EVENT_START'})
            const res = await api.get(`event?perPage=${perPage}&keyword=${keyword}&page=${page}&type=0`)
            if(res.data.statusCode == 200 && res.data.message == 'Success'){
                dispatch({
                    type: 'EVENT_GET_TABLE_DATA',
                    data: res.data.data
                })
            }else{
                dispatch({
                    type: 'EVENT_GET_DATA_ERR',
                    err: res.data.error_message,
                    errEng: res.data.error_message,
                })
            }
        }catch(e){
            console.log('error at getting data Event', e)
            dispatch(err('EVENT_ERR'))
        }
    }
}

const getEventDetail = (id = -1) => {
    return async dispatch => {
        try{
            dispatch({type: 'EVENT_GET_DETAIL_START'})
            const res = await api.get(`event/detail?event_id=${id}`);
            
            if(res.data.statusCode === 200 && res.data.message === 'Success'){
                dispatch({
                    type: 'EVENT_GET_DETAIL',
                    data: res.data.data
                })
            }else{
                dispatch({
                    type: 'EVENT_GET_DETAIL_ERR',
                    err: res.data.error_message,
                    errEng: res.data.error_message,
                })
            }
        }catch(e){
            console.log('error at getting data Event detail', e)
            dispatch(err('EVENT_DETAIL_ERR'));
        }
    }
}

const insertEvent = (data) => {
    return async dispatch => {
        try{
            dispatch({type: 'EVENT_INSERT_START'});
            
            let body = new FormData();
            body.set('name', data.name)
            body.set('spouse_name', data.spouse_name);
            if (data.spouse_user_id) body.set('spouse_user_id', data.spouse_user_id);
            body.set('bride_name', data.bride_name);
            if (data.bride_user_id) body.set('bride_user_id', data.bride_user_id);
            body.set('location', data.location);
            body.set('event_time', data.event_time);
            body.set('event_type_id', data.event_type_id);
            const res = await api.post('event/insert', body);
            
            if(res.data.statusCode === 200 && res.data.message === 'Success'){
                dispatch({
                    type: 'EVENT_INSERT_END',
                    msgEng: 'Insert Event Success!',
                    msg: 'Berhasil Menambahkan Event!',
                    success: 'Success',
                })
            }else{
                dispatch({
                    type: 'EVENT_INSERT_END',
                    msg: 'Terdapat Error pada penambahan Tipe Event ! Coba lagi atau hubungi administrator.',
                    msgEng: 'Error on inserting Event ! Please Try Again or Contact your Administrator.',
                    success: 'Error',
                })
            }
        }catch(e){
            console.log('error at inserting Event', e);
            dispatch(err('EVENT_ERR'))
        }
    }
}

const updateEvent = (data) => {
    return async dispatch => {
        try{
            dispatch({type: 'EVENT_INSERT_START'})
            if (!data.spouse_user_id) data.spouse_user_id= null
            if (!data.bride_user_id) data.bride_user_id= null
            const res = await api.patch('event/update', data)
            
            if(res.data.statusCode === 200 && res.data.message === 'Success'){
                dispatch({
                    type: 'EVENT_INSERT_END',
                    msgEng: 'Update Event Success!',
                    msg: 'Berhasil Mengubah Event!',
                    success: 'Success',
                })
            }else{
                dispatch({
                    type: 'EVENT_INSERT_END',
                    msg: 'Terdapat Error pada pengubahan Event ! Coba lagi atau hubungi administrator.',
                    msgEng: 'Error on updating Event ! Please Try Again or Contact your Administrator.',
                    success: 'Error',
                })
            }
        }catch(e){
            console.log('error at editing Event', e)
            dispatch(err('EVENT_ERR'))
        }
    }
}
const deleteEvent = (id, reason= '') => {
    return async dispatch => {
        try{
            let body = {event_id: id, reason: reason}
            const res = await api.deleted('event/delete', body)
            dispatch(getTableData())
        }catch(e){
            console.log('error at deleting Event', e)
            dispatch(err('EVENT_ERR'))
        }
    }
}

const getClientUser = () => {
    return async dispatch => {
        try{
            const res = await api.get('event/user');
            dispatch({
                type: 'EVENT_GET_USER_LIST',
                userList: res.data.data
            })
        }catch(e){
            console.log('error at getting user List', e)
            dispatch(err('EVENT_ERR'))
        }
    }
}
const getEventType = () => {
    return async dispatch => {
        try{
            const res = await api.get('event/type');
            dispatch({
                type: 'EVENT_GET_TYPE_LIST',
                typeList: res.data.data
            })
        }catch(e){
            console.log('error at getting type List', e)
            dispatch(err('EVENT_ERR'))
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
    getTableData,
    getEventDetail,
    getClientUser,
    getEventType,
    insertEvent,
    updateEvent,
    deleteEvent
}