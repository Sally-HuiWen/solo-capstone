import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { thunkGetCurrentKids } from '../../redux/kids';
import './CurrentUserKids.css';

const CurrentUserKids = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const kids = useSelector(state => state.kids.currentUserKids || []);

    useEffect(() => {
        dispatch(thunkGetCurrentKids());
    }, [dispatch]);

    const handleAddNewKid = () => {
        navigate('/kids/new')
    };

    return (
        <div id='kids-list-container'>
            <h1>Your Kids</h1>
            <div >
                <button onClick={handleAddNewKid}>
                    Add my new kid
                </button>
            </div>
            <div className='your-kids-content'>
                {kids.length === 0 ? (
                    <p>No kids found. Please add your kid by click the button</p>
                ):(
                    <ul>
                        {kids.map((kid, index)=> (
                            <li key={kid?.id || index} className='kid-details'>
                                <h2>{kid?.name}</h2>
                                <h2>{kid?.birthday}</h2>
                            </li>
                        ))}
                    </ul>
                )}

            </div>

        </div>

    )


}

export default CurrentUserKids