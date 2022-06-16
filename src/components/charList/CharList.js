import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../service/MarvelService'
import './charList.scss';


const CharList = (props) =>{

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false)


    const marvelService = new MarvelService();

    useEffect(() => {
        onRequest();
    }, [])


    const onRequest = (offset) => {
        onCharListLoading();
        marvelService.getAllCharacters(offset)
            .then(res => onCharListLoaded(res))
            .catch(onError);
    }

    const onCharListLoading = () => {
        setNewItemLoading(true);
    }

    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(loading => false);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }

    const onError = () => {
        setError(true);
        setLoading(loading => false);
    }



    function renderItems (arr) {
        return (
            <ul className="char__grid">
                {
                    arr.map(({name, thumbnail, id}, i) => {
                        let imgStyle = {'objectFit' : 'cover'}
                        if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                            imgStyle = {'objectFit' : 'unset'}
                        }

                        return (
                            <li tabIndex={0} key={id} 
                            className="char__item"
                            onClick={() => props.onCharSelected(id)}>
                                <img style={imgStyle} src={thumbnail} alt="abyss"/>
                                <div className="char__name">{name}</div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }


    const items = renderItems(charList)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading ? <Spinner/> : null;
    const content = !(loading || error) ? items : null;

    return (
        <div className="char__list">
                {content}
                {errorMessage}
                {spinner}
            <button className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display' : charEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}> 
                <div className="inner">load more</div>
            </button>
        </div>
    )
}
   

CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;