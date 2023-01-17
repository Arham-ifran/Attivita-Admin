import { BEFORE_DEV, GET_DEVS, EDIT_DEV , GET_DEV_SUPPORT_SDK , GET_DEV_SUPPORT_GAMES} from '../../redux/types';

const initialState = {
    sdk : [],
    games : [] ,
    getGamesAuth : false ,
    getSdkAuth : false ,
    devs: null,
    devsAuth: false,
    dev: null,
    updateAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_DEVS:
            return {
                ...state,
                devs: action.payload,
                devsAuth: true
            }
        case EDIT_DEV:
            return {
                ...state,
                dev: action.payload,
                updateAuth: true
            }
        case GET_DEV_SUPPORT_SDK:
            return {
                ...state,
                sdk: action.payload,
                getSdkAuth: true
            }   
        case GET_DEV_SUPPORT_GAMES:
            return {
                ...state,
                games: action.payload,
                getGamesAuth: true
            }
        case BEFORE_DEV:
            return {
                ...state,
                devs: null,
                dev: null ,
                devsAuth: false,
                updateAuth: false,
                // getSdkAuth: false ,
            }
        default:
            return {
                ...state
            }
    }
}