import React from 'react';
import { 
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Spinner
 } from 'reactstrap';

const NotifModal = (props) => {
  const redirect = () => {
    window.location = props.redirect;
  }
   
    return (
    <>
      {/* Detail Modal */}
      <Modal isOpen={props.isOpen} toggle={props.type === 'Success' ? redirect : props.toggle} className={props.className}>
        <ModalHeader>
        </ModalHeader>
        <ModalBody>
            { props.loading ? (
                  <div className='m-auto p-auto'>
                      <Spinner className='mx-auto spinnerTable' color="success" />
                  </div>
              ) : props.type === 'Success' ? (
                  <div className='text-center'>
                      <div>
                        <img src='/successIcon.png' className='successIcon'/>
                      </div>
                      <h4 className='mt-2'>
                        {props.msg}
                      </h4>
                  </div>
              ) : (
                <div className='text-center'>
                    <div>
                      <img src='/failedIcon.png' className='failedIcon' />
                    </div>
                    <h4 className='mt-2'>
                      {props.msg}
                    </h4>
                </div>
              )
            }
        </ModalBody>
        <ModalFooter>
          
            <Button onClick={props.type === 'Success' ? redirect : props.toggle} color='success'>{props.lang === 'indo' ? 'Kembali' : 'Back'}</Button>
        </ModalFooter>
      </Modal>

      {/* Delete Modal */}
      {/* <Modal isOpen={props.isOpen && props.type === 'Error'} toggle={(props.toggle)} className={props.deleteClassName}>
        <ModalBody>
        </ModalBody>
        <ModalFooter>
            <Button onClick={props.toggle} color='success'>{props.lang === 'indo' ? 'Kembali' : 'Back'}</Button>
        </ModalFooter>
      </Modal> */}
    </>
    )
}

export default NotifModal;