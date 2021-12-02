import React from 'react';
import PopupWithForm from './PopupWithForm';


function EditAvatarPopup(props) {

  const avatarRef = React.useRef();


  function handleSubmit(e) {
    e.preventDefault();
    props.onUpdateAvatar({
      avatar: avatarRef.current.value
    });
}

  return (
    <PopupWithForm loadingButtonText="Сохранение..." isLoadingData={props.isLoadingData} onSubmit={handleSubmit} onClose={props.onClose} isOpen={props.isOpen} name="avatar" title="Обновить аватар" buttonText="Сохранить">
      <input ref={avatarRef} id="link" type="url" className="popup__text" name="link" placeholder="Ссылка на картинку" required />
      <span id="link-error" className="popup__text-error" />
    </PopupWithForm>
  )
}

export default EditAvatarPopup;