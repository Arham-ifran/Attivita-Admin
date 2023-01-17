import { toast } from 'react-toastify';
import { GET_ERRORS, BEFORE_DEV, GET_DEVS, EDIT_DEV ,GET_DEV_SUPPORT_SDK , GET_DEV_SUPPORT_GAMES} from '../../redux/types';
import { emptyError } from '../../redux/shared/error/error.action';
import { ENV } from '../../config/config';

export const beforeDev = () => {
    return {
        type: BEFORE_DEV
    }
}
export const getDevs = (qs = null, body={}) => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}contacts/list`;
    if (qs)
        url += `?${qs}`

    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken'),
            'user-platform' : 2

        },
        body : JSON.stringify(body)
    }).then(res => res.json()).then(data => {
        if (data.success) {
            if (!qs)
                toast.success(data.message)
            dispatch({
                type: GET_DEVS,
                payload: data.data
            })
        } else {
            if (!qs)
                toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const updateDev = ( devId,body, method = 'PUT') => dispatch => {
    dispatch(emptyError());
    const url = `${ENV.url}contacts/edit/${devId}`;
    fetch(url, {
        method,
        headers: {
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token
        },
        body
    }).then(res => res.json()).then(data => {
        if (data.success) {
            toast.success(data.message)
            dispatch({
                type: EDIT_DEV,
                payload: data
            })
        } else {
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};


export const getSdk = (qs = '') => dispatch => {
    dispatch(emptyError());
    let url = `${ENV.url}contacts/get-sdk`;
    if (qs)
        url += `?${qs}`


    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken')
            
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            console.log("data.sdk: ", data)
            dispatch({
                type: GET_DEV_SUPPORT_SDK,
                payload:  data.sdk
            })
        } else {
            if (!qs)
                toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};

export const getSupportGames = (qs = '', body = {}) => dispatch => {
    dispatch(emptyError());
  
    let url = `${ENV.url}contacts/get-contact-games`;
    if (qs)
        url += `?${qs}`
    fetch(url, {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'Authorization': ENV.Authorization,
            'x-auth-token': ENV.x_auth_token,
            'x-access-token': localStorage.getItem('accessToken')
        }
    }).then(res => res.json()).then(data => {
        if (data.success) {
            // toast.success(data.message)
            console.log("data.game: ",data.game)
            dispatch({
                type: GET_DEV_SUPPORT_GAMES,
                payload: data.game
            })
        } else {
          
            toast.error(data.message)
            dispatch({
                type: GET_ERRORS,
                payload: data
            })
        }
    }).catch(error => {
        if (error.response && error.response.data) {
            const { data } = error.response
            if (data.message)
                toast.error(data.message)
        }
        dispatch({
            type: GET_ERRORS,
            payload: error
        })
    })
};
