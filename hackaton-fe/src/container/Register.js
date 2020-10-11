import React from 'react';
import { connect } from 'react-redux';
import helper from '../utils/helper.js';
import { register } from './../actions/auth';
import web3Utils from 'web3-utils';
import { Link, Redirect } from 'react-router-dom';
import { 
    Button,
    FormGroup,
    Input,
    Form
 } from 'reactstrap';
 import './cloud.css';
import { api } from '../api/index.js';

class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            passwordConfirmation: '',

            //validation
            validationOption: [
                {
                    key: 'email',
                    label: 'Email',
                    isRequired: true,
                    validEmail: true
                },
                {
                    key: 'firstName',
                    label: 'Nama Depan',
                    isRequired: true
                },
                {
                    key: 'password',
                    label: 'Password',
                    isRequired: true,
                    minLength: 4
                },
                {
                    key: 'passwordConfirmation',
                    label: 'Confirm Password',
                    confirm: 'password'
                }
            ],
            errMsg: {}
        };
    }

    validation = () => {
        let valid= true;
        let err;
        let errMsg = {};

        for(let option of this.state.validationOption){
            err = helper.validate(this.state[option.key], option, this.props.language)
            if (option.confirm){
                if (this.state[option.key] !== this.state[option.confirm])
                    err = `Form ${option.label || option.key} harus sama dengan Form ${option.confirm}`
            }
            if (err) {
                errMsg[option.key] = err;
                valid = false;
            }
        }
        console.log(errMsg)
        this.setState({errMsg: errMsg});
        this.props.register.err= '';
        this.props.register.errEng= '';
        return valid;
    }

    handleOnSubmit = async (e) => {
      e.preventDefault();
      try{
            if(this.validation()){
                this.setState({loading: true})
                const res = await api.post_noAuth('register', {
                    email: this.state.email,
                    password: web3Utils.sha3(this.state.password)
                });
                console.log('res', res)
                this.setState({loading: false})
                console.log(res.status, res.data.message, '----')
                if (res.status === 200 && res.data.message === 'register success')
                    this.setState({redirect: '/login'})
            }
      }catch(e){
          console.log('error at registering', e)
          this.setState({errRegister: 'Unknown Error!'})
      }
    };

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
    const lang = helper.lang(this.props.language)

    if(this.state.redirect)
        return (<Redirect to={{pathname: this.state.redirect, redirectMsg: 'Registrasi Berhasil!'}}></Redirect>)    

      return (
        <div>
            <div id="clouds">
                <div className="cloud x1" style={{left: '10vw', top : '20vh'}}></div>
                <div className="cloud x2" style={{left: '70vw', top : '25vh'}}></div>
                <div className="cloud x3" style={{left: '10vw', top : '55vh'}}></div>
                <div className="cloud x4" style={{left: '30vw', top : '44vh'}}></div>
                <div className="cloud x5" style={{left: '55vw', top : '62vh'}}></div>
                <div className="cloud x3" style={{left: '80vw', top : '25vh'}}></div>
                <div className="cloud x2" style={{left: '80vw', top : '0vh'}}></div>
                <div className="cloud x1" style={{left: '14vw', top : '30vh'}}></div>
            </div>

            <div className='centerDiv card card-signup card-no-border'>
                <Form onSubmit={this.handleOnSubmit}>
                    <h4 className='mb-4 mt-3'>{lang('Daftar Sebagai User Baru', 'Sign up as New User')}</h4>
                    <FormGroup>
                        <Input className='input' name='firstName' type='text' placeholder={lang('Nama Depan', 'Name')} value={this.state.firstName} onChange={this.changeHandler}/>
                        { this.state.errMsg['firstName'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['firstName']}
                            </h6>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
                        <Input className='input' name='lastName' type='text' placeholder={lang('Nama Belakang', 'Name')} value={this.state.lastName} onChange={this.changeHandler}/>
                        { this.state.errMsg['lastName'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['lastName']}
                            </h6>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
                        <Input className='input' name='email' type='text' placeholder='Email' value={this.state.email} onChange={this.changeHandler}/>
                        { this.state.errMsg['email'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['email']}
                            </h6>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
                        <Input className='input' type='password' name='password' placeholder={lang('Kata Sandi', 'Password')} value={this.state.password} onChange={this.changeHandler}/>
                        { this.state.errMsg['password'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['password']}
                            </h6>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
                        <Input className='input' type='password' name='passwordConfirmation' placeholder={lang('Konfirmasi Kata Sandi', 'Confirm Password')} value={this.state.passwordConfirmation} onChange={this.changeHandler}/>
                        { this.state.errMsg['passwordConfirmation'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['passwordConfirmation']}
                            </h6>
                        ) : null}
                    </FormGroup>

                    { this.state.errRegister ? (
                        <h6 className='errValidation mb-3'>
                            {this.state.errRegister}
                        </h6>
                    ) : null}

                    <FormGroup>
                        <Button className='w-100  button-primary' type='submit'>{lang('Daftar', 'Sign Up')}</Button>
                    </FormGroup>
                    <FormGroup>
                        <Link to={{pathname: '/login'}}>
                            <Button className='w-100  button-primary' type='submit'>{lang('Saya sudah mempunyai Akun', 'I already have an account')}</Button>
                        </Link>
                    </FormGroup>
                    { this.state.loading ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ): null }
                </Form>
            </div>
        </div>
      )
    }
  }

const mapStateToProps = state => ({
    ...state
})
const mapDispatchToProps = dispatch => ({
    registerAction: (data) => dispatch(register(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Register);