import React, { Component } from "react";
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import AdminNavbar from "components/Navbars/AdminNavbar";
import { getRole, beforeRole } from "views/AdminStaff/permissions/permissions.actions";
import Footer from "components/Footers/AdminFooter";
import Sidebar from "components/Sidebar/Sidebar";
import routes from "routes.js";
import { ENV } from './../config/config';
import image3 from "assets/img/full-screen-image-3.jpg";
var CryptoJS = require("crypto-js");

let ProtectedArrayProperties = [
    // dashboard
	{
		viewDashboard: false,
		url: '/admin/dashboard',
        navigateTo: '/permissions'
	},
	{
		viewRole: false,
		url: '/admin/permissions',
        navigateTo: '/staff'
	},
	{
		viewStaff: false,
		url: '/admin/staff',
        navigateTo: '/users'
	},
	{
		viewUsers: false,
		url: '/admin/users',
        navigateTo: '/categories'
	},
	{
		viewEmails: false,
		url: '/admin/email-templates',
        navigateTo: '/email-templates'
	},
	{
		viewContent: false,
		url: '/admin/cms',
        navigateTo: '/add-cms'
	},
	{
		addContent: false,
		url: '/admin/add-cms',
        navigateTo: '/edit-cms/:contentId'
	},
	{
		editContent: false,
		url: '/admin/edit-cms/:contentId',
        navigateTo: '/faq'
	},
	{
		viewFaqs: false,
		url: '/admin/faq',
        navigateTo: '/add-faq'
	},
	{
		addFaq: false,
		url: '/admin/add-faq',
        navigateTo: '/edit-faq/:faqId'
	},
	{
		editFaq: false,
		url: '/admin/edit-faq/:faqId',
        navigateTo: '/contact'
	},
	{
		viewContact: false,
		url: '/admin/contact',
        navigateTo: '/site-settings'
	},
	{
		viewSetting: false,
		url: '/admin/site-settings',
        navigateTo: '/dashboard'
	},
	{
		viewSetting: false,
		url: '/admin/social-settings',
        navigateTo: '/dashboard'
	},
	
]
class Admin extends Component {
	constructor(props) {
		super(props);

		this.state = {
			routes: routes,
			permissions: {}
		};
	}

	componentDidMount() {
		
		let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
		this.props.getRole(role)
		this.props.beforeRole()
	}
	componentWillReceiveProps(props) {
        // if(Object.keys(this.state.permissions).length > 0){
			
		// }


		if (Object.keys(props.getRoleRes).length > 0) {
			this.setState({permissions : props.getRoleRes.role})
			let data = this.state.permissions
			let path = window.location.pathname;
			for (const key in data) {
				ProtectedArrayProperties.forEach((val) => {
					if (key === Object.keys(val)[0] && Object.values(val)[1] === path && data[key] === false) {
						this.props.history.push(Object.values(val)[2])
					}
				})
			}
			
        }
		// this.props.beforeRole()
    }

	getBrandText = path => {
		for (let i = 0; i < routes.length; i++) {
			if (
				this.props.location.pathname.indexOf(
					routes[i].path
				) !== -1
			) {
				return routes[i].name;
			}
		}
		return "Not Found";
	};
	componentDidUpdate(e) {
		if (
			window.innerWidth < 993 &&
			e.history.location.pathname !== e.location.pathname &&
			document.documentElement.className.indexOf("nav-open") !== -1
		) {
			document.documentElement.classList.toggle("nav-open");
		}
		if (e.history.action === "PUSH") {
			document.documentElement.scrollTop = 0;
			document.scrollingElement.scrollTop = 0;
			this.refs.mainPanel.scrollTop = 0;
		}
		
	}
	render() {
		return (
			<div>
				{
					localStorage.getItem("accessToken") ?
						<div className={`wrapper`}>
							<Sidebar {...this.props} routes={this.state.routes} image={image3} background={'black'} />
							<div id="main-panel" className="main-panel" ref="mainPanel">
								<AdminNavbar {...this.props} brandText={this.getBrandText(this.props.location.pathname)} history={this.props.history} />
								<div className="content">
									{this.props.children}
								</div>
								<Footer />
							</div>
						</div>
						: this.props.history.push('/')
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	getRoleRes : state.role.getRoleRes,
})
export default connect(mapStateToProps, {getRole, beforeRole})(Admin);