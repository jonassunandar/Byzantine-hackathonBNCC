import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

import NotifModal from '../../component/NotifModal';

import helper from '../../utils/helper.js';
import { 
    Button,
    FormGroup,
    Input,
    FormFeedback,
    Form,
    Breadcrumb,
    BreadcrumbItem
 } from 'reactstrap';

class ProfileEdit extends React.Component {
    constructor(props) {
        super(props);
        const lang = helper.lang(this.props.language);
        this.state = {
            actionPage: 'add',
            userAccess: [],

            name: '',
            date: new Date(),
            location: '',
            type: {value:false, label:''},
            bride: {value:'', label:''},
            groom: {value:'', label:''},
            description: '',

            //validation
            validationOption: [
                {
                    key: 'name',
                    label: 'Name',
                    isRequired: true,
                },
                {
                    key: 'location',
                    label: 'Location',
                    isRequired: true,
                },
                {
                    key: 'groom',
                    label: 'Groom',
                    isObject: true,
                    requiredKey: 'label',
                },
                {
                    key: 'bride',
                    label: 'Bride',
                    isObject: true,
                    requiredKey: 'label',
                },
                {
                    key: 'type',
                    label: 'Event Type',
                    isObject: true,
                    requiredKey: 'value',
                },
            ],
            errMsg: {}
        };
        this.props.getClientUser()
        this.props.getEventType()
    }

    validation = () => {
        let valid= true;
        let err;
        let errMsg = {};

        for(let option of this.state.validationOption){
            err = helper.validate(this.state[option.key], option, this.props.language)
            if (err) {
                err = option.customMsg ? option.customMsg : err
                errMsg[option.key] = err;
                valid = false;
            }
        }
        this.setState({errMsg: errMsg});
        this.props.event.err= '';
        return valid;
    }

    submitForm = (e) => {
        e.preventDefault();
        
        if (this.validation()){
            let data = {
                name: this.state.name,
                spouse_name: this.state.groom.label,
                groom_user_id: this.state.groom.value,
                bride_name: this.state.bride.label,
                bride_user_id: this.state.bride.value,
                location: this.state.location,
                event_time: helper.showDateTime(this.state.date),
                event_type_id: this.state.type.value
            }
            
            if(this.state.actionPage === 'add')
                this.props.insertEvent(data)
            else{
                data.event_id= this.state.id;
                this.props.editEvent(data)
            }
            this.setState({notifModalOpen: true})
        }
    };

    changeHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    selectChangeHandler = (key, e) => {
        if (e.__isNew__) e.value= false
        this.setState({
            [key]: e
        })
    }

    componentDidMount(){
        
    }

    componentWillReceiveProps(nextProps){
        if (this.props.event.typeList.length > 0 && !this.state.type.value) this.setState({type: this.props.event.typeList[0]})
        
        if (nextProps.location.detail && this.state.actionPage==='add'){
            const item = nextProps.location.detail
            
            this.setState({
                actionPage: 'update',
                id: item.id,
                name: item.name,
                date: new Date(),
                location: item.location,
                type: {value: item.event_type_id},
                bride: {value:item.bride_user_id || false, label: item.bride_name},
                groom: {value:item.spouse_user_id || false, label: item.spouse_name},
                description: '',
            })
        }
        console.log(this.props.event.typeList, '--', this.state.type)
        if(this.props.event.typeList.length > 0 && this.state.type.value) this.setState({type: this.props.event.typeList.find(list => list.value === this.state.type.value)})
        
        // else{
        //     this.setState({actionPage: 'add'})
        // }
    }

