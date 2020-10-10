import React from 'react';
import DataTable from 'react-data-table-component';
import Table from './Table';
import { 
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
 } from 'reactstrap';

const DetailModal = (props) => {
  function lang(indo= '', eng= ''){
    if (props.lang !=='indo') return eng
    return indo
  }

    return (
    <>
      {/* Detail Modal */}
      <Modal isOpen={props.isOpen} toggle={props.toggle} className={props.className}>
        <ModalHeader>
          <div className='h3 mt-1 mb-0'>{props.title}</div>
          <div className=''>{props.subTitle}</div>
        </ModalHeader>
        <ModalBody>
            {props.children}
        </ModalBody>
        <ModalFooter>
          <Button onClick={props.onEdit} hidden={props.editable.toString() === '1' ? false: true} color='info'>Edit</Button>
          <Button onClick={props.toggleDelete} hidden={props.editable.toString() === '1' ? false: true} color='danger'>Delete</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={props.deleteisOpen} toggle={(props.toggleDelete)} className={props.deleteClassName}>
        {/* <ModalHeader></ModalHeader> */}
        <ModalBody>
          <div className='text-center'>
              <div>
                <img src='/deleteIcon.png' className='deleteIcon' />
              </div>
              <h4 className='mt-2'>
                {props.lang === 'indo' ? 'Apakah anda yakin?' : 'Are you sure?'}
              </h4>
              { props.deleteReasonChange ? (
                <>
                  {lang('Tulis alasan: ', 'Reason: ')}
                  {/* <FormGroup> */}
                    <Input type='textarea' placeholder={lang('Alasan', 'Reasone')} value={props.deleteReason} onChange={props.deleteReasonChange}/>
                            
                  {/* </FormGroup> */}
                </>
              ) : null}
          </div>
        </ModalBody>
        <ModalFooter>
            <Button onClick={props.onDelete} color='danger'>{props.lang === 'indo' ? 'Ya' : 'Yes'}</Button>
            <Button onClick={props.toggleDelete}> {props.lang === 'indo' ? 'Batal' : 'Cancel'}</Button>
        </ModalFooter>
      </Modal>
    </>
    )
}

export default DetailModal;