import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import helper from '../../utils/helper.js';
import './dashboard.css';
import Table from '../../component/Table';
import Modal from '../../component/DetailModal';
import { FaPlus, FaAngleLeft, FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleRight, FaSearch } from 'react-icons/fa';

import {
    Card,
    CardImg,
    CardImgOverlay,
    CardTitle,
    CardText,
    Button,
    Spinner,
    InputGroup,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem 
 } from 'reactstrap';

class Event extends React.Component {
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
        this.setState({modalOpen: false, modalDeleteOpen: false})
    }

    render() {
        if(this.state.redirect)
            return (<Redirect to={{pathname: this.state.redirect, detail: this.props.event.details}}></Redirect>)
        
        const lang = helper.lang(this.props.language)
        return (
        <div className=''>
               <div className='banner'>
               <Card inverse>
                    <CardImg className='img-fluid imgBg' width="100%" maxHeight='80vh' src="/bg.png" alt="Card image cap" />
                    <CardImgOverlay>
                    {/* <CardTitle>Card Title</CardTitle> */}
                    <CardText className='text-center text-black h2 vertical-align-middle m-auto bannerTitle'>
                        Byzantine
                    </CardText>
                    <CardText className='text-center text-black h2 vertical-align-middle m-auto bannerText'>
                        Belanja Aman bersama Blockchain!
                    </CardText>
                    <CardText>
                       
                    </CardText>
                    </CardImgOverlay>
                </Card>
               </div>

               <div className='info my-4'>
                   <div className='row align-items-center'>
                       <div className='col-md-8 text-center'>
                           <img className='img-fluid' src='/info.png' />
                       </div>
                       <div className='col-md-4'>
                           <div className='cardInfo p-3'>
                               <div className='cardText p-3'>
                               Dengan menggunakan blockchain, kamu dapat memiliki kendali penuh atas data pribadimu. Tidak ada yang bisa mengubah, dan bahkan melihat data penting kamu jika kamu tidak memberi otoritas orang tersebut. Jadi kamu pun pasti aman dari serangan hacker!
                               </div>
                               <div className='cardFooter my-3'>
                                   <Button block className='button-primary'>See More</Button>
                               </div>
                           </div>
                       </div>
                   </div>
               </div>

               <div className='advantages my-5'>
                   <div className='row no-gutters'>
                       <div className='col-3 adv text-center py-3'>
                           <img className='img-fluid' src='/logo192.png'></img>
                           <div className='advInfo'>Lorem Ipsum</div>
                       </div>
                       <div className='col-3 adv2 text-center py-3'>
                           <img className='img-fluid' src='/logo192.png'></img>
                           <div className='advInfo'>Lorem Ipsum</div>
                       </div>
                       <div className='col-3 adv3 text-center py-3'>
                           <img className='img-fluid' src='/logo192.png'></img>
                           <div className='advInfo'>Lorem Ipsum</div>
                       </div>
                       <div className='col-3 adv4 text-center py-3'>
                           <img className='img-fluid' src='/logo192.png'></img>
                           <div className='advInfo'>Lorem Ipsum</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Event);