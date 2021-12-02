import React from 'react';
import { Route, Link } from 'react-router-dom';

function Header(props) {

  return (
    <header className="header">
      <div className="header__logo"></div>
      <Route path="/sign-up">
        <Link to="/sign-in" className="header__link">Войти</Link>
      </Route>
      <Route path="/sign-in">
        <Link to="/sign-up" className="header__link">Регистрация</Link>
      </Route>
      <Route exact path="/">
        <ul className="header__list">
          <li>
            <p className="header__text">{props.userEmail}</p>
          </li>
          <li>
            <Link to="/sign-in" className="header__link header__link_logout" onClick={props.handleLogout}>Выйти</Link>
          </li>
        </ul>
      </Route>
    </header>
  )
}

export default Header;