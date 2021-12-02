import React from 'react';
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main(props) {

  const currentUser = React.useContext(CurrentUserContext);

  const onEditAvatar = () => {
    props.onEditAvatar();
  }

  const onEditProfile = () => {
    props.onEditProfile();
  }

  const onAddPlace = () => {
    props.onAddPlace();
  }

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-overlay">
          <img src={currentUser.avatar} alt="Аватар пользователя" className="profile__avatar" />
          <button onClick={onEditAvatar} type="button" className="profile__button profile__button_action_avatar-edit"></button>
        </div>
        <div className="profile__info">
          <button onClick={onEditProfile} type="button" aria-label="Редактировать профиль" className="profile__button profile__button_action_edit"></button>
          <h1 className="profile__name">{props.isLoadingInitialData ? 'Загрузка...' : currentUser.name}</h1>
          <p className="profile__about">{props.isLoadingInitialData ? 'Загрузка...' : currentUser.about}</p>
        </div>
        <button onClick={onAddPlace} type="button" aria-label="Добавить место" className="profile__button profile__button_action_add"></button>
      </section>
      <section className="elements">
        <div className="elements__list">
          {props.cards.map(card => (
            <Card key={card._id} card={card} onCardClick={props.onCardClick} onCardDeleteRequest={props.onCardDeleteRequest} onCardLike={props.onCardLike} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default Main;