import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ENV } from '../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import Swal from 'sweetalert2';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { getContentPages, beforeContent, deleteContent } from './cms.action';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const Faq = (props) => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [Page , setPage] = useState(1)
    const [description, setDescription] = useState()
    const [status, setStatus] = useState(true)
    const [slug, setSlug] = useState('')
    const [pagination, setPagination] = useState(null)
    const [contentPages, setContentPages] = useState({})
    const [loader, setLoader] = useState(true)
    const [permissions, setPermissions] = useState({})
    const [contentModal, setContentModal] = useState(false)
    const [searchTitle, setSearchTitle] = useState(localStorage.getItem('cmsTitle') !== undefined && localStorage.getItem('cmsTitle') !== null? localStorage.getItem('cmsTitle') : '')
    const [searchStatus, setSearchStatus] = useState(localStorage.getItem('cmsStatus') !== undefined && localStorage.getItem('cmsStatus') !== null? localStorage.getItem('cmsStatus') : '')
    const [searchSlug, setSearchSlug] = useState(localStorage.getItem('cmsSlug') !== undefined && localStorage.getItem('cmsSlug') !== null? localStorage.getItem('cmsSlug') : '')

    

    const getContentPagesRes = useSelector(state => state.content.getContentPagesRes)
    const getRoleRes = useSelector(state => state.role.getRoleRes)
    const deleteContentRes = useSelector(state => state.content.deleteContentRes)

    useEffect(() => {
        window.scroll(0, 0)
        let roleEncrypted = localStorage.getItem('role');
		let role = ''
        if (roleEncrypted) {
            let roleDecrypted = CryptoJS.AES.decrypt(roleEncrypted, 'secret key 123').toString(CryptoJS.enc.Utf8);
			role = roleDecrypted
		}
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        const filter = {}
        if(searchTitle !== undefined && searchTitle !== null && searchTitle !== '')
            filter.title = searchTitle
        if(searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus === 'true' ? true : false
        if(searchSlug !== undefined && searchSlug !== null && searchSlug !== '')
            filter.slug = searchSlug
        
        console.log('Are we in right Component Empty Dependency')
        dispatch(getRole(role))
        dispatch(getContentPages(qs,filter))
    }, [])

    useEffect(()=>{
        if (Object.keys(getRoleRes).length > 0) {
            setPermissions(getRoleRes.role)
        }
    },[getRoleRes])

    useEffect(() => {
        if (getContentPagesRes && Object.keys(getContentPagesRes).length > 0) {
            setLoader(false)
            setContentPages(getContentPagesRes.contentPages)
            setPagination(getContentPagesRes.pagination)
            dispatch(beforeContent())
        }
    }, [getContentPagesRes])

    useEffect(() => {
        if (deleteContentRes && Object.keys(deleteContentRes).length > 0) {
            const qs = ENV.objectToQueryString({ page : Page, limit: 10 })
            // setLoader(false)
            dispatch(getContentPages(qs))
        }
    }, [deleteContentRes])


    const deleteContentPageHandler = (contentId) => {
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
                dispatch(deleteContent(contentId))
            }
        })
    }

    const onPageChange = async (page) => {
        const filter = {}
        if(searchTitle && searchTitle !== ''){
            filter.name = searchTitle
            localStorage.setItem('cmsTitle', searchTitle)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('cmsStatus', searchStatus)
        }
        if(searchSlug && searchSlug !== '')
            filter.slug = searchSlug
        setPage(page)
        setLoader(true)
        const qs = ENV.objectToQueryString({ page })
        dispatch(getContentPages(qs, filter))
    }

    const setModal = (data) =>{
        setContentModal(!contentModal)
        setTitle(data.title)
        setSlug(data.slug)
        setDescription(data.description)
        setStatus(data.status)
    }

    const applyFilters = () =>{
        const filter = {}
        if(searchTitle && searchTitle !== ''){
            filter.title = searchTitle
            localStorage.setItem('cmsTitle', searchTitle)
        }
        if(searchStatus !== ''){
            filter.status = searchStatus === 'true' ? true : false
            localStorage.setItem('cmsStatus', searchStatus)
        }
        if(searchSlug && searchSlug !== ''){
            filter.slug = searchSlug
            localStorage.setItem('cmsSlug', searchSlug)
        }
        setPage(1)
        console.log("filter: ",filter)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        dispatch(getContentPages(qs, filter))
        setLoader(true)
    }

    const reset = () =>{
        setSearchTitle('')
        setSearchStatus('')
        setSearchSlug('')
        setPage(1)
        dispatch(getContentPages())
        setLoader(true)
        localStorage.removeItem('cmsTitle')
        localStorage.removeItem('cmsStatus')
        localStorage.removeItem('cmsSlug')
        localStorage.removeItem('showCmsFilter')


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
                                                    <Form.Control type="text" value ={searchTitle} placeholder="John Doe" onChange={(e) => setSearchTitle(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Slug</label>
                                                    <Form.Control type="text" value ={searchSlug} placeholder="John-Doe" onChange={(e) => setSearchSlug(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Status</label>
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
                                                        <Button variant="info"  disabled={!searchTitle && !searchStatus && !searchSlug } onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchTitle && !searchStatus && !searchSlug } onClick={reset}>Reset</Button>
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
                                            <Card.Title as="h4">Content Management</Card.Title>
                                            {/* <p className="card-category">List of FAQs</p> */}
                                            {
                                                permissions && permissions.addContent && 
                                                    <Button
                                                        variant="info"
                                                        className="float-sm-right"
                                                        onClick={() => props.history.push(`/add-cms`)}>
                                                        Add Content Page
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
                                                        <th>Title</th>
                                                        <th>Slug</th>
                                                        <th>Status</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        contentPages && contentPages.length ?
                                                            contentPages.map((item, index) => {
                                                                return (
                                                                    <tr key={index}>
                                                                        <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                        <td className="td-name">
                                                                            {item.title}
                                                                        </td>
                                                                        <td className="td-name">
                                                                            {item.slug}
                                                                        </td>
                                                                        <td className="td-name">
                                                                        <span className={`text-white status ${item.status? `bg-success` : `bg-danger`
                                                                            }`}> {item.status ? 'Active' : 'Inactive'}</span>

                                                                        </td>
                                                                        <td className="td-actions">
                                                                            <ul className="list-unstyled mb-0">
                                                                                <li className="d-inline-block align-top">
                                                                                <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">View </Tooltip>)} >
                                                                                    <Button
                                                                                        className="btn-action btn-primary"
                                                                                        type="button"
                                                                                        onClick={()=>setModal(item)}
                                                                                    >
                                                                                        <i className="fa fa-eye"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                                </li>
                                                                                
                                                                                {
                                                                                    permissions && permissions.editContent && 
                                                                                        <li className="d-inline-block align-top">
                                                                                          <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Edit</Tooltip>)} >
                                                                                            <Button
                                                                                                className="btn-action btn-warning"
                                                                                                type="button"
                                                                                                
                                                                                                onClick={() => props.history.push(`/edit-cms/${item._id}`)}
                                                                                            >
                                                                                                <i className="fas fa-edit"></i>
                                                                                            </Button>
                                                                                        </OverlayTrigger>
                                                                                        </li>
                                                                                }
                                                                                {
                                                                                    permissions && permissions.deleteContent&&
                                                                                        <li className="d-inline-block align-top">
                                                                                        <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Delete</Tooltip>)} >
                                                                                            <Button
                                                                                                className="btn-action btn-danger"
                                                                                                type="button"
                                                                                                onClick={() => deleteContentPageHandler(item._id)}
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
                                                                    <div className="alert alert-info" role="alert">No Content Pages  Found</div>
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
                                                    current={Page > pagination.pages ? pagination.pages : Page} // current active page
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
                        {
                            contentPages &&
                            <Modal className="modal-primary" id="content-Modal" onHide={() => setContentModal(!contentModal)} show={contentModal}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                View Content Page
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form>
                                        <Form.Group>
                                            <label>Title <span className="text-danger">*</span></label>
                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value ={title}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Slug <span className="text-danger">*</span></label>
                                            <Form.Control
                                                readOnly
                                                type="text"
                                                value ={slug}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label>Description</label>
                                            <div
                                                dangerouslySetInnerHTML = {{__html: description}}
                                                ></div>
                                            
                                        </Form.Group>
                                        
                                        <Form.Group>
                                            <label>Status</label>
                                            <label className="right-label-radio mr-3 mb-2">Active
                                                <input name="status" disabled type="radio" checked={status} value={status} />
                                                <span className="checkmark"></span>
                                            </label>
                                            <label className="right-label-radio mr-3 mb-2">InActive
                                                <input name="status" disabled type="radio" checked={!status} value={!status} />
                                                <span className="checkmark"></span>
                                            </label>
                                        </Form.Group>
                                    </Form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="btn btn-danger" onClick={() => setContentModal(!contentModal)}>Close</Button>
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }
        </>
    )
}

export default Faq;