    render() {
        if(this.state.redirect)
            return (<Redirect to={{pathname: this.state.redirect}}></Redirect>)


        const lang = helper.lang(this.props.language)
        return (
        <>
            <NotifModal
                language={this.props.language}
                isOpen={this.state.notifModalOpen}
                type={this.props.event.insertUpdate.type}
                msg={this.props.language === 'indo' ? this.props.event.insertUpdate.msg : this.props.event.insertUpdate.msgEng}
                redirect={'/admin/event'}
                loading={this.props.event.insertUpdate.loading}
                toggle={()=>this.setState({notifModalOpen: !this.state.notifModalOpen})}
            />

            <Breadcrumb tag="nav">
                <BreadcrumbItem tag="a" onClick={()=> this.setState({redirect: '/admin/event'})}>Event</BreadcrumbItem>
                <BreadcrumbItem active tag="span">{this.state.actionPage === 'add' ? lang('Form Tambah', 'Add') : lang('Form Ubah', 'Edit')}</BreadcrumbItem>
            </Breadcrumb>
            <div className='container mt-3'>
                <div className=''>
                    <h3>{this.state.actionPage === 'add' ? lang('Event Baru', 'New Event') : 'Event '+ this.state.name}</h3>
                    <Form>
                        <FormGroup>
                            {lang('Nama: ', 'Name: ')}
                            <Input invalid={this.state.errMsg['name'] ? true: false} className='input' name='name' type='text' placeholder={lang('Nama', 'Name')} value={this.state.name} onChange={this.changeHandler}/>
                            { this.state.errMsg['name'] ? (<FormFeedback>{this.state.errMsg['name']} </FormFeedback> ) : null}
                        </FormGroup>
                        <FormGroup>
                            {lang('Tipe Event: ', 'Event Type: ')}
                            <Select options={this.props.event.typeList} className={this.state.errMsg['type'] ? 'input is-invalid': 'input'} name='type' type='text' value={this.state.type} onChange={e => this.selectChangeHandler('type', e)}/>
                            { this.state.errMsg['type'] ? (<FormFeedback>{this.state.errMsg['type']} </FormFeedback> ) : null}
                        </FormGroup>
                        <FormGroup>
                            <div className='row'>
                                <div className='col-md-6'>
                                    {lang('Pengantin Pria: ', 'Groom: ')}
                                    <CreatableSelect options={this.props.event.userList} className={this.state.errMsg['groom'] ? 'input is-invalid': 'input'} name='groom' type='text' value={this.state.groom} onChange={e => this.selectChangeHandler('groom', e)}/>
                                    { this.state.errMsg['groom'] ? (<FormFeedback>{this.state.errMsg['groom']} </FormFeedback> ) : null}
                                </div>
                                <div className='col-md-6'>
                                    {lang('Pengantin Wanita: ', 'Bride: ')}
                                    <CreatableSelect options={this.props.event.userList} className={this.state.errMsg['bride'] ? 'input is-invalid': 'input'} name='bride' type='text' value={this.state.bride} onChange={e => this.selectChangeHandler('bride', e)}/>
                                    { this.state.errMsg['bride'] ? (<FormFeedback>{this.state.errMsg['bride']} </FormFeedback> ) : null}
                                </div>
                            </div>
                        </FormGroup>
                        <FormGroup>
                            {lang('Lokasi: ', 'Location: ')}
                            <Input invalid={this.state.errMsg['location'] ? true: false} className='input' name='location' type='text' placeholder={lang('Lokasi ', 'Location ')} value={this.state.location} onChange={this.changeHandler}/>
                            { this.state.errMsg['location'] ? (<FormFeedback>{this.state.errMsg['location']} </FormFeedback> ) : null}
                        </FormGroup>

                        {/* <FormGroup>
                            {lang('Deskripsi: ', 'Description: ')}
                            <Input invalid={this.state.errMsg['description'] ? true: false} className='input' name='description' type='textarea' placeholder={lang('Deskripsi', 'Description')} value={this.state.description} onChange={this.changeHandler}/>
                            { this.state.errMsg['description'] ? (<FormFeedback>{this.state.errMsg['description']} </FormFeedback> ) : null}
                        </FormGroup> */}
                        
                        
                        { this.state.errMsg['userAccess'] ? (
                            <h6 className='errValidation'>
                                {this.state.errMsg['userAccess']}
                            </h6>
                        ) : null}

                        {/* Error Network */}
                        { this.props.event.err ? (
                            <h6 className='errValidation mb-3'>
                                {this.props.language == 'indo' ? this.props.login.err: this.props.login.errEng}
                            </h6>
                        ) : null}

                        {/* Submit Button */}
                        <FormGroup className='mt-3'>
                            <div className='w-75 mx-auto'>
                            <Button onClick={this.submitForm} color='primary' className='w-100' type='submit'> {this.state.actionPage === 'add' ? lang('Tambahkan', 'Add') : lang('Ubah', 'Edit')}</Button>
                            </div>
                        </FormGroup>
                    </Form>
                </div>
            </div>
        </>
      )
    }
  }

const mapStateToProps = state => ({
    ...state
})
const mapDispatchToProps = dispatch => ({
    // getClientUser: () => dispatch(getClientUser()),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEdit);