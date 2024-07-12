import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentKids } from '../../redux/kids';
import './CurrentUserKids.css';
import OpenModalButton from '../OpenModalButton';
import RemoveKidModal from './RemoveKidModal'

const CurrentUserKids = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const kids = useSelector(state => state.kids.currentUserKids || []);

    useEffect(() => {
        dispatch(thunkGetCurrentKids());
    }, [dispatch]);

    const handleAddNewKid = () => {
        navigate('/kids/add-new')
    };

    const kidAge = (birth_date) => {
        const birthDate = new Date(birth_date);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age
    };

    return (
        <div id='kids-list-container'>
            <h1>Your Kids</h1>
            <div >
                <button onClick={handleAddNewKid} id='add-kid-button'>
                    Add my new kid
                </button>
            </div>
            <div className='your-kids-content'>
                {kids.length === 0 ? (
                    <p>No kids found. Please add your kid by click the button</p>
                ):(
                    <div id='kids-list-box'>
                        {kids.map((kid, index)=> (
                            <div key={kid?.id || index} className='kid-details'>
                                <h2>{kid?.name}</h2>
                                <h2>age: {kidAge(kid?.birth_date)}</h2>
                                <div id='update-and-remove-box'>
                                    <Link to={`/kids/${kid?.id}/update`}>
                                      <button>Update</button>
                                    </Link>
                                    <OpenModalButton
                                      buttonText='Remove'
                                      modalComponent={<RemoveKidModal kidId={kid?.id} />}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

        </div>

    )


}

export default CurrentUserKids