import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeFaq, getFaqs, deleteFaq } from './Faq.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import { faPeopleArrows } from '@fortawesome/free-solid-svg-icons';
import EditFaq from './EditFaq';
var CryptoJS = require("crypto-js");

const Faq = (props) => {
    const [data, setData] = useState(null)
    const [pagination, setPagination] = useState(null)
    const [Page , setPage] = useState(1)
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [searchTitle, setSearchTitle] = useState(localStorage.getItem('faqTitle') !== undefined && localStorage.getItem('faqTitle') !== null? localStorage.getItem('faqTitle') : '')
    const [searchStatus, setSearchStatus] = useState(localStorage.getItem('faqStatus') !== undefined && localStorage.getItem('faqStatus') !== null? localStorage.getItem('faqStatus') : '')


    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page : Page, limit: 10 })
        const filter = {}
        if(searchTitle !== undefined && searchTitle !== null && searchTitle !== '')
            filter.title = searchTitle
        if(searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus === 'true' ? true : false

        props.getFaqs(qs, filter )
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
        if (props.faqs.getFaqsAuth) {
            let { faqs, pagination } = props.faqs.faqs
            setData(faqs)
            setPagination(pagination)
            props.beforeFaq()
        }
    }, [props.faqs.getFaqsAuth])

    useEffect(() =>{
        if(data){
            setLoader(false)
        }
    }, [data])

    useEffect(()=>{
        if(props.faqs.delFaqAuth){
            let filtered = data.filter((item) => {
                if (item._id !== props.faqs.faq.faqId)
                    return item
            })
            setData(filtered)
            const filter = {}
            if(searchTitle && searchTitle !== ''){
                filter.name = searchTitle
                localStorage.setItem('faqTitle', searchTitle)
            }
            if(searchStatus !== ''){
                filter.status = searchStatus === 'true' ? true : false
                localStorage.setItem('faqStatus', searchStatus)
            }
            const qs = ENV.objectToQueryString({page : Page , limit : 10})
            props.getFaqs(qs , filter)
            props.beforeFaq()
        }
    }, [props.faqs.delFaqAuth])

    const deleteFAQ = (faqId) => {
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
                props.deleteFaq(faqId)
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if(searchTitle && searchTitle !== ''){
            filter.name = searchTitle
            localStorage.setItem('faqTitle', searchTitle)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('faqStatus', searchStatus)
        }
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page: page , limit :10 })
        props.getFaqs(qs,filter)
    }

    const applyFilters = () =>{
        const filter = {}
        if(searchTitle && searchTitle !== ''){
            filter.title = searchTitle
            localStorage.setItem('faqTitle', searchTitle)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('faqStatus', searchStatus)
        }
        setPage(1)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        props.getFaqs(qs, filter)
        setLoader(true)
    }

    const reset = () =>{
        setSearchTitle('')
        setSearchStatus('')
        setPage(1)
        const qs = ENV.objectToQueryString({ page: 1, limit: 10 })      
        props.getFaqs(qs)
        setLoader(true)
        localStorage.removeItem('faqTitle')
        localStorage.removeItem('faqStatus')
        localStorage.removeItem('showFaqsFilter')


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
                                                    <Form.Control type="text" value ={searchTitle} placeholder="John" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
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
                                                        <Button variant="info"  disabled={!searchTitle && !searchStatus } onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchTitle && !searchStatus } onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4">FAQs</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addFaq && 
                                                    <Button
                                                        variant="info"
                                                        className="float-sm-right"
                                                        onClick={() => props.history.push(`/add-faq`)}>
                                                        Add FAQ
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
                                                                            {item.title}
                                                                        </td>
                                                                        <td className="text-center td-actions">
                                                                        <span className={` status ${item.status? `bg-success` : `bg-danger`
                                                                            }`}>
                                                                               <span className='lable lable-success'> {item.status ? 'Active' : 'Inactive'}</span>
                                                                           </span>
                                                                        </td>
                                                                        <td className="td-actions text-center">
                                                                            <ul className="list-unstyled mb-0">
                                                                                {
                                                                                    permissions && permissions.editFaq && 
                                                                                        <li className="d-inline-block align-top">
                                                                                         <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Edit </Tooltip>)} >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                variant="success"
                                                                                                onClick={() => props.history.push(`/edit-faq/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                        </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteFaq&&
                                                                                        <li className="d-inline-block align-top">
                                                                                          <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Delete</Tooltip>)} >
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                variant="danger"
                                                                                                onClick={() => deleteFAQ(item._id)}
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
                                                                <td colSpan="4" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No FAQ Found</div>
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
                                                    current={Page > pagination.pages ? pagination.pages :  Page} // current active page
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
    faqs: state.faqs,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeFaq, getFaqs, deleteFaq, getRole })(Faq);