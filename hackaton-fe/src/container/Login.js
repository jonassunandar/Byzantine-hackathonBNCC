import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { login } from './../actions/auth';
import ReCAPTCHA from "react-google-recaptcha";
import helper from '../utils/helper.js';
import { 
    Button,
    FormGroup,
    Input,
    Form
 } from 'reactstrap';
import './cloud.css';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            redirect: '',

            //validation
            validationOption: [
                {
                    key: 'email',
                    label: 'Email',
                    isRequired: true,
                    validEmail: true
                },
                {
                    key: 'password',
                    label: 'Password',
                    isRequired: true
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
            if (err) {
                errMsg[option.key] = err;
                valid = false;
            }
        }
        this.setState({errMsg: errMsg});
        this.props.login.err= '';
        this.props.login.errEng= '';
        return valid;
    }

    handleOnSubmit = (e) => {
        e.preventDefault();
        
        if (this.validation()){
            this.props.loginAction({
                email: this.state.email,
                password: this.state.password
            })
        }
    };

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    componentDidMount(){
        if(localStorage.getItem('authed') === 'true')
            this.setState({redirect: '/'})
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.login.msg === 'Success')
            this.setState({redirect: this.props.from ? this.props.from : '/'})
    }

    render() {
        if(this.state.redirect)
            return (<Redirect to={{pathname: this.state.redirect}}></Redirect>)


        const lang = helper.lang(this.props.language)
        return (
        <div>
            <div id="clouds">
                <div className="cloud x1" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div className="cloud x2" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div className="cloud x3" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div className="cloud x4" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div className="cloud x5" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div className="cloud x3" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div className="cloud x2" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
                <div className="cloud x1" style={{left: (Math.random()*60) + 'vw', top : (Math.random()*60) + 'vh'}}></div>
            </div>
            <div className='centerDiv card card-signup card-no-border' >
            
                <Form onSubmit={this.handleOnSubmit}>
                    <h5 className='mb-1 mt-3'>{lang('Selamat Datang di', 'Welcome Back to')}</h5>
                    <h3 className='mb-4'>Byzantine Web</h3>
                    <FormGroup>
                        <Input className='input' name='email' type='text' placeholder='Email' value={this.state.email} onChange={this.changeHandler}/>
                        { this.state.errMsg['email'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['email']}
                            </h6>
                        ) : null}
                    </FormGroup>
                    <FormGroup>
                        <Input className='input' name='password' type='password' placeholder={lang('Kata Sandi', 'Password')} value={this.state.password} onChange={this.changeHandler}/>
                        { this.state.errMsg['password'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['password']}
                            </h6>
                        ) : null}
                    </FormGroup>
                    { this.props.login.err ? (
                        <h6 className='errValidation mb-3'>
                            {this.props.language == 'indo' ? this.props.login.err: this.props.login.errEng}
                        </h6>
                    ) : null}
                    
                    <ReCAPTCHA
                        sitekey="6LcWB9YZAAAAAC3t36OVFZG00BcYyMGugjWoFpY8"
                        onChange={(value) => { console.log("Captcha value:", value); this.setState({captcha: true}) } }
                    />

                    <FormGroup className='mt-3'>
                        <Link to={{pathname: '/dashboard'}}>
                            <Button className='w-100 button-primary' 
                            // type='submit'
                            >{lang('Masuk', 'Log In')}</Button>
                        </Link>
                    </FormGroup>
                    <FormGroup>
                        <Link to={{pathname: '/register'}}>
                            <Button className='w-100 button-primary' type='submit'>
                                {lang('Daftar', 'Sign up')}
                            </Button>
                        </Link>
                    </FormGroup>
                    { this.props.login.loading ? (
                        <div className="spinner-border text-success" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    ): null }
                    { this.props.location.redirectMsg ? (
                        <h6 className='successMsg my-5'>
                            {this.props.location.redirectMsg}
                        </h6>
                    ) : null}
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
    loginAction: (data) => dispatch(login(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);