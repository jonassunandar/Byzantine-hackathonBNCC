import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import web3Utils from 'web3-utils';

import helper from '../../utils/helper.js';
import './profile.css';

import { FaPlus, FaAngleLeft, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleRight, FaSearch } from 'react-icons/fa';

import {
    Button,
    FormGroup,
    Input,
    FormFeedback,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Spinner,
    InputGroup,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem 
 } from 'reactstrap';
import { api } from '../../api/index.js';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            showPage: 'basic',
            errMsg: {},
            firstName: localStorage.getItem('firstName'),
            lastName: localStorage.getItem('lastName'),
            name: localStorage.getItem('firstName') + ' '+ localStorage.getItem('lastName'),
            initial: localStorage.getItem('initial'),
            email: localStorage.getItem('email'),
            address: localStorage.getItem('address'),
        };
        
    }

    handleOnSubmit = (e) => {
        e.preventDefault();
        
    };

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    toggleDropdown = ()=> {
        this.setState({dropdownOpen: !this.state.dropdownOpen}); 
    }

    redirectEdit = () => {
        this.setState({redirect: '/profile/edit'})
    }

    saveProfile = async () => {
        try{
            this.setState({loading: true})
            const res = await api.post('update_non_sensitive', {
                address: this.state.address,
                first_name: this.state.firstName,
                last_name: this.state.lastName,
            })
            console.log('res non sensitive', res);
            this.getUserProfile();
        }catch(e){
            console.log('error at updating non sensitive', e);
            this.setState({loading: false, errUpdate: 'Unknown Error!'})
        }
        this.setState({editting: !this.state.editting})
    }

    getUserProfile = async () => {
        try{
            const res= await api.get('get_profile/');
            const firstName = res.data.data[0].first_name || 'user';
            const lastName = res.data.data[0].last_name || '';
            console.log('res, get user profile', res);
            localStorage.setItem('email', res.data.data[0].email);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('bcAddress', res.data.data[0].bcAddress);
            localStorage.setItem('initial', firstName.substring(0,1) + lastName.substring(0,1));
            localStorage.setItem('id', res.data.data[0].id);
            localStorage.setItem('address', res.data.data[0].address);
            window.location = '/profile'
        }catch(e){
            console.log('error at getting user profile', e)
            this.setState({errLogin: 'Unknown Error', loading: false})
        }
    }

    saveSensitiveProfile = async () => {
        try{
            this.setState({loading: true})
            const res = await api.post('update_sensitive', {
                ktp: this.state.ktp,
                cc: this.state.cc,
                password: web3Utils.sha3(this.state.password)
            })
            console.log('res sensitive', res);
            this.setState({editting: !this.state.editting, showModal: false,})
        }catch(e){
            console.log('error at updating sensitive', e);
            this.setState({loading: false, errUpdate: 'Unknown Error!'})
        }
        
        this.setState({password: '', loading: false})
    }

    getSensitiveDate = () => {
        this.setState({showModal: true, nextFn: async () => {
            try{
                this.setState({loading: true})
                const res = await api.post('get_sensitive_profile', {
                    password: web3Utils.sha3(this.state.password),
                })
                console.log('res get sensitive data', res);
                if(res.status === 200 && res.data.message === 'success update sensitive')
                    this.setState({ktp: res.data.data.ktp, cc: res.data.data.cc})
                this.setState({showSensitive: true})
            }catch(e){
                console.log('error at getting sensitive', e);
            }
            this.setState({showModal: false,password: '', loading: false})
        }})
    }

    render() {
        console.log(this.state, 'state')
        return (
        <div className='mt-4'>
            <Modal isOpen={this.state.showModal} toggle={() => this.setState({showModal: !this.state.showModal})} >
                <ModalBody  className='pb-0'>
                    <FormGroup>
                        <div>Masukan Password: </div>
                        <Input className='input' name='password' type='password' placeholder='Password' value={this.state.password} onChange={this.changeHandler}/>
                    </FormGroup>
                    <div className='text-center'>
                    
                    </div>
                </ModalBody>
                <ModalFooter className='pt-0'>
                    { this.state.loading ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ): null }
                    <Button onClick={this.state.nextFn} className='button-primary px-5'>Submit</Button>
                </ModalFooter>
            </Modal>

                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <div className='card'>
                                <div className='profile'>
                                    <div className='acount-dp'>
                                        <div className='dp-page m-auto'><div style={{verticalAlign: 'middle', lineHeight: '10rem'}} onClick={() => window.location= '/profile'}>{this.state.initial}</div></div>
                                    </div>
                                    <h5 className='mt-3'>{this.state.name}</h5>
                                    <span class="icon">Verified</span><img src="/verified.svg" alt=""/>
                                </div>
                                
                                <div className='menu-group mt-3 mb-5'>
                                        <Button block className={(this.state.showPage === 'basic' ? 'button-primary ': '') + 'basic text-center'} onClick={()=> this.setState({showPage: 'basic', editting: false})}>
                                            Basic Information
                                        </Button>
                                        <Button block className={(this.state.showPage === 'sensitive' ? 'button-primary ': '') +'sensitive text-center'} onClick={()=> this.setState({showPage: 'sensitive', editting: false})}>
                                            Sensitive Information
                                        </Button>
                                    </div>
                            </div>
                        </div>
                        {/* <div className='col'></div> */}
                        <div className='col-sm-8'>
                            {this.state.showPage === 'basic' ? (
                            <div className='card'>
                                <div className='profile'>
                                    <h3 className='mb-5'>Detail Akun</h3>
                                    
                                    {this.state.editting ? (
                                    <>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                            <FormGroup>
                                                <div>Nama Depan: </div>
                                                <Input invalid={this.state.errMsg['firstName'] ? true: false} className='input' name='firstName' type='text' placeholder='Nama Depan' value={this.state.firstName || this.state.firstName} onChange={this.changeHandler}/>
                                                { this.state.errMsg['email'] ? (<FormFeedback>{this.state.errMsg['email']} </FormFeedback> ) : null}
                                            </FormGroup>
                                            </div>
                                            <div className='col-md-6'>
                                            <FormGroup>
                                                <div>Nama Belakang: </div>
                                                <Input invalid={this.state.errMsg['lastName'] ? true: false} className='input' name='lastName' type='text' placeholder='Nama Belakang' value={this.state.lastName || this.state.lastName} onChange={this.changeHandler}/>
                                                { this.state.errMsg['email'] ? (<FormFeedback>{this.state.errMsg['email']} </FormFeedback> ) : null}
                                            </FormGroup>
                                            </div>

                                            <div className='col-md-12'>
                                            <FormGroup>
                                                <div>Email: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.email}</div>
                                            </FormGroup>
                                            </div>

                                            <div className='col-md-12'>
                                            <FormGroup>
                                                <div>Alamat: </div>
                                                <Input invalid={this.state.errMsg['address'] ? true: false} className='input' name='address' type='text' placeholder='Alamat' value={this.state.address || this.state.address} onChange={this.changeHandler}/>
                                                { this.state.errMsg['address'] ? (<FormFeedback>{this.state.errMsg['address']} </FormFeedback> ) : null}
                                            </FormGroup>
                                            </div>

                                        </div>
                                        <div className='text-right mt-3'>
                                            <Button className='button-primary px-5' onClick={this.saveProfile}>
                                                Simpan
                                            </Button>
                                        </div>
                                    </>
                                    ) : ( 
                                    <>
                                        {/* not editting profile */}
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <div>Nama Depan: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.firstName || '-'}</div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div>Nama Belakang: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.lastName || '-'}</div>
                                            </div>

                                            <div className='col-md-12'>
                                                <div>Email: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.email || '-'}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <div>Alamat: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.address || '-'}</div>
                                            </div>
                                            {/* <div className='col-md-6'>
                                                <div>Kota: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.city || ''}</div>
                                            </div> */}

                                        </div>
                                        <div className='text-right mt-3'>
                                            <Button className='button-primary px-5' onClick={()=> {this.setState({editting: !this.state.editting})}}>
                                                Ubah
                                            </Button>
                                        </div>
                                    </>
                                    )}
                                </div>
                            </div>
                            ) : 
                                <div className='card'>
                                    <div className='profile'>
                                        <h3 className='mb-5'>Detail Akun</h3>
                                        
                                        {!this.state.editting ? (
                                        <>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <div>KTP: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.showSensitive ? this.state.ktp || '-' : '****'}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <div>CC: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.showSensitive ? this.state.cc|| '-' : '****'}</div>
                                            </div>
                                            
                                        </div>
                                        <div className='text-right mt-3'>
                                            {this.state.showSensitive ? (
                                                <>
                                                    <Button className='button-primary px-5 m-3' onClick={()=> {this.setState({showSensitive: !this.state.showSensitive})}}>
                                                        Sembunyikan
                                                    </Button>
                                                    <Button className='button-primary px-5' onClick={()=> {this.setState({editting: !this.state.editting})}}>
                                                        Ubah
                                                    </Button>
                                                </>
                                            ) : (
                                                <Button className='button-primary px-5' onClick={this.getSensitiveDate}>
                                                    Tunjukan
                                                </Button>
                                            )}
                                        </div>
                                        </>
                                        ) : ( 
                                            <>
                                                {/* not editting profile */}
                                                <div className='row'>
                                                    <div className='col-md-12'>
                                                        <FormGroup>
                                                            <div>KTP: </div>
                                                            <Input invalid={this.state.errMsg['ktp'] ? true: false} className='input' name='ktp' type='text' placeholder='ktp' value={this.state.ktp} onChange={this.changeHandler}/>
                                                            { this.state.errMsg['ktp'] ? (<FormFeedback>{this.state.errMsg['ktp']} </FormFeedback> ) : null}
                                                        </FormGroup>
                                                    </div>
                                                    <div className='col-md-12'>
                                                        <FormGroup>
                                                            <div>CC: </div>
                                                            <Input invalid={this.state.errMsg['cc'] ? true: false} className='input' name='cc' type='text' placeholder='Credit Card' value={this.state.cc} onChange={this.changeHandler}/>
                                                            { this.state.errMsg['cc'] ? (<FormFeedback>{this.state.errMsg['cc']} </FormFeedback> ) : null}
                                                        </FormGroup>
                                                    </div>
                                                </div>
                                                <div className='text-right mt-3'>
                                                    <Button className='button-primary px-5' onClick={() => this.setState({showModal: true, nextFn: this.saveSensitiveProfile})}>
                                                        Simpan
                                                    </Button>
                                                </div>
                                            </>
                                            )}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
        </div>
      )
    }
}

const mapStateToProps = state => ({
    ...state
})
const mapDispatchToProps = dispatch => ({
    // getTableData: (perPage, keyword, page) => dispatch(getTableData(perPage, keyword, page)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile);