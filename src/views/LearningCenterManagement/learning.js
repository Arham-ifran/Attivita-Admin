import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeLearning, getLearnings, deleteLearning } from './learning.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import EditFaq from './EditLearning';
import userDefaultImg from '../../assets/img/placeholder.jpg'
var CryptoJS = require("crypto-js");

const LearningCenter = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [currentPage , setCurrentPage] = useState(1)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [searchTitle, setSearchTitle] = useState(localStorage.getItem('learningTitle') !== undefined && localStorage.getItem('learningTitle') !== null? localStorage.getItem('learningTitle') : '')
    const [searchStatus, setSearchStatus] = useState(localStorage.getItem('learningStatus') !== undefined && localStorage.getItem('learningStatus') !== null? localStorage.getItem('learningStatus') : '')


    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString( { page : currentPage, limit: 10 })
        const filter = {}
        if(searchTitle !== undefined && searchTitle !== null && searchTitle !== '')
            filter.title = searchTitle
        if(searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus === 'true' ? true : false

        props.getLearnings(qs, filter )
        let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        props.getRole(role)
    }, [])

    useEffect(()=>{
        if (Object.keys(props.getRoleRes).length > 0) {
            setPermissions(props.getRoleRes.role)
        }
    },[props.getRoleRes])

    useEffect(() => {
        if (props.learnings.getlearningsAuth) {
            let { learningCenter, pagination } = props.learnings.learnings
            setData(learningCenter)
            setPagination(pagination)
            props.beforeLearning()
        }
    }, [props.learnings.getlearningsAuth])

    useEffect(() =>{
        if(data){
            setLoader(false)
        }
    }, [data])

    useEffect(()=>{
        if(props.learnings.dellearningAuth){
            // let filtered = data.filter((item) => {
            //     if (item._id !== props.learnings.learning.learningId)
            //         return item
            // })
            // setData(filtered)
            // console.log("del: ",currentPage)
            const filter = {}
            if(searchTitle && searchTitle !== ''){
                filter.title = searchTitle
                localStorage.setItem('learningTitle', searchTitle)
            }
            if(searchStatus !== ''){
                filter.status = searchStatus === 'true' ? true : false
                localStorage.setItem('learningStatus', searchStatus)
            }
            const qs = ENV.objectToQueryString( { page : currentPage, limit: 10 })
            props.getLearnings(qs ,filter)
            props.beforeLearning()
        }
    }, [props.learnings.dellearningAuth])

    const deleteLEARNING = (learningId) => {
        Swal.fire({
            title: 'Are you sure you want to delete?',
            html: 'If you delete an item, it would be permanently lost.',
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.value) {
                setLoader(true)
                props.deleteLearning(learningId)
            }
        })
    }

    const onPageChange = async (page) => {
        console.log("page: ",page)
        const filter = {}
        if(searchTitle && searchTitle !== ''){
            filter.name = searchTitle
            localStorage.setItem('learningTitle', searchTitle)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('learningStatus', searchStatus)
        }

        setLoader(true)
        setCurrentPage(page)
        const qs = ENV.objectToQueryString({ page : page, limit: 10 })
        props.getLearnings(qs,filter)
    }

    const applyFilters = () =>{
        const filter = {}
        if(searchTitle && searchTitle !== ''){
            filter.title = searchTitle
            localStorage.setItem('learningTitle', searchTitle)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('learningStatus', searchStatus)
        }
        setCurrentPage(1)
        const qs = ENV.objectToQueryString({ page : 1 , limit: 10 })
        props.getLearnings(qs, filter)
        setLoader(true)
    }

    const reset = () =>{
        setSearchTitle('')
        setSearchStatus('')
        const qs = ENV.objectToQueryString({ page : 1 , limit: 10 })
        setCurrentPage(1)
        props.getLearnings(qs)
        setLoader(true)
        localStorage.removeItem('learningTitle')
        localStorage.removeItem('learningStatus')
        localStorage.removeItem('showlearningsFilter')


    }

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container fluid>
                        <Row className="pb-3">
                            <Col sm={12}>
                                <Card className="filter-card">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Filters</Card.Title>
                                            {/* <p className="card-collection">List of Auctions</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Title</label>
                                                    <Form.Control type="text" value ={searchTitle} placeholder="Title" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>                                                    
                                            </Col>
                                            <Col xl={3} sm={6}>
                                            <label style={{color : 'white'}}>Status</label>
                                                <Form.Group>
                                                    <select value={searchStatus} onChange={(e) =>  setSearchStatus(e.target.value)}>
                                                        <option value="">Select Status</option>
                                                        <option value='true'>Active</option>
                                                        <option value="false">Inactive</option>
                                                    </select>
                                                </Form.Group> 
                                            </Col>
                                            
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info"     disabled={!searchTitle && !searchStatus }onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning"  hidden={!searchTitle && !searchStatus } onClick={reset}>Reset</Button>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                         
                        {/* <Row>
                            <Col>
                                <span style={{color : 'white'}}>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row> */}
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                    <div className='d-flex justify-content-end mb-2 pr-3'>
                                    <span  style={{ color: 'white',fontWeight:'bold' }}>{`Total : ${pagination?.total}`}</span>
                                    </div>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">LEARNINGS</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                // permissions && permissions.addFaq && 
                                                    <Button
                                                        variant="info"
                                                        className="float-sm-right"
                                                        onClick={() => props.history.push(`/add-learning`)}>
                                                        Add Learning Tutorial
                                                    </Button>
                                            }
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th className='td-actions'>Image</th>
                                                        <th className='text-center td-actions'>Title</th>
                                                        <th className='text-center td-actions'>Status</th>
                                                        <th className="td-actions text-center">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        data && data.length ?
                                                            data.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="text-center td-actions">
                                                                            <div className="user-image">
                                                                                <img className="img-fluid" alt="User Image" src={item.image ? item.image : userDefaultImg} onError={(e)=> {e.target.onerror = null ; e.target.src = userDefaultImg }} />
                                                                            </div>
                                                                        </td>                                                                        
                                                                        <td className="text-center td-actions">
                                                                            {item.title}
                                                                        </td>
                                                                        <td className="text-center td-actions">
                                                                        <span className={`text-white status ${item.status? `bg-success` : `bg-danger`
                                                                            }`}>
                                                                               <label className='lable lable-success'> {item.status ? 'Active' : 'Inactive'}</label>
                                                                           </span>
                                                                        </td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    // permissions && permissions.editFaq && 
                                                                                        <li className="d-inline-block align-top">
                                                                                         <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Edit</Tooltip>)} >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => props.history.push(`/edit-learning/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                        </li>
                                                                                }
                                                                                {
                                                                                    // permissions && permissions.deleteFaq&&
                                                                                        <li className="d-inline-block align-top">
                                                                                         <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Delete</Tooltip>)} >
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteLEARNING(item._id)}
                                                                                            >
                                                                                                <i className="fas fa-trash"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                        </li>
                                                                                }
                                                                            </ul>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })
                                                            :
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Learning Tutorials Found</div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            {
                                                pagination &&
                                                <Pagination
                                                    className="m-3"
                                                    defaultCurrent={1}
                                                    pageSize // items per page
                                                    current={currentPage > pagination.pages ? pagination.pages :  currentPage} // current active page
                                                    total={pagination.pages} // total pages
                                                    onChange={onPageChange}
                                                    locale={localeInfo}
                                                />
                                            }
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
            }
        </>
    )
}

const mapStateToProps = state => ({
    learnings: state.learnings,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

// export default connect(mapStateToProps, { beforeFaq, getFaqs, deleteFaq, getRole })(LearningCenter);

// beforeLearning getLearnings updateLearning deleteLearning addLearning getLearning  


export default connect(mapStateToProps, { beforeLearning, getLearnings, deleteLearning, getRole })(LearningCenter);
