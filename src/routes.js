//importing layouts....
import Admin from 'layouts/Admin';
import UnAuth from 'layouts/Auth';

import Dashboard from "views/Dashboard.js";
import Login from "./views/Login/Login";
import Users from "./views/Users/Users"
import Faq from "views/Faq/Faq";
import AddFaq from "views/Faq/AddFaq"
import EditFaq from 'views/Faq/EditFaq';
import Profile from 'views/Profile/profile'
import Unauth from 'layouts/Auth';
import ForgotPassword from 'views/ForgotPassword/ForgotPassword';
import ResetPassword from 'views/ResetPassword/ResetPassword';
import Contacts from 'views/Contacts/Contacts';
import Permissions from 'views/AdminStaff/permissions/permissionsListingComponent'
import Staff from 'views/AdminStaff/staff/staffListingComponent'
import AddContentPage from 'views/ContentManagment/addContentPage';



var routes = [
  {
    path: "/",
    layout: Unauth,
    name: "Login",
    icon: "nc-icon nc-chart-pie-35",
    access: true,
    exact: true,
    component: Login
  },
  {
    path: "/dashboard",
    layout: Admin,
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    access: true,
    exact: true,
    component: Dashboard,
    showInSideBar: true
  },
  {
    path: "/profile",
    layout: Admin,
    name: "Profile",
    icon: "nc-icon nc-circle-09",
    access: true, exact: true,
    component: Profile,
    showInSideBar: false,
  },
  {
    collapse: true,
    name: "Admin Staff",
    state: "openAdminStaff",
    icon: "nc-icon nc-grid-45",
    showInSideBar: true,
    submenus: [
      {
        path: "/roles",
        layout: Admin,
        name: "Roles",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Permissions,
        showInSideBar: true,
      },
      {
        path: "/staff",
        layout: Admin,
        name: "Staff",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Staff,
        showInSideBar: true,
      }
    ],
  },
  {
    path: "/faq",
    layout: Admin,
    name: "FAQS",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: Faq,
    showInSideBar: true,
  },
  {
    path: "/add-faq",
    layout: Admin,
    name: "Add Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddFaq,
  },
  {
    path: "/edit-faq/:faqId",
    layout: Admin,
    name: "Edit Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: EditFaq,
  },
  {
    path: "/add-cms",
    layout: Admin,
    name: "Add Content",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddContentPage,
  },
  {
    path: "/edit-cms/:contentId",
    layout: Admin,
    name: "Edit Content",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddContentPage,
  },
  {
    path: "/contact",
    layout: Admin,
    name: "Contacts",
    icon: "nc-icon nc-send",
    access: true, exact: true,
    component: Contacts,
    showInSideBar: false,
  },
  {
    path: "/login",
    layout: UnAuth,
    name: "Login",
    mini: "LP",
    component: Login,
  },
  {
    path: "/forgot-password",
    layout: UnAuth,
    name: "Forgot Passowrd",
    mini: "FP",
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:adminId",
    layout: UnAuth,
    name: "Reset Passowrd",
    mini: "RP",
    component: ResetPassword,
  }
];

export default routes;
