import { Component } from 'react';
import PropTypes from 'prop-types'

import Spinner from '../spinner/Spinner'
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../service/MarvelService'
import './charList.scss';


class  CharList extends Component {


    state = {
        charList : [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210, 
        charEnded: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.onRequest();
    }

    onRequest = (offset) => {
        this.onCharListLoading();
        this.marvelService.getAllCharacters(offset)
            .then(res => this.onCharListLoaded(res))
            .catch(this.onError);
    }

    onCharListLoading() {
        this.setState({newItemLoading: true})
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }



    renderItems = (arr) => {
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
                            onClick={() => this.props.onCharSelected(id)}>
                                <img style={imgStyle} src={thumbnail} alt="abyss"/>
                                <div className="char__name">{name}</div>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }


    render() {
        const {charList, error, loading, newItemLoading, offset, charEnded} = this.state;
        const items = this.renderItems(charList)

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
                    onClick={() => this.onRequest(offset)}> 
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
   
}

CharList.propTypes = {
    onCharSelected: PropTypes.func
}


export default CharList;