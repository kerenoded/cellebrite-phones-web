import React from 'react'
import Modal from "react-modal";
import { PhoneEntity } from '../../../models/Phone';
import { createNewPhone, updatePhone } from "../../../api/phoneApi";
import './PhoneModal.scss'
import * as Utils from '../../../utils'
import { PhonesContext } from '../../../context/phoneContext';

Modal.setAppElement("#root");

export const PhoneModal = ({ toggleModal, phoneToEdit, onSaveOrUpdateSuccess }: { toggleModal: any, phoneToEdit: PhoneEntity, onSaveOrUpdateSuccess: CallableFunction }) => {
    
    const { colors } = React.useContext(PhonesContext);
    const [type, setType] = React.useState('');
    const [serial, setSerial] = React.useState('');
    const [metaData, setMetaData] = React.useState('');
    const [color, setColor] = React.useState(phoneToEdit?.color ? phoneToEdit.color : 'Default');
    const [validationErrors, setValidationErrors]: any = React.useState({});

    const checkValidations = () => {
        let validationErr: any = {}
        if(type===''){
            validationErr.type = "Type is required"
        }
        if(serial===''){
            validationErr.serial = "Serial is required"
        }
        if(!Utils.IsJsonString(metaData)){
            validationErr.metaData = 'MetaData should be a valid json object'
        }
        return validationErr
    }

    const create = async () =>{
        let preValidationErrors = checkValidations()
        if(Object.keys(preValidationErrors).length > 0){
            setValidationErrors(preValidationErrors)
            return
        }
        
        let metaDataHashed = await Utils.hash(metaData)
        let phone: PhoneEntity = {type: type, serial: serial, metaData: metaDataHashed}
        if(color !== 'Default') phone.color = color
        let res = await createNewPhone(phone)
        if(res._id){
            onSaveOrUpdateSuccess('save', res)
        } else if(res.errors){
            let errors = res.errors.reduce((acc: any, current: any) => {
                acc[current.param] = current.msg
                return acc
            }, {})
            setValidationErrors(errors)
        } else {
            setValidationErrors({generalError : 'Unknown error please try again later or contact support'})
        }
    }

    const getPEforPatch = async ()  => {
        let objForPatch: any = {}
       
        if(type!=='' && type!==phoneToEdit.type){
            objForPatch.type = type
        }
        if(serial!=='' && serial!==phoneToEdit.serial){
            objForPatch.serial = serial
        }
        if(metaData!=='' && metaData!==phoneToEdit.metaData){
            let metaDataHashed = await Utils.hash(metaData)
            objForPatch.metaData = metaDataHashed
        }
        if(color!=='Default' && color!==phoneToEdit.color){
            objForPatch.color = color
        }
        return objForPatch as PhoneEntity
    }

    const update = async () =>{
        if(metaData!==''){
            if(!Utils.IsJsonString(metaData)){
                setValidationErrors({metaData : 'MetaData should be a valid json object'})
                return
            }
        }
        let objForPatch: PhoneEntity = await getPEforPatch()
        if(Object.keys(objForPatch).length === 0){
            setValidationErrors({generalError : 'Please change any of the fields in order to update'})
            return 
        }
        objForPatch._id = phoneToEdit._id
        
        let res = await updatePhone(objForPatch)
        if(res._id){
            onSaveOrUpdateSuccess('update', res)
        } else if(res.errors){
            let errors = res.errors.reduce((acc: any, current: any) => {
                acc[current.param] = current.msg
                return acc
            }, {})
            setValidationErrors(errors)
        } else {
            setValidationErrors({generalError : 'Unknown error please try again later or contact support'})
        }
        
    }

    console.log('PhoneModal', phoneToEdit)
    return (
        <Modal className="PhoneModal" overlayClassName="PhoneOverlay"
            isOpen={true} onRequestClose={toggleModal} contentLabel="My dialog">
            <h3>{phoneToEdit ? 'Edit Phone' : 'Add Phone'}</h3>
            <div className="inputRow">
                <span className={ phoneToEdit ? '' : 'required'}>Type:</span>
                <input type="text" value={type}  onChange={(e) => setType(e.target.value)} placeholder={phoneToEdit ? phoneToEdit.type : "Type of phone"}/>
                { validationErrors.type ? <span className="validationError">{ validationErrors.type }</span> : null }
            </div>
            <div className="inputRow">
                <span className={ phoneToEdit ? '' : 'required'}>Serial</span>
                <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} placeholder={phoneToEdit ? phoneToEdit.serial : "Serial number of the phone"} />
                { validationErrors.serial ? <span className="validationError">{ validationErrors.serial }</span> : null }
            </div>
            <div className="inputRow">
                <span className={ phoneToEdit ? '' : 'required'}>MetaData</span>
                <textarea value={metaData} onChange={(e) => setMetaData(e.target.value)} placeholder={phoneToEdit ? phoneToEdit.metaData : 'MetaData json'}/>
                { validationErrors.metaData ? <span className="validationError">{ validationErrors.metaData }</span> : null }
            </div>
            <div className="inputRow">
                <span>Color</span>
                <select
                  defaultValue={color}
                  onChange={(e) => setColor(e.target.value)}
                >
                  <option value='Default' disabled >
                    Select a color
                  </option>
                  {colors.map((colorT: string) => (
                    <option key={colorT} value={colorT}>{colorT}</option>
                  ))}
                </select>
                { validationErrors.color ? <span className="validationError">{ validationErrors.color }</span> : null }
            </div>
            <button onClick={toggleModal}>Cancel</button>
            <button onClick={(e) => { phoneToEdit ? update() : create() }}>{phoneToEdit ? 'Update' : 'Create'}</button>
            { validationErrors.generalError ? <span className="validationError">{ validationErrors.generalError }</span> : null }
        </Modal>
    )
}

