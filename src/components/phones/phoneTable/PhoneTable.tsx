import React, {useRef, useEffect} from "react";
import { PhoneEntity } from "../../../models/Phone";
import './PhoneTable.scss';
import { AiOutlineDelete, AiFillEdit, AiOutlineClose } from 'react-icons/ai';
import { deletePhone } from "../../../api/phoneApi";
import InfiniteScroll from 'react-infinite-scroll-component';
import { PhonesContext } from '../../../context/phoneContext'

const PhoneTableComponent = ({  fetchMorePhones }: { fetchMorePhones: any}) => {

  const [filterByColor, setFilterByColor] = React.useState('Default');
  const scrollRef = useRef<HTMLTableSectionElement>(null);
  const { phoneCollection, colors, actionMade } = React.useContext(PhonesContext);

  console.log('PhoneTableComponent')

  const clearFilterColor = () =>{
    setFilterByColor('Default'); 
    actionMade('selectColor', '')
  }

  useEffect(() => {
    if(phoneCollection.arr.length <= 25){
      scrollRef.current?.scrollIntoView({});
    }
  }, [phoneCollection]);
  

  return (
    <React.Fragment >
      <InfiniteScroll 
            dataLength={phoneCollection.arr.length}
            next={fetchMorePhones}
            height={500}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>These are all the phones</b>
              </p>
            }
            hasMore={phoneCollection.arr.length < phoneCollection.total}
            loader={<h4>Loading...</h4>}
          >
      <table>
        <thead ref={scrollRef}>
          <tr>
            <th>Type</th>
            <th>Serial</th>
            <th>Meta data</th>
            <th>
              <div>Color</div>
              <select
                  value={filterByColor}
                  onChange={(e) => actionMade('selectColor', e.target.value)}
                >
                  <option value='Default' disabled >
                    Search by color
                  </option>
                  {colors.map((color: string) => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
                <AiOutlineClose onClick={(e) => { clearFilterColor() }}></AiOutlineClose>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
            {phoneCollection.arr.map((phone) => (
              <PhoneRow key={phone._id} phone={phone}  />
            ))}
        </tbody>
      </table>
      </InfiniteScroll>
    </React.Fragment>
  );
};


const PhoneRow = ({ phone}: { phone: PhoneEntity }) => {

  const { actionMade } = React.useContext(PhonesContext);

  const deleteRow = async(value: string) => {
    var isDeleted = await deletePhone(value)
    if(isDeleted){
      actionMade('phoneDeleted', value)
    }
  };

  console.log('PhoneRow')
  return (
    <tr>
      <td>
        <span>{phone.type}</span>
      </td>
      <td>
        <span>{phone.serial}</span>
      </td>
      <td>
        <span>{phone.metaData}</span>
      </td>
      <td  >
        { phone.color ? <div className="fillColor" style={{ backgroundColor: phone.color }}></div> : 'Empty' }
      </td>
      <td>
        <span><AiOutlineDelete className="actionIcon" onClick={(e) => { deleteRow(phone._id as string)}}></AiOutlineDelete></span>
        <span><AiFillEdit className="actionIcon" onClick={(e) => { actionMade('openModal', phone) }}></AiFillEdit></span>
      </td>
    </tr>
  )
  };

  export default PhoneTableComponent