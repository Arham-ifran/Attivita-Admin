import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { ENV } from '../../config/config';
import { beforeDev, getDevs, updateDev , getSdk , getSupportGames} from './Support.actions';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import localeInfo from 'rc-pagination/lib/locale/en_US';
import { getRole } from 'views/AdminStaff/permissions/permissions.actions';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, InputGroup, DropdownButton, Dropdown, FormControl } from "react-bootstrap";
var CryptoJS = require("crypto-js");

const DevSupport = (props)=>{
    const [devs, setDevs] = useState(null)
    const [Page , setPage] = useState(1)
    const [pagination, setPagination] = useState(null)
    const [devModel, setDevModel] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [dev, setDev] = useState(null)
    const [devSdk , setDevSdk ] = useState([])
    const [devGames , setDevGames] = useState([])
    const [loader, setLoader] = useState(true)
    const [title, setTitle] = useState('Select Status')
    const [permissions, setPermissions] = useState({})
    const [searchContactId, setSearchContactId] = useState(localStorage.getItem('devContactId') !== undefined && localStorage.getItem('devContactId') !== null? localStorage.getItem('devContactId') : '')
    const [searchName, setSearchName] = useState(localStorage.getItem('devName') !== undefined && localStorage.getItem('devName') !== null? localStorage.getItem('devName') : '')
    const [searchEmail, setSearchEmail] = useState(localStorage.getItem('devEmail') !== undefined && localStorage.getItem('devEmail') !== null? localStorage.getItem('devEmail') : '')
    const [searchGame, setSearchGame] = useState(localStorage.getItem('devGame') !== undefined && localStorage.getItem('devGame') !== null? localStorage.getItem('devGame') : '')
    // const [searchSdk, setSearchSdk] = useState(localStorage.getItem('devSdk') !== undefined && localStorage.getItem('devSdk') !== null? localStorage.getItem('devSdk') : '')
    const [searchEnvironment, setSearchEnvironment] = useState(localStorage.getItem('devEnvironment') !== undefined && localStorage.getItem('devEnvironment') !== null? localStorage.getItem('devEnvironment') : '')
    const [searchSdk, setSearchSdk] = useState(localStorage.getItem('devSdk') !== undefined && localStorage.getItem('devSdk') !== null? localStorage.getItem('devSdk') : '')
    const [envirementArray, setEnvirementArray] = useState({ "1": 'Unity', "2": 'Android Studio', "3": 'Xcode', "4": 'Unity, Android Studio', "5": 'Unity, Xcode', })
    const [searchStatus, setSearchStatus] = useState(localStorage.getItem('devStatus') !== undefined && localStorage.getItem('devStatus') !== null? localStorage.getItem('devStatus') : '')


    const renderOption = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(<option value={v}>{value[v]}</option>);
        }
        return rows;
    }
    const renderOptionGames = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push(value[v].game && <option value={value[v].game._id}>{value[v].game.name}</option>);
        }
        return rows;
    }

    const renderOptions = (value) => {
        var rows = [];
        for (var v in value) {
            rows.push( value[v] && <option value={value[v]?._id}>{value[v]?.name}</option>);
        }
        return rows;
    }

    useEffect(() => {
        window.scroll(0, 0)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        const filter = {type : '0'}
        if(searchContactId !== undefined && searchContactId !== null && searchContactId !== '')
            filter.contactId = searchContactId.trim()
        if(searchName !== undefined && searchName !== null && searchName !== '')
            filter.name = searchName.trim()
        if(searchEmail !== undefined && searchEmail !== null && searchEmail !== '')
            filter.email = searchEmail.trim()
        if(searchGame !== undefined && searchGame !== null && searchGame !== '')
            filter.gameId = searchGame.trim()
        if(searchEnvironment !== undefined && searchEnvironment !== null && searchEnvironment !== '')
            filter.environment = searchEnvironment.trim()
        if(searchSdk !== undefined && searchSdk !== null && searchSdk !== '')
            filter.sdk = searchSdk.trim()
        ///Contact_Status
        if(searchStatus !== undefined && searchStatus !== null && searchStatus !== '')
            filter.status = searchStatus.trim()

        props.getDevs(qs,filter)///get API
        props.getSdk()
        props.getSupportGames()
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

    useEffect(()=>{
        // console.log('props.devs.sdk in wadasd : ',props.devs)
        if(props.devs.getSdkAuth){
            // console.log('props.devs.sdk in UseEffect: ',props.devs.sdk)
            setDevSdk(props.devs.sdk)
        }
    },[props.devs.getSdkAuth])
    useEffect(()=>{
        // console.log('props.devs.sdk in wadasd : ',props.devs)
        if(props.devs.getGamesAuth){
            // console.log('props.devs.sdk in UseEffect: ',props.devs.sdk)
            setDevGames(props.devs.games)
        }
    },[props.devs.getGamesAuth])
    useEffect(() => {
        if (props.devs.devsAuth) {
            console.log("props.devs.devs: ",props.devs.devs)
            const { contact, pagination } = props.devs.devs
            setDevs(contact)
            setPagination(pagination)
            // alert('1')
            props.beforeDev()
        }
    }, [props.devs.devsAuth])

    useEffect(() => {
        if (devs) {
            setLoader(false)
        }
    }, [devs])

    useEffect(() => {
        if (props.devs.updateAuth) {
            setLoader(true)
            const devData = devs.find((elem) => String(elem._id) === String(dev._id))
            devData.status = dev.status
            if (devData)
                setDev({ ...devData })
            setLoader(false)
            // alert('2')

            props.beforeDev()
        }
    }, [props.devs.updateAuth])

    const setModal = (type = 0, devId = null) => {
        setDevModel(!devModel)
        setModalType(type)
        setLoader(false)
        if ((type === 2 || type === 3) && devId)
            getDev(devId)
    }


    const getDev= async (devId) => {
        setLoader(true)
        const devData = await devs.find((elem) => String(elem._id) === String(devId))
        if (devData)
            setDev({ ...devData })
        setLoader(false)
    }

    const onPageChange = async (page) => {
        const filter = {type : '0'}
        if(searchContactId){
            filter.contactId = searchContactId.trim()
            localStorage.setItem('devContactId' , searchContactId)
        }
        if(searchName){
            filter.name = searchName.trim()
            localStorage.setItem('devName', searchName)
        }
        if(searchEmail){
            filter.email = searchEmail.trim()
            localStorage.setItem('devEmail', searchName)
        }
        if(searchGame){
            filter.game = searchGame.trim()
            localStorage.setItem('devGame', searchGame)
        }
        if(searchEnvironment){
            filter.environment = searchEnvironment.trim()
            localStorage.setItem('devEnvironment', searchEnvironment)
        }
        if(searchSdk){
            filter.sdk = searchSdk.trim()
            localStorage.setItem('devSdk', searchSdk)
        }
        if(searchStatus){
            filter.status = searchStatus.trim()
            localStorage.setItem('devStatus', searchStatus)
        }

        setLoader(true)
        setPage(page)
        const qs = ENV.objectToQueryString({ page ,limit: 10 })
        props.getDevs(qs,filter)
    }

    const applyFilters = () =>{
        const filter = {type : '0'}
        if(searchContactId){
            filter.contactId = searchContactId.trim()
            localStorage.setItem('devContactId' , searchContactId)
        }
        if(searchName){
            filter.name = searchName.trim()
            localStorage.setItem('devName', searchName)

        }
        if(searchEmail){
            filter.email = searchEmail.trim()
            localStorage.setItem('devEmail', searchEmail)

        }
        if(searchGame){
            filter.gameId = searchGame.trim()
            localStorage.setItem('devGame', searchGame)
        }
        if(searchEnvironment){
            filter.environment = searchEnvironment.trim()
            localStorage.setItem('devEnvironment', searchEnvironment)
        }
        if(searchSdk){
            filter.sdk = searchSdk.trim()
            localStorage.setItem('devSdk', searchSdk)
        }
        if(searchStatus){
            filter.status = searchStatus.trim()
            localStorage.setItem('devStatus', searchStatus)
        }
        console.log("filter ::", filter)
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        props.getDevs(qs, filter)
        setLoader(true)
    }

    const reset = () =>{
        setSearchContactId('')
        setSearchName('')
        setSearchEmail('')
        setSearchGame('')
        setSearchEnvironment('')
        setSearchSdk('')
        setSearchStatus('')

        localStorage.removeItem('devContactId')
        localStorage.removeItem('devName')
        localStorage.removeItem('devEmail')
        localStorage.removeItem('devGame')
        localStorage.removeItem('devEnvironment')
        localStorage.removeItem('devSdk')
        localStorage.removeItem('devStatus')
        const qs = ENV.objectToQueryString({ page : 1, limit: 10 })
        props.getDevs(qs , {type : '0'})
        setLoader(true)
    }
    return(
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
                                            {/* searchContactId */}
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>ContactId</label>
                                                    <Form.Control value = {searchContactId} type="text" placeholder="ContactId" onChange={(e) => setSearchContactId(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Name</label>
                                                    <Form.Control value = {searchName} type="text" placeholder="John" onChange={(e) => setSearchName(e.target.value)} /*onKeyDown={} */ />
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{color : 'white'}}>Email</label>
                                                <Form.Control value = {searchEmail} type="text" placeholder="john@mail.com" onChange={(e) => setSearchEmail(e.target.value)}/* onChange={} onKeyDown={} */ />
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Game Name</label>
                                                    <Form.Control 
                                                        as="select"
                                                        className="form-select pr-3 mr-3" aria-label="Default select example" 
                                                        value = {searchGame} 
                                                        type="text" 
                                                        placeholder="Game Name" 
                                                        onChange={(e) => setSearchGame(e.target.value)} >
                                                            <option value={''}>Select Game:</option>
                                                            {renderOptions(devGames)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>SDK</label>
                                                    <Form.Control 
                                                        as="select"
                                                        className="form-select pr-3 mr-3" aria-label="Default select example" 
                                                        value = {searchSdk} 
                                                        type="text" 
                                                        placeholder="Game Name" 
                                                        onChange={(e) => setSearchSdk(e.target.value)} >
                                                            <option value={''}>Select sdk:</option>
                                                            {renderOptions(devSdk)}
                                                    </Form.Control>
                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <label style={{color : 'white'}}>Environment</label>
                                                    <Form.Control 
                                                        as="select"
                                                        className="form-select pr-3 mr-3" aria-label="Default select example"
                                                        value = {searchEnvironment} 
                                                        type="text" 
                                                        placeholder="Subject" 
                                                        onChange={(e) => setSearchEnvironment(e.target.value)}
                                                    >
                                                        <option value={''}>Select Environment:</option>
                                                        {renderOption(envirementArray)}
                                                    </Form.Control>

                                                </Form.Group>
                                            </Col>
                                            <Col xl={3} sm={6}>
                                                <label style={{color : 'white'}}>Status</label>
                                                <select value={searchStatus} onChange={(e) =>  setSearchStatus(e.target.value)}>
                                                    <option value="">Select Status</option>
                                                    <option value={0}>In Progress</option>
                                                    <option value={1}>Pending</option>
                                                    <option value={2}>Closed</option>

                                                </select>
                                            </Col>
                                            
                                            <Col xl={3} sm={6}>
                                                <Form.Group>
                                                    <Form.Label className="d-block mb-2">&nbsp;</Form.Label>
                                                    <div className="d-flex justify-content-between filter-btns-holder">
                                                        <Button variant="info"  disabled={!searchContactId && !searchName && !searchEmail && !searchGame && !searchEnvironment && !searchSdk && !searchStatus } onClick={applyFilters}>Search</Button>
                                                        <Button variant="warning" hidden={!searchContactId && !searchName && !searchEmail && !searchGame && !searchEnvironment && !searchSdk && !searchStatus } onClick={reset}>Reset</Button>
                                                    </div>

                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <span style={{color : 'white'}}>{`Total : ${pagination?.total}`}</span>
                                <label>&nbsp;</label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Card className="table-big-boy">
                                    <Card.Header>
                                        <div className="d-block d-md-flex align-items-center justify-content-between">
                                            <Card.Title as="h4">Developer Support</Card.Title>
                                            {/* <p className="card-user">List Of Contacts</p> */}
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="table-full-width">
                                        <div className="table-responsive">
                                            <Table className="table-bigboy">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center serial-col">#</th>
                                                        <th>Contact Id</th>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Game</th>
                                                        {/* <th>Framework</th> */}
                                                        <th>SDK</th>
                                                        <th>Environment</th>
                                                        <th>Device modal</th>
                                                        <th>Device OS</th>
                                                        {/* <th className="text-description">Message</th> */}
                                                        <th>Status</th>
                                                        <th className="td-actions">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        devs && devs.length ? devs.map((item, index) => {
                                                            return (
                                                                <tr key={item._id}>
                                                                    <td className="text-center serial-col">{pagination && ((pagination.limit * pagination.page) - pagination.limit) + index + 1}</td>
                                                                    <td>{item?.contactId}</td>
                                                                    <td>
                                                                        {item?.name}
                                                                    </td>
                                                                    <td>
                                                                        {item?.email}
                                                                    </td>
                                                                    <td>
                                                                        {item.gameId ?  item.game?.name  : 'N/A' }
                                                                    </td>
                                                                    {/* <td>
                                                                        {item.framework}
                                                                    </td> */}
                                                                    <td>
                                                                        {item.sdk ? item.sdk?.name : 'N/A'}
                                                                    </td>
                                                                    <td>
                                                                        {item?.environment ? envirementArray[`${ item.environment }`] : 'N/A'}
                                                                    </td>
                                                                    <td>
                                                                        {item?.deviceModel}
                                                                    </td> 
                                                                    <td>
                                                                        {item?.deviceOs}
                                                                    </td>                                                                                                                                       
                                                                    <td>
                                                                        <span className={`text-white badge p-1 ${item.status === 1 ? `badge-danger` : item.status === 0 ? `badge-warning` : item.status === 2 ? `badge-success` : ``}`}>
                                                                            {item.status === 0 ? 'In Progress' : item.status === 1 ? 'Pending' : item.status === 2 ? 'Closed' : 'N/A'}                                                                        
                                                                        </span>
                                                                    </td>
                                                                    <td className="td-actions">
                                                                        <ul className="list-unstyled mb-0">
                                                                            <li className="d-inline-block align-top" key={1}>
                                                                                <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">View </Tooltip>)} >
                                                                                    <Button
                                                                                        className="btn-action btn-warning"
                                                                                        type="button"
                                                                                        variant="info"
                                                                                        onClick={() => setModal(2, item._id)}
                                                                                    >
                                                                                        <i className="fas fa-eye"></i>
                                                                                    </Button>
                                                                                </OverlayTrigger>
                                                                            </li>
                                                                            {
                                                                                // permissions && permissions.editContact &&
                                                                                <li className="d-inline-block align-top" key={2}>
                                                                                    <OverlayTrigger overlay={()=>(<Tooltip id="tooltip-481441726">Edit</Tooltip>)} >
                                                                                        <Button
                                                                                            className="btn-action btn-warning"
                                                                                            type="button"
                                                                                            variant="success"
                                                                                            onClick={
                                                                                                () => {
                                                                                                    setModal(3, item._id);
                                                                                                    setTitle('Select Status')
                                                                                                }
                                                                                            }
                                                                                        >
                                                                                            <i className="fas fa-edit"></i>
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
                                                                <td colSpan="7" className="text-center">
                                                                    <div className="alert alert-info" role="alert">No Developer Found</div>
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
                            modalType > 0 && dev &&
                            <Modal className="modal-primary edit-cotnact-modal" onHide={() => setDevModel(!devModel)} show={devModel}>
                                <Modal.Header className="justify-content-center">
                                    <Row>
                                        <div className="col-12">
                                            <h4 className="mb-0 mb-md-3 mt-0">
                                                {modalType === 3 ? 'Edit' : ''} Developer Support
                                            </h4>
                                        </div>
                                    </Row>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form className="text-left">
                                        <div className=" name-email">
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Username:</strong>
                                                    <span>{dev.name ? dev.name : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Name: </label><span className="ml-2">{contact.name}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Email:</strong>
                                                    <span>{dev.email ? dev.email  :'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Email: </label><span className="ml-2">{contact.email}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Game:</strong>
                                                    <span>{dev.gameId ? dev.gameId : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Environment:</strong>
                                                    <span>{dev.environment ? envirementArray[`${dev.environment}`] : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">SDK:</strong>
                                                    <span>{dev.sdkId ? dev.sdkId : 'N/A' }</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Device OS:</strong>
                                                    <span>{dev.deviceOs ? dev.deviceOs : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Device Model:</strong>
                                                    <span>{dev.deviceModel ? dev.deviceModel : 'N/A'}</span>
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Crash Log:</strong>
                                                    { dev.crashLog ? <span onClick={()=> window.open( dev.crashLog , "_blank")}>{dev.crashLog ? dev.crashLog : 'N/A'}</span> : <span>N/A</span>} 
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Manifiest :</strong>
                                                    { dev.manifestFile ? <span onClick={()=> window.open( dev.manifestFile , "_blank")}>{dev.manifestFile ? dev.manifestFile : 'N/A'}</span> : <span>N/A</span>} 
                                                </div>
                                                {/* <label className="label-font">Subject: </label><span className="ml-2">{contact.subject}</span> */}
                                            </Form.Group>
                                            <Form.Group>
                                                <div className="nft-detail-holder d-flex align-items-center">
                                                    <strong className="mr-2">Status:</strong>
                                                    <span className={`ml-2 badge ${dev.status === 1 && modalType === 2 ? `badge-danger p-1` : dev.status === 0 && modalType === 2 ? `badge-warning p-1` : dev.status === 2 && modalType === 2 ? `badge-success p-1` :``}`}>
                                                    {modalType === 2 ?
                                                        (dev.status === 0 ? 'In Progress' : dev.status === 1 ? 'Pending' : dev.status === 2 ? 'Closed' : 'N/A')
                                                        : <InputGroup className="float-right">
                                                            <DropdownButton
                                                                variant="outline-secondary"
                                                                title={dev.status === 0 ? 'In Progress' : dev.status === 1 ? 'Pending' : dev.status === 2 ? 'Closed' : 'Select Status'}
                                                                id="status-dropDown"
                                                                className="status-dropDown"
                                                            >
                                                                <Dropdown.Item onClick={() => {
                                                                    setTitle("In Progress")
                                                                    setDev({ ...dev , status: 0 })
                                                                }}>In Progress</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Pending")
                                                                        setDev({ ...dev , status: 1 })
                                                                    }
                                                                }>Pending</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Closed")
                                                                        setDev({ ...dev, status: 2 })
                                                                    }
                                                                }>Closed</Dropdown.Item>
                                                            </DropdownButton>
                                                        </InputGroup>
                                                    }</span>
                                                </div>
                                            </Form.Group>
                                            {/* <Form.Group>
                                                <div className="nft-detail-holder d-flex">
                                                    <strong className="mr-2">Message:</strong>
                                                    <span>{dev.message}</span>
                                                </div>
                                            </Form.Group> */}
                                       </div>
                                        {/* <div className="d-flex name-email">
                                            <Form.Group>
                                                <label className="label-font mb-0">Status:</label><span className={`ml-2 d-inline-block align-top text-white ${contact.status === 1 && modalType === 2 ? `bg-danger p-1` : contact.status === 0 && modalType === 2 ? `bg-warning p-1` : contact.status === 2 && modalType === 2 ? `bg-success p-1` :``}`}>
                                                    {modalType === 2 ?
                                                        (contact.status === 0 ? 'In Progress' : contact.status === 1 ? 'Pending' : contact.status === 2 ? 'Closed' : 'N/A')
                                                        : <InputGroup className="float-right">
                                                            <DropdownButton
                                                                variant="outline-secondary"
                                                                title={title}
                                                                id="status-dropDown"
                                                            >
                                                                <Dropdown.Item onClick={() => {
                                                                    setTitle("In Progress")
                                                                    setContact({ ...contact, status: 0 })
                                                                }}>In Progress</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Pending")
                                                                        setContact({ ...contact, status: 1 })
                                                                    }
                                                                }>Pending</Dropdown.Item>
                                                                <Dropdown.Item onClick={
                                                                    () => {
                                                                        setTitle("Closed")
                                                                        setContact({ ...contact, status: 2 })
                                                                    }
                                                                }>Closed</Dropdown.Item>
                                                            </DropdownButton>
                                                        </InputGroup>
                                                    }</span>
                                            </Form.Group>
                                        </div>
                                        <div className="d-flex">
                                            <Form.Group>
                                                <label className="label-font">Message: </label><span className="ml-2">{contact.message}</span>
                                            </Form.Group>
                                        </div>*/}
                                    </Form>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button className="btn btn-danger" onClick={() => setDevModel(!devModel)}>Close</Button>
                                    {modalType === 3 ?
                                        <Button className="btn btn-info"
                                            onClick={
                                                () => {
                                                    setDevModel(!devModel);
                                                    let formData = new FormData()
                                                    for (const key in dev)
                                                        formData.append(key, dev[key])
                                                    props.updateDev(dev._id , formData);
                                                    setTitle("Select Status");
                                                }
                                            }
                                        >
                                        Update</Button>
                                        :
                                        ''
                                    }
                                </Modal.Footer>
                            </Modal>
                        }
                    </Container>
            }            
        </>
    )
}

const mapStateToProps = state => ({
    devs: state.devs,
    error: state.error,
    getRoleRes: state.role.getRoleRes
});

export default connect(mapStateToProps, { beforeDev, getDevs, updateDev, getSdk , getSupportGames ,  getRole })(DevSupport);
