import { useState, useEffect } from 'react';
import PropTypes from 'prop-types'
import {CSSTransition,TransitionGroup} from 'react-transition-group';

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../service/MarvelService'
import './charList.scss';


const CharList = (props) =>{

    const {loading, error, getAllCharacters} = useMarvelService();

    const [charList, setCharList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);




    useEffect(() => {
        onRequest(offset, true);
    }, [])


    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllCharacters(offset)
            .then(res => onCharListLoaded(res))
    }


    const onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        setCharList(charList => [...charList, ...newCharList]);
        setNewItemLoading(newItemLoading => false);
        setOffset(offset => offset + 9);
        setCharEnded(charEnded => ended);
    }


    function renderItems (arr) {
        return (
            <ul className="char__grid">
                <TransitionGroup component={null}>
                    {
                        arr.map(({name, thumbnail, id}, i) => {
                            let imgStyle = {'objectFit' : 'cover'}
                            if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                                imgStyle = {'objectFit' : 'unset'}
                            }

                            return (
                                <CSSTransition
                                    key={id}
                                    timeout={500}
                                    classNames={'char__item'}>
                                    <li tabIndex={0} key={id} 
                                    className="char__item"
                                    onClick={() => props.onCharSelected(id)}>
                                        <img style={imgStyle} src={thumbnail} alt="abyss"/>
                                        <div className="char__name">{name}</div>
                                    </li>
                                </CSSTransition>
                            )
                        })
                    }
                </TransitionGroup>
            </ul>
        )
    }


    const items = renderItems(charList)

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;

    return (
        <div className="char__list">
                {errorMessage}
                {spinner}
                {items}
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