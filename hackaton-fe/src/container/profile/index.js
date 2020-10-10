import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import helper from '../../utils/helper.js';
import './profile.css';

import { FaPlus, FaAngleLeft, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleRight, FaSearch } from 'react-icons/fa';

import {
    Button,
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
            perPage: 10,
            page: 1,
            keyword: '',
            modalOpen: false,
            dropdownOpen: false,
            deleteReason: '',
            columns: [
                {
                    name: 'No.',
                    maxWidth: '100px',
                    cell: (row, i) => (<div>{(this.state.perPage*(this.state.page-1)+i+1)}</div>)
                },
                {
                    name: lang('Nama Event', 'Event Name'),
                    selector: 'name'
                },
                {
                    name: lang('Pengantin Pria', 'Groom'),
                    selector: 'spouse_name'
                },
                {
                    name: lang('Pengantin Wanita', 'Bride'),
                    selector: 'bride_name'
                },
                {
                    name: lang('Waktu', 'Date'),
                    grow:2,
                    selector: 'event_time'
                },
            ],
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

    changePerPage = (data) => {
        this.setState({perPage: data}, () =>
            this.changePage(this.state.page)
        )
    }

    toggleDropdown = ()=> {
        this.setState({dropdownOpen: !this.state.dropdownOpen}); 
    }

    showDataDetails = (data) => {
        this.setState({modalOpen: true, editable: data.editable})
    
    }

    paginationClicked = type => {
        if(type === 'first')
            this.changePage(1)
        else if (type === 'prev')
            this.changePage(parseInt(this.state.page) - 1)
        else if (type === 'next')
            this.changePage(parseInt(this.state.page) + 1)
        else if (type === 'last')
            this.changePage(this.props.event.lastPage)
    }

    redirectEdit = () => {
        this.setState({redirect: '/admin/event/edit'})
    }

    deleteData = () => {
        this.props.deleteEvent(this.props.event.details.id, this.state.deleteReason);
        this.setState({modalOpen: false, modalDeleteOpen: false})
    }

    render() {
        
        return (
        <div className='mt-3'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-sm-4'>
                            <div className='card'>
                                <div className='profile'>
                                    <div className='acount-dp'>
                                        <div className='dp m-auto'><div style={{verticalAlign: 'middle', lineHeight: '6em'}} onClick={() => window.location= '/profile'}>{this.props.profile.user.initial}</div></div>
                                    </div>
                                    <h5 className='mt-3'>{this.props.profile.user.name}</h5>
                                    <span class="icon">Verified</span><img src="/verified.svg" alt=""/>
                                </div>
                            </div>
                        </div>
                        {/* <div className='col'></div> */}
                        <div className='col-sm-8'>
                            <div className='card'>
                                <div className='profile'>
                                    <h3 className='mb-2'>Detail Akun</h3>
                                    
                                    <div className='row'>
                                        <div className='col-md-6'>Nama Depan: </div>
                                    </div>
                                </div>
                            </div>
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