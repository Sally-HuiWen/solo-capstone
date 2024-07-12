import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkUpdateKid} from '../../redux/kids';
import './UpdateKidForm.css';

const UpdateKidForm = ()=> {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { kidId } = useParams();
    const kid = useSelector(state => state.kids.kidDetails)
    
    const [name, setName] = useState(kid.name);
    const [year, setYear] = useState(kid.birth_date.split('-')[0]);
    const [month, setMonth] = useState(kid.birth_date.split('-')[1]);
    const [day, setDay] = useState(kid.birth_date.split('-')[2]);
    const [relationship, setRelationship] = useState(kid.relationship);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const relationships = [
        'Mom',
        'Dad',
        'Grandpa',
        'Grandma',
        'Other'
    ];
    





}

export default UpdateKidForm;