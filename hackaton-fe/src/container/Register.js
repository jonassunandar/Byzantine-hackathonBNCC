import React from 'react';
import { connect } from 'react-redux';
import helper from '../utils/helper.js';
import { register } from './../actions/auth';
import { Link, Redirect } from 'react-router-dom';
import { 
    Button,
    FormGroup,
    Input,
    Form
 } from 'reactstrap';
 import './cloud.css';

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
                    key: 'name',
                    label: 'Nama',
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
        this.setState({errMsg: errMsg});
        this.props.register.err= '';
        this.props.register.errEng= '';
        return valid;
    }

    handleOnSubmit = (e) => {
      e.preventDefault();
      if (this.validation()){
            this.props.registerAction({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name
            })
        }
    };

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.register.msg == 'Success'){
            this.setState({
                redirect: '/login',
                password: '',
                passwordConfirmation: ''
            })
        }
    }

    render() {
    const lang = helper.lang(this.props.language)

    if(this.state.redirect)
        return (<Redirect to={{pathname: this.state.redirect, redirectMsg: lang('Registrasi Berhasil!', 'Registration Successful!')}}></Redirect>)    

      return (
        <div>
            <div id="clouds">
                <div class="cloud x1" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div class="cloud x2" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div class="cloud x3" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div class="cloud x4" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div class="cloud x5" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div class="cloud x3" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div class="cloud x2" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div class="cloud x1" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
            </div>

            <div className='centerDiv card card-signup card-no-border'>
                <Form onSubmit={this.handleOnSubmit}>
                    <h4 className='mb-4 mt-3'>{lang('Daftar Sebagai User Baru', 'Sign up as New User')}</h4>
                    <FormGroup>
                        <Input className='input' name='name' type='text' placeholder={lang('Nama', 'Name')} value={this.state.name} onChange={this.changeHandler}/>
                        { this.state.errMsg['name'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['name']}
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

                    { this.props.register.err ? (
                        <h6 className='errValidation mb-3'>
                            {this.props.language == 'indo' ? this.props.register.err: this.props.register.errEng}
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
                    { this.props.register.loading ? (
                        <div class="spinner-border text-success" role="status">
                            <span class="sr-only">Loading...</span>
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