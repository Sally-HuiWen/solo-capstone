import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkAddNewKid } from '../../redux/kids';
import './KidForm.css';

const KidForm = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [relationship, setRelationship] = useState('');
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
        const errorArr = [];
        if (!name) errorArr.push('Name is required');
        if (name.length > 50) errorArr.push('Name can not be more than 50 characters');
        if (!year) errorArr.push('Please choose a year');
        if (!month) errorArr.push('Please choose a month');
        if (!day) errorArr.push('Please choose a day');
        if (!relationship) errorArr.push('Please choose a relationship');
        setErrors(errorArr);
    }, [name, year, month, day, relationship]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (errors.length > 0) return //prevent submission to backend if frontend errors exist
        
        const newKid = {
            name, 
            birth_date: `${year}-${month}-${day}`,
            relationship
        };
        dispatch(thunkAddNewKid(newKid));
        navigate('/your-kids-list')
    }

    const years = Array.from(new Array(100), (val, i) => new Date().getFullYear() - i);
    const months = Array.from(new Array(12), (val, i) => i + 1);
    const days = Array.from(new Array(31), (val, i) => i + 1);

    return (
        <form onSubmit={handleSubmit} id='kid-form'>
            <div id='name-box1'>
                <label htmlFor='kid-names'>Name
                    {hasSubmitted && errors.includes('Name is required') && (
                       <span className='validation-errors'> Name is required</span> 
                    )}
                    {hasSubmitted && errors.includes('Name can not be more than 50 characters') && (
                       <span className='validation-errors'>Name can not be more than 50 characters</span> 
                    )}
                </label>
                <input
                      id='kid-names'
                      type='text'
                      value={name}
                      onChange={(e)=> setName(e.target.value)}
                    />
            </div>

            <div id='birth-date-box2'>
                <label htmlFor='kid-birth-dates'>Birth Date</label>
                <div id='kid-birth-dates' className='year-month-day-box'>
                    <select value={year} onChange={e => setYear(e.target.value)}>
                        <option value="">Select Year</option>
                        {years.map((year,i) => (
                        <option key={i} value={year}>{year}</option>
                        ))}

                    </select>
                    {hasSubmitted && errors.includes('Please choose a year') && (
                    <p className='validation-errors'> Please choose a year</p> 
                    )}


                    <select value={month} onChange={(e) => setMonth(e.target.value)}>
                        <option value="">Select Month</option>
                        {months.map((month, i) => (
                        <option key={i} value={String(month).padStart(2, '0')}>{month}</option>
                        ))}
                    </select>
                    {hasSubmitted && errors.includes('Please choose a month') && (
                    <p className='validation-errors'> Please choose a month</p> 
                    )}

                    <select value={day} onChange={(e) => setDay(e.target.value)}>
                        <option value="">Select Day</option>
                        {days.map((day, i) => (
                        <option key={i} value={String(day).padStart(2, '0')}>{day}</option>
                        ))}
                    </select>
                    {hasSubmitted && errors.includes('Please choose a day') && (
                    <p className='validation-errors'> Please choose a day</p> 
                    )}
                </div>
            </div>

            <div id='relationship-box3'>
                <label htmlFor='kid-relationship-box'>Relationship
                    {hasSubmitted && errors.includes('Please choose a relationship') && (
                    <span className='validation-errors'>Please choose a relationship</span> 
                    )}
                </label>
                <select 
                    id='kid-relationship-box'
                    value={relationship}
                    onChange={(e)=> setRelationship(e.target.value)} 
                >
                    <option value="">Select Relationship</option>
                    {relationships.map((relationship,index)=> (
                    <option key={index} value={relationship}>{relationship}</option>
                    ))}
                </select>
            </div>
            <button type="submit">Add a new kid</button>
        </form>
    )

}

export default KidForm;