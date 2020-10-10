import React from 'react';
import { connect } from 'react-redux';
import { logout } from './../actions/auth';
import { Redirect } from 'react-router-dom';
import helper from '../utils/helper.js';

import './sidebar.css';

import { 
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
 } from 'reactstrap';

class NavbarClass extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            redirect: '',
            sidebarStyle: window.matchMedia('(min-width: 768px)').matches ? 'menu active' : 'menu',
            route: [{url: 'aa', name: 'aa'}],
            dropdownNavbarOpen: false,
        }
    }

    getAccessRIght = () => {
        const res = JSON.parse(localStorage.getItem('accessRight'));
        if (res && typeof res == 'object' && res.length > 0)
            return res
        return []
    }

    getProfile = () => {
        // const res = JSON.parse(localStorage.getItem('profile'));
        // if (res && typeof res == 'object')
        //     return res
        return {user:{}, name: 'Jonas Sunandar', initial: 'JS'}
    }

    logout = () => {
        this.props.logout();
        window.location = '/login'
    }

    toggleNavbar = () => {
        this.setState({sidebarStyle: this.state.sidebarStyle === 'menu' ? 'menu active': 'menu'})
    }
    toggleDropdown = () => {
        this.setState({dropdownNavbarOpen: !this.state.dropdownNavbarOpen})
    }

    render() {
        if(this.state.redirect)
            return (<Redirect to={{pathname: this.state.redirect}}></Redirect>)

        const accessList = this.getAccessRIght();
        const profile = this.getProfile();
        const lang = helper.lang(this.props.language)
        
        return (
            <>

                {/* for SideBar fixed side */}
                {/* <div className={'align-items-center ' + this.state.sidebarStyle}>
                    <div className='p-3 text-center'>
                        <h1 style={{fontWeight: '750'}}>Majestic</h1>
                    </div>
                    <Nav vertical className=''>
                        {routeList.map((item, i) => {
                            if (accessList.indexOf(item.accessLabel) < 0) return null
                            const Icon = icon[item.icon];
                            return (
                                <NavItem key={i} className='my-3'>
                                    <NavLink to={item.url} className='nav-link px-4'>
                                        <Icon className='mx-2 icon'/> {lang(item.label, item.labelEng)}
                                    </NavLink>
                                </NavItem>
                            )
                        })}
                    </Nav>
                </div> */}

                {/* for Header fixed top */}
                <div className='mainNavbar'>
                    <Navbar className="navbar-expand-lg navbar-light bg-light fixed-top-navbar">
                    <div className='container'>
                        {/* <NavbarToggler onClick={this.toggleNavbar}/> */}
                        <Nav navbar className='ml-3'>
                            <NavItem>
                                <h1 className='pageTitle' onClick={()=>window.location = '/dashboard'}>{'BYZANTINE'}</h1>
                            </NavItem>
                        </Nav>
                        <Nav navbar className='mx-auto'></Nav>
                        <Nav navbar className='align-items-center'>
                            <Dropdown  isOpen={this.state.dropdownNavbarOpen} toggle={this.toggleDropdown} className=''>
                                <DropdownToggle caret>
                                    {'Hello, ' + profile.name || ''}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <div className='account-info'>
                                        <div className='account-dp'>
                                            <div className='dp m-auto'><div style={{verticalAlign: 'middle', lineHeight: '4em'}} onClick={() => window.location= '/profile'}>{profile.initial}</div></div>
                                        </div>
                                        <h5 className='acount-name text-center mt-3'>{profile.name}</h5>
                                    </div>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={() => window.location= '/profile'}>
                                        Profile
                                    </DropdownItem>
                                    <DropdownItem onClick={() => window.location= '/'}>
                                        Logout
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown >
                        </Nav>
                    </div>
                    </Navbar>
                    
                    {/* <div className='container mt-3'> */}
                        {this.props.children}
                    {/* </div> */}
                </div>
            </>
      )
    }
  }

const mapStateToProps = state => ({
    ...state
})
const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(NavbarClass);