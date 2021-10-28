import React, { Fragment } from 'react'
import styled from 'styled-components'
import PhoneTableComponent from '../../components/phones/phoneTable/PhoneTable'
import Title from '../../components/Title'
import { PhoneEntities, PhoneEntity } from "../../models/Phone";
import { getPhonesCollection } from "../../api/phoneApi";
import { getColorsCollection } from "../../api/colorsApi";
import debounce from 'lodash.debounce';
import { SearchCriteria } from '../../models/SearchCriteria';
import { GrAdd } from 'react-icons/gr';
import { PhoneModal } from '../../components/phones/phoneModal/PhoneModal'
import './PhonesPage.scss';
import { PhonesContext } from "../../context/phoneContext";

const PhonesPage  = () => {

    const [phoneCollection, setPhoneCollection] = React.useState<PhoneEntities>(new PhoneEntities([], 0));
    const [colors, setColors] = React.useState([]);
    const [searchCriterias, setSearchCriterias] = React.useState<SearchCriteria>( {'limit' : 25} );
    const [isOpen, setIsOpen] = React.useState(false);
    const [phoneToEdit, setPhoneToEdit] = React.useState<PhoneEntity>();

    console.log('PhonesPage')

    React.useEffect(() => {
        loadColors();
    }, []);

    React.useEffect(() => {
        loadPhoneCollection(searchCriterias);
    }, [searchCriterias]);

    const actionMade =  (action: string, value: any) => {
        if(action==='selectColor'){
            if(value===''){
                delete searchCriterias.filterByColor
                setSearchCriterias ({...searchCriterias})
            }else{
                setSearchCriterias ({...searchCriterias, filterByColor: value})
            }
            
        } else if(action==='phoneDeleted'){
            setPhoneCollection(new PhoneEntities(phoneCollection.arr.filter(phone => phone._id !== value), phoneCollection.total - 1))
        } else if(action==='openModal'){
            setPhoneToEdit(value)
            setIsOpen(true);
        }
        
    };

    const fetchMorePhones = async() =>{
        const phoneRes: PhoneEntities = await getPhonesCollection({...searchCriterias, fromId: phoneCollection.arr[phoneCollection.arr.length - 1]._id});
        setPhoneCollection(new PhoneEntities(phoneCollection.arr.concat(phoneRes.arr), phoneRes.total))
    }

    function toggleModal() {
        if(isOpen) setPhoneToEdit(undefined)
        setIsOpen(!isOpen);
    }

    const loadPhoneCollection = async (searchCriterias: SearchCriteria) => {
        const phoneRes: PhoneEntities = await getPhonesCollection(searchCriterias);
        setPhoneCollection(new PhoneEntities(phoneRes.arr, phoneRes.total))
    };
    const loadColors = async () => {
        const colors: any = await getColorsCollection();
        setColors(colors);
    };
   
    const debouncedFetchData = debounce(searchText => {
        setSearchCriterias ({...searchCriterias, searchText: searchText})
    }, 1000);

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        debouncedFetchData(event.target.value)
    };

    const onSaveOrUpdateSuccess = (action: string, res: PhoneEntity) =>{
        toggleModal()
        if(action==='save'){
            setPhoneCollection(new PhoneEntities([res, ...phoneCollection.arr], phoneCollection.total + 1))
        } else if(action==='update'){
            setPhoneCollection(new PhoneEntities(phoneCollection.arr.map(phone => phone._id === res._id ? res : phone ), phoneCollection.total))
        }
    }

    return (
        <Fragment>
             <PhonesContext.Provider value={{ phoneCollection, colors, actionMade }}>
                { isOpen ? <PhoneModal toggleModal={toggleModal} phoneToEdit={phoneToEdit as PhoneEntity} onSaveOrUpdateSuccess={onSaveOrUpdateSuccess}/> : null }
                <Title>Cellebrite Phones List</Title>
                <div className="addPhoneText" onClick={toggleModal}>Add Phone</div>
                <GrAdd className="actionIcon" onClick={toggleModal}></GrAdd>
                <div><input className="searchInput" type="text" onChange={(event) => handleSearch(event)} placeholder="Search by type, serial or metaData"/></div>
                <div className="totalAmount">Total amount of phones for this search: {phoneCollection.total.toLocaleString()}, showing {phoneCollection.arr.length.toLocaleString()}</div>
                { colors.length > 0 ? <PhoneTableComponent fetchMorePhones={fetchMorePhones} /> : null }
            </PhonesContext.Provider>
        </Fragment>
    )
};

export default styled(PhonesPage)`

`
