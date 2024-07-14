import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentKids } from '../../redux/kids';
import './CurrentUserKids.css';
import OpenModalButton from '../OpenModalButton';
import RemoveKidModal from './RemoveKidModal'
import calculateKidAge from '../utility';

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
                                   <Link to={`/kids/${kid?.id}/dailyLogs`} className='Link-link'>
                                        <h2>{kid?.name}</h2>
                                        <p>{calculateKidAge(kid?.birth_date)}</p>
                                    </Link>
                                    <div id='update-and-remove-box'>
                                        <Link to={`/kids/${kid?.id}/update`} className='Link-link'>
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