import { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { beforeDashboard, getDashboard } from './Dashboard.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader'
import { connect } from 'react-redux';

function Dashboard(props) {

	const [data, setData] = useState({
		users: 0
	})
	const [loader, setLoader] = useState(true)

	useEffect(() => {
		props.getDashboard()
	}, [])

	useEffect(() => {
		if (props.dashboard.dataAuth) {
			const { admins } = props.dashboard.data
			setData({ admins })
			setLoader(false)
			props.beforeDashboard()
		}
	}, [props.dashboard.dataAuth])

	// when an error is received
	useEffect(() => {
		if (props.error.error)
			setLoader(false)
	}, [props.error.error])

	return (
		<div className="pt-3 pt-md-5">
			{
				loader ?
					<FullPageLoader />
					:
					<Container fluid>
						<Row>
							<Col xl={3} lg={4} sm={6}>
								<Card className="card-stats">
									<Card.Body>
										<div className="d-flex">
											<div className="numbers">
												<p className="card-category">Customers</p>
												<Card.Title as="h4">123000</Card.Title>
											</div>
											<div className="icon-big text-center icon-warning">
												<i className="nc-icon nc-single-02"></i>
											</div>
										</div>
									</Card.Body>
								</Card>
							</Col>
						</Row>
					</Container>
			}
		</div>
	);
}

const mapStateToProps = state => ({
	dashboard: state.dashboard,
	user: state.user,
	error: state.error,
});

export default connect(mapStateToProps, { beforeDashboard, getDashboard })(Dashboard);
