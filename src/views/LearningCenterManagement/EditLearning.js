import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { beforeLearning, getLearning, updateLearning } from './learning.action';
import FullPageLoader from 'components/FullPageLoader/FullPageLoader';
import 'rc-pagination/assets/index.css';
import { Button, Card, Form, Table, Container, Row, Col, OverlayTrigger, Tooltip, Modal } from "react-bootstrap";
import validator from 'validator';
import { ENV } from 'config/config';
import defaultImage from '../../../src/assets/img/faces/face-0.jpg';
import { Link } from 'react-router-dom'
const EditLearning = (props) => {

    const [data, setData] = useState({
        title: '',
        link: '',
        image:'',
        status: false ,
        linkType: true ,
        dashboard: true ,
    })


    const [titleMsg,setTitleMsg]=useState('')
    const [linkMsg,setLinkMsg]=useState('')



    const [loader, setLoader] = useState(true)

    useEffect(() => {
        window.scroll(0, 0)
        props.getLearning(window.location.pathname.split('/')[3])
    }, [])

    useEffect(() => {
    if (props.learnings.getlearningAuth) {
            const { title, link,linkType,image, dashboard ,  status } = props.learnings.learning
            setData({ title, link,image, linkType , dashboard , status, _id: window.location.pathname.split('/')[3] })
            props.beforeLearning()
            setLoader(false)
        }
    }, [props.learnings.getlearningAuth])

    useEffect(() =>{
        if(props.learnings.editlearningsAuth){
            props.beforeLearning()
            props.history.push(`/learning-center`)
        }
    }, [props.learnings.editlearningsAuth])

    
    const update = () => {
        let check=true
        if (validator.isEmpty(data.title))
        {
            setTitleMsg('Title is Required')
            check =false
        }
    
        if(validator.isEmpty(data.link)) {
            setLinkMsg('Link is Required')
            check =false

        }
        if (!validator.isEmpty(data.title))
        {
            setTitleMsg('')
           
        }
    
        if(!validator.isEmpty(data.link)) {
            setLinkMsg('')
          

        }
            if(check)
            props.updateLearning(data,data._id)
        }


        const fileSelectHandler = async(e) => {
            e.preventDefault();
            let files;
            if (e.dataTransfer) {
              files = e.dataTransfer.files;
            } else if (e.target) {
              files = e.target.files;
            }
            const reader = new FileReader();
            reader.onload = async() => {
           
            };
            reader.readAsDataURL(files[0]);
        };
    

    return (
        <>
            {
                loader ?
                    <FullPageLoader />
                    :
                    <Container>
                        <Row>
                            <Col md="12">
                                <Card className="pb-3">
                                    <Card.Header>
                                        <Card.Title as="h4">Edit Learning Center</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                    <Row>
                                            <Col md="12" sm="6">
                                                <label>Image</label>
                                                    <div className='mb-2'>
                                                        {console.log("thumbnail: ",data.image)}
                                                        {(data.image!== undefined || data.image.length !=0) && <img src={data.image} onError={(e)=> {e.target.onerror = null ; e.target.src = defaultImage}  } className="img-thumbnail" style={{width:'100px'}}/>} 
                                                    </div>
                                                    <Form.Control className='text-white'
                                                    // value={data.thumbnail ? data.thumbnail : ''}
                                                    onChange={async (e) => {
                                                        // fileSelectHandler(e);
                                                        const res=await ENV.uploadImage(e);
                                                        setData({ ...data, image: res ? ENV.uploadedImgPath+res  : "" });
                                                    }}
                                                    // placeholder="Title"
                                                    type="file"
                                                ></Form.Control>
                                        
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group >
                                                    <label >Title<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.title ? data.title : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, title: e.target.value });
                                                        }}
                                                        placeholder="Title"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={titleMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{titleMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>



                                        <Row>
                                            <Col md="6">
                                                <Form.Group>
                                                    <label>Link<span className="text-danger"> *</span></label>
                                                    <Form.Control
                                                        value={data.link ? data.link : ''}
                                                        onChange={(e) => {
                                                            setData({ ...data, link: e.target.value });
                                                        }}
                                                        placeholder="Link"
                                                        type="text"
                                                    ></Form.Control>
                                                    <span className={linkMsg ? `` : `d-none`}>
                                                        <label className="pl-1 text-danger">{linkMsg}</label>
                                                    </span>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                        <Col md="6">
                                                <Form.Group className='d-flex align-items-center'>
                                                    <label>Show in dashboard<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="dashboard" type="checkbox" checked={data.dashboard} value={data.dashboard} onChange={(e) => setData({ ...data, dashboard: true })} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => {
                                                            setData({ ...data, dashboard: true });
                                                        }} ><i />Yes</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="dashboard" type="checkbox" checked={!data.dashboard} value={!data.dashboard} onChange={(e) => setData({ ...data, dashboard: false })}  />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, dashboard: false });
                                                        }} ><i />No</span>
                                                    </label>
                                                    
                                                </Form.Group>
                                            </Col>
                                        </Row>  
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-flex align-items-center'>
                                                    <label>Link Type<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="linkType" type="checkbox" checked={data.linkType} value={data.linkType} onChange={(e) => setData({ ...data, linkType: true })} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => {
                                                            setData({ ...data, linkType: true });
                                                        }} ><i />Video</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="linkType" type="checkbox" checked={!data.linkType} value={!data.linkType} onChange={(e) => setData({ ...data, linkType: false })}  />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, linkType: false });
                                                        }} ><i />Image</span>
                                                    </label>
                                                    
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6">
                                                <Form.Group className='d-flex align-items-center'>
                                                    <label>Status<span className="text-danger mr-1"> *</span></label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="status" type="checkbox" checked={data.status} value={data.status} onChange={(e) => setData({ ...data, status: true })} />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1'  onChange={(e) => {
                                                            setData({ ...data, status: true });
                                                        }} ><i />Active</span>
                                                    </label>
                                                    <label className="right-label-radio mr-3 mb-2 d-flex align-items-center">
                                                        <input name="status" type="checkbox" checked={!data.status} value={!data.status} onChange={(e) => setData({ ...data, status: false })}  />
                                                        <span className="checkmark"></span>
                                                        <span className='ml-1' onChange={(e) => {
                                                            setData({ ...data, status: false });
                                                        }} ><i />Inactive</span>
                                                    </label>
                                                    
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md="12" sm="6">
                                                <Button
                                                    className="btn-fill pull-right mt-3"
                                                    type="submit"
                                                    variant="info"
                                                    onClick={update}
                                                >
                                                    Update
                                                </Button> 
                                                <Link to={'/learning-center'}  className="float-right" >
                                                    <Button className="btn-fill pull-right mt-3" variant="info">
                                                     Back
                                                    </Button>
                                                </Link>
                                            </Col>

                                        </Row>

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
    error: state.error
});

export default connect(mapStateToProps, { beforeLearning, getLearning, updateLearning })(EditLearning);