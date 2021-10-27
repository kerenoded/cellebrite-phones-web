import { API_URL } from './../constants/index';
import { PhoneEntities, PhoneEntity } from '../models/Phone';
import Axios from "axios";

const phonesUrl = API_URL + 'v1/phones';

export const updatePhone = async( obj: PhoneEntity ) => {
  try {
    let res = await Axios.patch(`${phonesUrl}/${obj._id}`, obj)
    return res.data
  } catch (error: any) {
    console.error('updatePhone', error.response?.data)
    return error.response?.data
  }
}
export const createNewPhone = async( obj: PhoneEntity ) => {
  try {
    let res = await Axios.post(`${phonesUrl}/`, obj)
    return res.data
  } catch (error: any) {
    console.error('createNewPhone', error.response?.data)
    return error.response?.data
  }
}
export const deletePhone = async( id: string ) => {
  try {
    let res = await Axios.delete(`${phonesUrl}/${id}`)
    if(res.status===204) return true
  } catch (err: any) {
    console.error('deletePhone', err)
  }
  return false
}
export const getPhonesCollection = ( obj: any = {} ): Promise<PhoneEntities> => {
  const promise = new Promise<PhoneEntities>((resolve, reject) => {
    try {
        const params = new URLSearchParams();
        Object.keys(obj).forEach(key => {
            params.append(key, obj[key]);
        })
        
        Axios.get<PhoneEntities>(phonesUrl, {params: params}).then(response =>
            resolve(response.data)
        );
    } catch (ex) {
      reject(ex);
    }
  });

  return promise;
};
