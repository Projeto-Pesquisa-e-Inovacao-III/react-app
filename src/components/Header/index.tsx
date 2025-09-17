import { useState } from "react";
import "./style.css"


export default function Header() {

  const [burgerActive, setBurgerActive] = useState(false);

  return (
    <header>
      <div className="header-logo">
        <img src="https://placehold.co/90x40" alt="logo" />
      </div>

      <div className="burger" onClick={() => setBurgerActive(!burgerActive)}>
        <img src="https://placehold.co/30x30" alt="" />
      </div>

      {
        burgerActive && (
          <nav className="nav-mobile">
            <a href="#">Home</a>
            <a href="#">About</a>
            <a href="#">Services</a>
            <a href="#">Contact</a>
          </nav>
        )

      }
    </header>
  );
}
