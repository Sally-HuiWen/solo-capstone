import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkUpdateKid, thunkGetKidDetails } from '../../redux/kids';
import './UpdateKidForm.css';

const UpdateKidForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { kidId } = useParams();
    const kid = useSelector(state => state.kids.kidDetails[kidId]);

    const [name, setName] = useState(kid ? kid.name : '');
    const [year, setYear] = useState(kid ? kid.birth_date?.split('-')[0] : '');
    const [month, setMonth] = useState(kid ? kid.birth_date?.split('-')[1] : '');
    const [day, setDay] = useState(kid ? kid.birth_date?.split('-')[2] : '');
    const [relationship, setRelationship] = useState(kid ? kid.relationship : '');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const relationships = [
        'Mom',
        'Dad',
        'Grandpa',
        'Grandma',
        'Other'
    ];

    useEffect(() => {
        if (kidId) {
            dispatch(thunkGetKidDetails(kidId));
        }
    }, [dispatch, kidId]);

    useEffect(() => {
        if (kid) {
            setName(kid.name);
            const birthDate = new Date(kid.birth_date).toISOString().split('T')[0];
            const [birthYear, birthMonth, birthDay] = birthDate.split('-');
            setYear(birthYear);
            setMonth(birthMonth);
            setDay(birthDay);
            setRelationship(kid.relationship);
        }
    }, [kid]);

    useEffect(() => {
        const errorArr = [];
        if (!name) errorArr.push('Name is required');
        if (name?.length > 50) errorArr.push('Name cannot be more than 50 characters');
        if (!year) errorArr.push('Please choose a year');
        if (!month) errorArr.push('Please choose a month');
        if (!day) errorArr.push('Please choose a day');
        if (!relationship) errorArr.push('Please choose a relationship');
        setErrors(errorArr);
    }, [name, year, month, day, relationship]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);
        if (errors.length > 0) return;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('birth_date', `${year}-${month}-${day}`);
        formData.append('relationship', relationship);
        if (image) formData.append('image', image);

        const updatedKidRes = await dispatch(thunkUpdateKid(kidId, formData));
        if (updatedKidRes.errors) {
            setErrors(updatedKidRes.errors);
        } else {
            navigate('/your-kids-list');
        }
    };

    const handleCancel = () => navigate('/your-kids-list');

    const years = Array.from(new Array(100), (val, i) => new Date().getFullYear() - i);
    const months = Array.from(new Array(12), (val, i) => String(i + 1).padStart(2, '0'));
    const days = Array.from(new Array(31), (val, i) => String(i + 1).padStart(2, '0'));

    return (
        <form onSubmit={handleSubmit} className='kid-form'>
            <div className='name-box1'>
                <label htmlFor='kid-names'>Name
                    {hasSubmitted && errors.includes('Name is required') && (
                        <span className='validation-errors'> Name is required</span>
                    )}
                    {hasSubmitted && errors.includes('Name cannot be more than 50 characters') && (
                        <span className='validation-errors'>Name cannot be more than 50 characters</span>
                    )}
                </label>
                <input
                    id='kid-names'
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className='birth-date-box2'>
                <label htmlFor='kid-birth-dates'>Birth Date</label>
                <div id='kid-birth-dates' className='year-month-day-box'>
                    <select value={year} onChange={e => setYear(e.target.value)}>
                        <option value="">Select Year</option>
                        {years.map((year, i) => (
                            <option key={`year-${i}`} value={year}>{year}</option>
                        ))}
                    </select>
                    {hasSubmitted && errors.includes('Please choose a year') && (
                        <p className='validation-errors'> Please choose a year</p>
                    )}

                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                        <option value="">Select Month</option>
                        {months.map((month, i) => (
                            <option key={`month-${i}`} value={month}>{month}</option>
                        ))}
                    </select>
                    {hasSubmitted && errors.includes('Please choose a month') && (
                        <p className='validation-errors'> Please choose a month</p>
                    )}

                    <select value={day} onChange={(e) => setDay(e.target.value)}>
                        <option value="">Select Day</option>
                        {days.map((day, i) => (
                            <option key={`day-${i}`} value={day}>{day}</option>
                        ))}
                    </select>
                    {hasSubmitted && errors.includes('Please choose a day') && (
                        <p className='validation-errors'> Please choose a day</p>
                    )}
                </div>
            </div>

            <div className='relationship-box3'>
                <label htmlFor='kid-relationship-box'>Relationship
                    {hasSubmitted && errors.includes('Please choose a relationship') && (
                        <span className='validation-errors'>Please choose a relationship</span>
                    )}
                </label>
                <select
                    id='kid-relationship-box'
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                >
                    <option value="">Select Relationship</option>
                    {relationships.map((relationship, index) => (
                        <option key={`relationship-${index}`} value={relationship}>{relationship}</option>
                    ))}
                </select>
            </div>

            <div id='images-box4'>
                {kid?.kid_image_url && (
                    <div className="current-kid-profile-image">
                        <img src={kid.kid_image_url} alt="Current Kid Profile Image" />
                    </div>
                )}
                <label htmlFor='kid-image'>Profile Image Upload</label>
                <input
                    id='kid-image'
                    type='file'
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>

            <div id='kid-update-two-buttons'>
                <button type="submit">Update</button>
                <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
        </form>
    );
}

export default UpdateKidForm;