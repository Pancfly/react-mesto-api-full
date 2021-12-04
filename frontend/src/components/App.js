import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import api from '../utils/Api';
import auth from '../utils/Auth';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function App() {
  const [currentUser, setCurrentUser] = React.useState({});
  const [cardForDelete, setCardForDelete] = React.useState({})
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = React.useState(false);
  const [isImagePopupOpen, setImagePopupOpen] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [token, setToken] = React.useState('');
  const history = useHistory();

  const [isLoadingInitialData, setIsLoadingInitialData] = React.useState(false);
  const [isLoadingSetUserInfo, setIsLoadingSetUserInfo] = React.useState(false);
  const [isLoadingAddPlaceSubmit, setIsLoadingAddPlaceSubmit] = React.useState(false);
  const [isLoadingAvatarUpdate, setIsLoadingAvatarUpdate] = React.useState(false);

  React.useEffect(() => {
    if(loggedIn){
      setIsLoadingInitialData(true);
      const jwt = localStorage.getItem('twt');
      api.getInitialData(jwt)
        .then(res => {
          const [userData, cardsData] = res;
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch(err => {
          console.error(err)
        })
        .finally( () => {
          setIsLoadingInitialData(false);
        })
    }
  }, [loggedIn]);

  const tokenCheck = React.useCallback(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setToken(jwt);
      auth.checkToken(jwt)
      .then((res) => {
        setLoggedIn(true);
        setUserEmail(res.email);
        history.push('/');
      })
      .catch((err) => {
        console.log(err)
      })
    }
  }, [history]);

  React.useEffect(() => {
    tokenCheck();
  }, [tokenCheck])

  function handleCardLike(card) {
    const isLiked = card.likes.some(item => item._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.error(err)
      });
  }

  function handleCardDelete(e) {
    e.preventDefault();
    api.deleteCard(cardForDelete._id, token)
      .then(() => {
        setCards(cards.filter(c => c._id !== cardForDelete._id))
        closeAllPopups()
      })
      .catch((err) => {      
        console.error(err);
      })
  }

  const handleUpdateUser = (data) => {
    setIsLoadingSetUserInfo(true);
    api.patchUserData(data, token)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingSetUserInfo(false)
      })
  }

  const handleUpdateAvatar = (data) => {
    setIsLoadingAvatarUpdate(true);
    api.patchUserAvatar(data, token)
      .then((res) => {
        setCurrentUser(res)
        closeAllPopups()
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingAvatarUpdate(false);
      })
  }

  const handleAddPlaceSubmit = (newCard) => {
    setIsLoadingAddPlaceSubmit(true);
    api.postCard(newCard, token)
      .then((res) => {
        setCards([res, ...cards]);
        closeAllPopups()
      })
      .catch(err => {
        console.error(err)
      })
      .finally(() => {
        setIsLoadingAddPlaceSubmit(false);
      })
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card);
    setImagePopupOpen(true);
  }

  function handleCardDeleteRequest(card) {
    setCardForDelete(card);
    setIsConfirmPopupOpen(true);
  }

  const closeAllPopups = () => {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    setIsConfirmPopupOpen(false);
    setSelectedCard({});
    setIsInfoToolTipOpen(false);
  }

  const handleLogin = ({ email, password }) => {
    return auth.authorize(email, password)
      .then((data) => {
        if (data.token) {
          setUserEmail(email)
          setLoggedIn(true)
          localStorage.setItem('jwt', data.token)
          history.push('/')
          return;
        }
      })
      .catch(err => {
        console.log(err); 
      });
  }

  const handleRegister = ({ email, password }) => {
    return auth.register(email, password)
      .then((res) => {
        if (res.data._id) {
          setTooltipStatus(true);
          setIsInfoToolTipOpen(true);
          history.push('/sign-in');
        }
      })
      .catch((err) => {
        console.log(err);
        setTooltipStatus(false);
        setIsInfoToolTipOpen(true);
      });
  }

  const handleLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    setToken('');
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">

        <Header userEmail={userEmail} handleLogout={handleLogout} />

        <Switch>
          <ProtectedRoute exact path="/"
            loggedIn={loggedIn}
            component={Main}
            onCardClick={handleCardClick}
            onEditAvatar={handleEditAvatarClick}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onCardDeleteRequest={handleCardDeleteRequest}
            onCardLike={handleCardLike}
            isLoadingInitialData={isLoadingInitialData}
            cards={cards} />

          <Route path="/sign-up">
            <Register onRegister={handleRegister} />
          </Route>

          <Route path="/sign-in">
            <Login onLogin={handleLogin} onCheckToken={tokenCheck} />
          </Route>
        </Switch>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
          isLoadingData={isLoadingSetUserInfo}
          isLoadingInitialData={isLoadingInitialData}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
          isLoadingData={isLoadingAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
          isLoadingData={isLoadingAvatarUpdate}
        />

        <ConfirmationPopup
          isOpen={isConfirmPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleCardDelete}
        />

        <ImagePopup
          card={selectedCard}
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
        />

        <InfoTooltip
          name="tooltip"
          authStatus={tooltipStatus}
          onClose={closeAllPopups}
          isOpen={isInfoToolTipOpen}
        />

      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;