import success from '../images/sign-up/success.svg';
import fail from '../images/sign-up/not-success.svg';

function InfoTooltip(props) {

  const messageIcon = props.authStatus ? success : fail;
  const iconAlt = props.authStatus ? 'Успех!' : 'Ошибка!';
  const messageText = props.authStatus ? 'Вы успешно зарегистрировались!' : 'Что-то пошло не так! Попробуйте еще раз.';

  return (
    <div className={`popup popup_type_${props.name} ${props.isOpen && 'popup_is-opened'}`}>
      <div className="popup__container popup__container_align_center">
        <img src={messageIcon} alt={iconAlt} className="popup__image-status" />
        <h3 className="popup__massage">{messageText}</h3>
        <button type="button" onClick={props.onClose} aria-label="Закрыть окно" className="popup__button popup__button_close"></button>
      </div>
    </div>
  )
}

export default InfoTooltip;