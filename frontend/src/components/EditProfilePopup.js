import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup(props) {

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
}, [currentUser, props.isOpen]); 

  function handleSubmit(e) {
  e.preventDefault();
  props.onUpdateUser({
    name,
    about: description,
  });
}
  
  function handleChangeUserName(e) {
    setName(e.target.value)
  }

  function handleChangeUserDescription(e) {
    setDescription(e.target.value)
  }

  return (
    <PopupWithForm loadingButtonText="Сохранение..." isLoadingData={props.isLoadingData} onSubmit={handleSubmit} onClose={props.onClose} closePopupByClickOutside={props.closePopupByClickOutside} isOpen={props.isOpen} name="profile" title="Редактировать профиль" buttonText="Сохранить">
      <input value={name || ''} onChange={handleChangeUserName} id="profile-name" type="text" className="popup__text" name="name" placeholder="Имя" required minLength={2} maxLength={40} />
      <span id="profile-name-error" className="popup__text-error" />
      <input value={description || ''} onChange={handleChangeUserDescription} id="profile-about" type="text" className="popup__text" name="about" placeholder="О себе" required minLength={2} maxLength={200} />
      <span id="profile-about-error" className="popup__text-error" />
    </PopupWithForm>
  )
}

export default EditProfilePopup