import React from 'react';

function ImagePopup(props) {

  return (
    <div className={`popup popup_type_fullscreen ${props.card.link && "popup_is-opened"}`} onMouseUp={props.closePopupByClickOutside}>
      <div className="popup__fullscreen-container">
        <button onClick={props.onClose} type="button" aria-label="Закрыть карточку" className="popup__button popup__button_close popup__button_close-fullscreen"></button>
        <img src={props.card.link} alt={props.card.name} className="popup__fullscreen-image" />
        <p className="popup__fullscreen-text">{props.card.name}</p>
      </div>
    </div>
  )
}

export default ImagePopup;