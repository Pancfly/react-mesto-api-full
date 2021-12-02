import React from 'react';
import PopupWithForm from './PopupWithForm';

function AddPlacePopup(props) {

  const [name, setName] = React.useState('');
  const [link, setLink] = React.useState('');

  React.useEffect(() => {
    setName('');
    setLink('');
  }, [props.isOpen])

  function handleChangeCardName(e) {
    setName(e.target.value)
  }

    function handleChangeCardLink(e) {
    setLink(e.target.value)
  }

  function handleSubmit(e) {
  e.preventDefault();
    props.onAddPlace({
      name,
      link
    });
}

  return (
    <PopupWithForm loadingButtonText="Сохранение..." isLoadingData={props.isLoadingData} onSubmit={handleSubmit} onClose={props.onClose} isOpen={props.isOpen} name="elements" title="Новое место" buttonText="Создать">
      <input value={name} onChange={handleChangeCardName} id="card-name-input" type="text" className="popup__text" name="card-name" placeholder="Название" required minLength={2} maxLength={30} />
      <span id="card-name-error" className="popup__text-error"></span>
      <input value={link} onChange={handleChangeCardLink} id="card-src-input" type="url" className="popup__text" name="card-link" placeholder="Ссылка на картинку" required />
      <span id="card-link-error" className="popup__text-error"></span>
    </PopupWithForm>
  )
}

export default AddPlacePopup;