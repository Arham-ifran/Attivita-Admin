import { combineReducers } from 'redux'
import adminReducer from '../views/Admin/Admin.reducer'
import rolesReducer from '../views/AdminStaff/permissions/permissions.reducer'
import userReducer from 'views/Users/Users.reducer'
import errorReducer from './shared/error/error.reducer'
import emailReducer from '../views/EmailTemplates/EmailTemplates.reducer'
import settingsReducer from '.././views/Settings/settings.reducer'
import faqReducer from 'views/Faq/Faq.reducer'
import contactsReducer from 'views/Contacts/Contacts.reducer'
import ActivityReducer from 'views/Activity/Activity.reducer'
import DashboardReducer from 'views/Dashboard.reducer'
import ContentManagementReducer from 'views/ContentManagment/cms.reducer'
import Support from 'views/Support/Support.reducer'

export default combineReducers({
    admin: adminReducer,
    role: rolesReducer,
    user: userReducer,
    error: errorReducer,
    email: emailReducer,
    settings: settingsReducer,
    devs : Support,
    faqs: faqReducer,
    contacts: contactsReducer,
    activity: ActivityReducer,
    dashboard: DashboardReducer,
    content : ContentManagementReducer,

})