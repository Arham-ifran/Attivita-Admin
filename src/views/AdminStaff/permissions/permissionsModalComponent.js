import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { ENV } from '../../../config/config';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import Swal from 'sweetalert2';
import validator from 'validator';
import { addRole, updateRole, beforeRole } from './permissions.actions';
import $ from 'jquery';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal, FormGroup } from "react-bootstrap";

const StaffPermissionModal = (props) => {
    const dispatch = useDispatch()
    const [title, setTitle] = useState('')
    const [status, setStatus] = useState(true)
    const [selectAll, setSelectAll] = useState(false)
    const [titleMsg, setTitleMsg] = useState('')
    const [formValid, setFormValid] = useState(false)
    const [permissions, setPermissions] = useState({
        /**  system permissions **/

        // admin records
        addAdmin: false,
        editAdmin: false,
        deleteAdmin: false,
        viewAdmin: false,

        // cms records
        addCMS: false,
        editCMS: false,
        deleteCMS: false,
        viewCMS: false,

        //email-templates
        editEmails: false,
        viewEmails: false,

        // settings
        editSetting: false,
        viewSetting: false,

        // languages
        addLanguage: false,
        editLanguage: false,
        deleteLanguage: false,
        viewLanguage: false,

        // contacts
        addContact: false,
        editContact: false,
        deleteContact: false,
        viewContact: false,

        // FAQs 
        addFaq: false,
        editFaq: false,
        deleteFaq: false,
        viewFaqs: false,

        // roles
        addRole: false,
        editRole: false,
        deleteRole: false,
        viewRole: false,

        // status (i.e: true for active & false for in-active)

    })
    const addRoleRes = useSelector(state => state.role.addRoleRes)
    const updateRoleRes = useSelector(state => state.role.updateRoleRes)
    const authenticate = useSelector(state => state.role.authenticate)
    const onChangeCheckbox = (name, value) => {
        let roles = permissions
        if (name === 'selectAll') {
            Object.keys(roles).forEach((val, key) => {
                if (val !== 'title' && val !== '_id' && val !== 'status' && val !== 'createdAt' && val !== 'updatedAt' && val !== '_v')
                    roles = { ...roles, [val]: value }
            });
            setSelectAll(value)
        }
        else {
            roles = { ...roles, [name]: value }

            // select all state settings
            let count = 0;

            Object.keys(roles).forEach((key, index) => {
                if (roles[key] === true && key !== 'status')
                    count++;
            });
            let selectCount = count === 62 ? true : false
            setSelectAll(selectCount)
        }
        setPermissions(roles)
    }
    const submit = (e) => {
        if (title === undefined) {
            setTitleMsg("Title Required.")
            $('.modal-primary').scrollTop(0, 0)
            setFormValid(true)
        }
        else {
            if (!validator.isEmpty(title)) {
                setTitleMsg(title)
                setFormValid(false)

                const role = { ...permissions, title, status }


                if (props.modalType === 1) // add modal type
                    dispatch(addRole(role));
                else if (props.modalType === 3) // update modal type
                    dispatch(updateRole(role));

                setPermissions(role)
                props.setData(role)
                props.setLoader(true)
            }
            else {
                setTitleMsg("Title Required.")
                $('.modal-primary').scrollTop(0, 0)
                setFormValid(true)
            }
        }

    }


    useEffect(() => {
        if (Object.keys(props.role).length > 0) {
            // setPermissions(props.role)
            // setTitle(props.role.title)
            // setStatus(props.role.status)
            updateInitialData({ ...props });
        }
    }, [props.role])

    const updateInitialData = (props) => {
        let newprops = { ...props };
        setPermissions(newprops.role)
        setTitle(newprops.role.title)
        setStatus(newprops.role.status)
    }

    useEffect(() => {
        if (props.modalType === 2) {
            $(".modal-primary input").prop("disabled", true);
        } else {
            $(".modal-primary input").prop("disabled", false);
        }
    }, [props.modalType])

    useEffect(() => {
        if (addRoleRes.success && authenticate === true) {
            // closeModal();
            // this.props.role.removeLoader();
            props.setroleModal(!props.roleModal)

            props.setModalType(1)
            props.setLoader(false)
            setEmpty()
            // setRole({})

            toast.success(`Success! ${addRoleRes.message}`);
        }
    }, [addRoleRes])

    const onCloseHandler = () => {
        props.setroleModal(!props.roleModal)
        // setEmpty()
    }

    useEffect(() => {
        if (Object.keys(updateRoleRes).length > 0 && authenticate === true) {

            props.setroleModal(!props.roleModal)
            props.setModalType(1)
            props.setLoader(false)
            toast.success(`Success! ${updateRoleRes.message}`);
            beforeRole();
        }
    }, [updateRoleRes])

    const setEmpty = () => {
        for (let key in permissions) {
            permissions[key] = false
        }
    }


    return (
        <Container fluid>
            {
                formValid ?
                    <div className="text-danger">Please fill the required fields</div> : null
            }
            {
                props.modalType > 0 &&
                <Modal className="modal-primary" onHide={() => props.setroleModal(!props.roleModal)} show={props.roleModal}>
                    <Modal.Header className="justify-content-center">
                        <Row>
                            <div className="col-12">
                                <h4 className="mb-0 mb-md-3 mt-0">
                                    {props.modalType === 1 ? 'Add New' : props.modalType === 2 ? 'View' : 'Edit'} Staff Role
                                </h4>
                            </div>
                        </Row>
                    </Modal.Header>
                    <Modal.Body className="modal-body">
                        <Form>
                            <Form.Group>
                                <Row>
                                    <Col md={9}>
                                        <label className="label-font">Title <span className="text-danger">*</span></label>
                                        <Form.Control
                                            placeholder="Enter name"
                                            type="text"
                                            name="title"
                                            onChange={(e) => setTitle(e.target.value)}
                                            disabled={props.modalType === 2}
                                            value={title}
                                            required
                                        />
                                        <span className={titleMsg ? `` : `d-none`}>
                                            <label className="pl-1 text-danger">{titleMsg}</label>
                                        </span>
                                    </Col>

                                    <Col md={3}>
                                        <label className="right-label-checkbox">Select All
                                            <input type="checkbox" name="selectAll" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll} />
                                            <span className="checkmark"></span>
                                        </label>

                                        {/* <label className="label-font">Select All</label>
                                            <input type="checkbox" name="selectAll" disabled = {props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !selectAll)} checked={selectAll}></input> */}
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Admin</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap" >
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewAdmin)} checked={permissions.viewAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addAdmin)} checked={permissions.addAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editAdmin)} checked={permissions.editAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteAdmin" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteAdmin)} checked={permissions.deleteAdmin} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">CMS Pages</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewCMS)} checked={permissions.viewCMS} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addCMS)} checked={permissions.addCMS} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editCMS)} checked={permissions.editCMS} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCMS)} checked={permissions.deleteRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Languages</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewLanguage)} checked={permissions.viewLanguage} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addLanguage)} checked={permissions.addLanguage} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editLanguage)} checked={permissions.editLanguage} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteLanguage" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCMS)} checked={permissions.deleteLanguage} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Contacts</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewContact)} checked={permissions.viewContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addContact)} checked={permissions.addContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editContact)} checked={permissions.editContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteContact" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCMS)} checked={permissions.deleteContact} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">FAQs</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewFaqs" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewFaqs)} checked={permissions.viewFaqs} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addFaq)} checked={permissions.addFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editFaq)} checked={permissions.editFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteFaq" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteFaq)} checked={permissions.deleteFaq} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Roles</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewRole)} checked={permissions.viewRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Add
                                            <input type="checkbox" name="addRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.addRole)} checked={permissions.addRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editRole)} checked={permissions.editRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Delete
                                            <input type="checkbox" name="deleteRole" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.deleteCMS)} checked={permissions.deleteRole} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Email Templates</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewEmails)} checked={permissions.viewEmails} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editEmails)} checked={permissions.editEmails} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Settings</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap">
                                        <label className="right-label-checkbox mr-3 mb-2">View
                                            <input type="checkbox" name="viewSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.viewSetting)} checked={permissions.viewSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-checkbox mr-3 mb-2">Edit
                                            <input type="checkbox" name="editSetting" disabled={props.modalType === 2} onChange={(e) => onChangeCheckbox(e.target.name, !permissions.editSetting)} checked={permissions.editSetting} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </Form.Group>
                            <FormGroup>
                                <Row>
                                    <Col md={3}>
                                        <label className="label-font">Status</label>
                                    </Col>
                                    <Col md={9} className="check-inline d-flex flex-wrap" >
                                        <label className="right-label-radio mr-3 mb-2">Active
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={status} value={status} onChange={(e) => setStatus(true)} />
                                            <span className="checkmark"></span>
                                        </label>
                                        <label className="right-label-radio mr-3 mb-2">InActive
                                            <input name="status" disabled={props.modalType === 2} type="radio" checked={!status} value={!status} onChange={(e) => setStatus(false)} />
                                            <span className="checkmark"></span>
                                        </label>
                                    </Col>
                                </Row>
                            </FormGroup>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button className="btn btn-warning" onClick={(e) => onCloseHandler()}>Close</Button>
                        {props.modalType === 2 ? '' :
                            <Button className="btn btn-info" onClick={() => submit()} /* disabled={isLoader} */>Save</Button>
                        }
                    </Modal.Footer>
                </Modal>
            }
        </Container>
    )
}

export default StaffPermissionModal;