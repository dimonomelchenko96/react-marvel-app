import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

import AppBanner from '../appBanner/AppBanner'
import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../service/MarvelService'

import './singleComicPage.scss';


const SingleComicPage = () => {
    const {charId} = useParams();


    const [char, setChar] = useState(null);
    const {loading,error, getCharacter, clearError} = useMarvelService();

    useEffect(() => {
        updateComic();
    }, [charId])
    
    
    const updateComic = () => {
        clearError();
        getCharacter(charId)
            .then(res => onComicLoaded(res))
    }

    const onComicLoaded = (char) => {
        setChar(char);
    }
    
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error || !char) ? <View comic={char}/> : null;

    return (
        <>
            {errorMessage}
            {spinner}
            {content}
        </>
    )
}

const View = ({comic}) => {
    const {name, description, thumbnail} = comic
    return (
        <>
            <AppBanner/>
            <div className="single-comic">
                <img src={thumbnail} alt="title" className="single-comic__img"/>
                <div className="single-comic__info">
                    <h2 className="single-comic__name">{name}</h2>
                    {
                        description ? <p className="single-comic__descr">{description}</p> :
                        <p className="single-comic__descr">Information not found</p> 
                    }
                </div>
            </div>
        </>
    )
}

export default SingleComicPage;