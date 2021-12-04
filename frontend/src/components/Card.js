import React from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card(props) {

  const currentUser = React.useContext(CurrentUserContext);

  const isOwn = props.card.owner === currentUser._id;
  const cardDeleteButtonClassName = (`${isOwn ? 'elements__button_delete' : 'elements__button_delete-hidden'}`);

  const isLiked = props.card.likes.find(item => item === currentUser._id);
  const cardLikeButtonClassName = (`elements__button_like ${isLiked ? 'elements__button_like-active' : ''}`);

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card, isLiked);
  }

  function handleDeleteClick() {
    props.onCardDeleteRequest(props.card);
  }

  return (
    <div className="elements__element">     
      <img onClick={handleClick} src={props.card.link} alt={props.card.name} className="elements__image" />
      <button onClick={handleDeleteClick} type="button" aria-label="Удалить карточку" className={`elements__button ${cardDeleteButtonClassName}`}></button>
      <h3 className="elements__title">{props.card.name}</h3>
      <div className="elements__like-conteiner">
        <button onClick={handleLikeClick} type="button" className={`elements__button ${cardLikeButtonClassName}`} />
        <span className="elements__count">{props.card.likes.length}</span>
      </div>
    </div>
  )
}

export default Card;