import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../service/MarvelService'

import './comicsList.scss';




const ComicsList = () => {
    const {loading, error, getAllComics} = useMarvelService();

    const [ComicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemsLoading] = useState(false);
    const [offset, setOffset] = useState(200);
    const [comicsEnded, setComicsEnded] = useState(false);

    useEffect(() => {
        onRequest(offset, true);
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewItemsLoading(false) : setNewItemsLoading(true);
        getAllComics(offset)
            .then(res => onComicsListLoaded(res))
    }

    const onComicsListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 8) {
            ended = true;
        }

        setComicsList(charList => [...charList, ...newCharList]);
        setNewItemsLoading(newItemLoading => false);
        setOffset(offset => offset + 8);
        setComicsEnded(ComicsEnded => ended);
    }

    function renderItems (arr) {
        return (
            <ul className="comics__grid">
                {
                    arr.map(({title, id ,price, description, thumbnail}) => {
                        return (
                            <li key={id} className="comics__item">
                                <Link to={`/comics/${id}`}>
                                    <img src={thumbnail} alt="ultimate war" className="comics__item-img"/>
                                    <div className="comics__item-name">{title}</div>
                                    <div className="comics__item-price">{price}</div>
                                </Link>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    const items = renderItems(ComicsList);
    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="comics__list">
            {spinner}
            {errorMessage}
            {items}
            <button onClick={onRequest} 
                    className="button button__main button__long"
                    disabled={newItemLoading}
                    style={{'display' : comicsEnded ? 'none' : 'block'}}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

export default ComicsList;