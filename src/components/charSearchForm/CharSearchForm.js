import React , {useState} from 'react'
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import * as Yup from 'yup'
import { Link } from 'react-router-dom';

import useMarvelService from '../../service/MarvelService';

import './CharSearchForm.scss'


function CharSearchForm() {
    const [char, setChar] = useState(null);
    const {loading, error, getCharacterByName, clearError} = useMarvelService(); 

    const updateChar = (name) => {
        clearError();

        getCharacterByName(name).
            then(setChar); 
    }
    
    const result = !char ? null : char.length > 0 ? 
        <div className='char__search-wrapper'>
            <div className="char__search-success">There is! Visit {char[0].name} page?</div>
            <Link to={`/characters/${char[0].id}`} className="button button__secondary">
                <div className="inner">To page</div>
            </Link>
        </div> : 
        <div className='char__search-error'>The character was not found. Check the name and try again</div>

    return (
    <div className='char__search-form'>
        <Formik
            initialValues={{
                charName: '',
            }}
            validationSchema={Yup.object({
                charName: Yup.string().required('This field is required'),               
            })}
            onSubmit={({charName}) => updateChar(charName)}
        >
            <Form >
                <label className='char__search-label' htmlFor="charName">Or find a character by name:</label>
                <div className='char__search-wrapper'>
                    <Field
                        id="charName"  
                        type="text"
                        name='charName' 
                        placeholder="Enter name"
                    />

                    <button className='button button__main'
                        type='submit'>
                        <div className="inner">find</div>
                    </button>
                </div>
                <FormikErrorMessage component="div" name='charName' className='char__search-error'/>
            </Form>
        </Formik>
        {result}
    </div>
    )
}

export default CharSearchForm