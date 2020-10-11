import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import helper from '../../utils/helper.js';
import './profile.css';

import { FaPlus, FaAngleLeft, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleRight, FaSearch } from 'react-icons/fa';

import {
    Button,
    FormGroup,
    Input,
    FormFeedback,

    Spinner,
    InputGroup,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem 
 } from 'reactstrap';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        const lang = helper.lang(this.props.language);
        this.state = {
            showPage: 'basic',
            errMsg: {}
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

    saveProfile = () => {
        this.setState({editting: !this.state.editting})
    }

    saveSensitiveProfile = () => {
        this.setState({editting: !this.state.editting})
    }

    render() {
        console.log(this.state, 'state')
        return (
        <div className='mt-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <div className='card'>
                                <div className='profile'>
                                    <div className='acount-dp'>
                                        <div className='dp-page m-auto'><div style={{verticalAlign: 'middle', lineHeight: '10rem'}} onClick={() => window.location= '/profile'}>{this.props.profile.user.initial}</div></div>
                                    </div>
                                    <h5 className='mt-3'>{this.props.profile.user.name}</h5>
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
                                                <Input invalid={this.state.errMsg['firstName'] ? true: false} className='input' name='firstName' type='text' placeholder='Nama Depan' value={this.state.firstName || this.props.profile.user.firstName} onChange={this.changeHandler}/>
                                                { this.state.errMsg['email'] ? (<FormFeedback>{this.state.errMsg['email']} </FormFeedback> ) : null}
                                            </FormGroup>
                                            </div>
                                            <div className='col-md-6'>
                                            <FormGroup>
                                                <div>Nama Belakang: </div>
                                                <Input invalid={this.state.errMsg['lastName'] ? true: false} className='input' name='lastName' type='text' placeholder='Nama Belakang' value={this.state.lastName || this.props.profile.user.lastName} onChange={this.changeHandler}/>
                                                { this.state.errMsg['email'] ? (<FormFeedback>{this.state.errMsg['email']} </FormFeedback> ) : null}
                                            </FormGroup>
                                            </div>

                                            <div className='col-md-12'>
                                            <FormGroup>
                                                <div>Email: </div>
                                                <div className='inputMenu h6 mb-3'>{this.props.profile.user.email}</div>
                                            </FormGroup>
                                            </div>

                                            <div className='col-md-12'>
                                            <FormGroup>
                                                <div>Alamat: </div>
                                                <Input invalid={this.state.errMsg['address'] ? true: false} className='input' name='address' type='text' placeholder='Alamat' value={this.state.address || this.props.profile.user.address} onChange={this.changeHandler}/>
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
                                                <div className='inputMenu h6 mb-3'>{this.props.profile.user.firstName || '-'}</div>
                                            </div>
                                            <div className='col-md-6'>
                                                <div>Nama Belakang: </div>
                                                <div className='inputMenu h6 mb-3'>{this.props.profile.user.lastName || '-'}</div>
                                            </div>

                                            <div className='col-md-12'>
                                                <div>Email: </div>
                                                <div className='inputMenu h6 mb-3'>{this.props.profile.user.email || '-'}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <div>Alamat: </div>
                                                <div className='inputMenu h6 mb-3'>{this.props.profile.user.address || '-'}</div>
                                            </div>
                                            {/* <div className='col-md-6'>
                                                <div>Kota: </div>
                                                <div className='inputMenu h6 mb-3'>{this.props.profile.user.city || ''}</div>
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
                                                <div className='inputMenu h6 mb-3'>{this.state.showSensitive ? this.props.profile.user.ktp || '-' : '****'}</div>
                                            </div>
                                            <div className='col-md-12'>
                                                <div>CC: </div>
                                                <div className='inputMenu h6 mb-3'>{this.state.showSensitive ? this.props.profile.user.cc|| '-' : '****'}</div>
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
                                                <Button className='button-primary px-5' onClick={()=> {this.setState({showSensitive: !this.state.showSensitive})}}>
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
                                                    <Button className='button-primary px-5' onClick={this.saveSensitiveProfile}>
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