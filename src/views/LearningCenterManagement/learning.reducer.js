// import { GET_FAQS, BEFORE_FAQ, DELETE_FAQ, CREATE_FAQ, GET_FAQ, EDIT_FAQ } from '../../redux/types';
import { GET_LEARNINGS, BEFORE_LEARNING, DELETE_LEARNING, CREATE_LEARNING, GET_LEARNING, EDIT_LEARNING } from '../../redux/types';

const initialState = {

    learnings:null,
    getlearningsAuth: false,
    learning: null,
    dellearningAuth: false,
    createAuth: false,
    getlearningAuth: false,
    editlearningsAuth: false,
    // faqs: null,
    // getFaqsAuth: false,
    // faq: null,
    // delFaqAuth: false,
    // createAuth: false,
    // getFaqAuth: false,
    // editFaqAuth: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LEARNING:
            return {
                ...state,
                learning: action.payload.learningCenter,
                getlearningAuth: true
            }
        case CREATE_LEARNING:
            return {
                ...state,
                createAuth: true
            }
        case GET_LEARNINGS:
            return {
                ...state,
                learnings: action.payload,
                getlearningsAuth: true
            }
        case EDIT_LEARNING:
            return {
                ...state,
                learning: action.payload,
                editlearningsAuth: true
            }
        case DELETE_LEARNING:
            return {
                ...state,
                learning: action.payload,
                dellearningAuth: true
            }
        case BEFORE_LEARNING:
            return {
                ...state,
                // learnings: null,
                getlearningsAuth: false,
                // learning: null,
                dellearningAuth: false,
                createAuth: false,
                getlearningAuth: false,
                editlearningsAuth: false
            }
        default:
            return {
                ...state
            }
    }
}