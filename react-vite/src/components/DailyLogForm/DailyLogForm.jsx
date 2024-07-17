import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { thunkCreateNewDailyLog, thunkUploadNewImage } from '../../redux/dailyLogs';
import './DailyLogForm.css';

const DailyLogForm = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {kidId} = useParams();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [errors, setErrors] = useState([]);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    useEffect(() => {
        const errorArr = [];
        if (!title) errorArr.push('Title is required');
        if (title.length > 50) errorArr.push('Title cannot be more than 50 characters');
        if (!content) errorArr.push('Content is required');
        if (content.length > 2000) errorArr.push('Content cannot be more than 2000 characters');
        if (!image) errorArr.push('Image is required');
        setErrors(errorArr);
      }, [title, content, image]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setHasSubmitted(true);

        if (errors.length > 0) {
            console.log('Form has errors:', errors);
            return;
        }
        
        const newDailyLog = { title, content };
        const newDailyLogRes = await dispatch(thunkCreateNewDailyLog(kidId, newDailyLog));
        console.log('what is newDailyLog', newDailyLog)
        console.log('what is newDailyLog response from thunk', newDailyLogRes)
        console.log('what is image', image)

        if (newDailyLogRes.errors) {
            setErrors(newDailyLogRes.errors);
        } else {
            if (image === null) {
                const formData = new FormData();
                formData.append('image', image);
                const imageRes = await dispatch(thunkUploadNewImage(newDailyLogRes.id, formData));
                console.log('Image upload response:', imageRes);
                // setImage(imageRes.url)
            }
            navigate(`/dailyLogs/${newDailyLogRes?.id}`);
        }
    };

    return (
        <form className='daily-logs-form' onSubmit={handleSubmit} encType="multipart/form-data">
            <div id='title-box1'>
                <label htmlFor='dailyLog-title'>Title
                {hasSubmitted && errors.includes('Title is required') && (
                    <span className='validation-errors'> Title is required</span> 
                    )}
                    {hasSubmitted && errors.includes('Title can not be more than 50 characters') && (
                    <span className='validation-errors'>Title can not be more than 50 characters</span> 
                    )}
                </label>
                <input
                      id='dailyLog-title'
                      type='text'
                      value={title}
                      onChange={(e)=> setTitle(e.target.value)}
                    />
            </div>

            <div id='content-box2'>
                <label htmlFor='dailyLog-content'>Content
                {hasSubmitted && errors.includes('Content is required') && (
                    <span className='validation-errors'> Content is required</span> 
                    )}
                    {hasSubmitted && errors.includes('Content can not be more than 2000 characters') && (
                    <span className='validation-errors'>Content  can not be more than 2000 characters</span> 
                    )}
                </label>
                <textarea
                      id='dailyLog-content'
                      value={content}
                      onChange={(e)=> setContent(e.target.value)}
                      rows='10'
                      cols='50'
                    />
            </div>

            <div id='images-box3'>
                <label htmlFor='dailyLog-image'>Image
                {hasSubmitted && errors.includes('Image is required') && (
                    <span className='validation-errors'> Image is required</span> 
                    )}
                </label>
                <input
                    id='dailyLog-image'
                    type='file'
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>
                            
            <button type='submit' id='dailyLog-submit-button'>Add your new dailyLog</button>
        </form>
    );
};

export default DailyLogForm;
