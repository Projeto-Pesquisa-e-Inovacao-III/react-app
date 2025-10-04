import { useState } from "react";
// import "./style.css"

export default function Header() {

  const [burgerActive, setBurgerActive] = useState(false);

  return (
    <header className="flex justify-between items-center border-b h-20 p-[20px]">
      <div>
        <img src="https://placehold.co/90x40" alt="logo" />
      </div>

      <div className="h-6 flex flex-col justify-between cursor-pointer" onClick={() => setBurgerActive(!burgerActive)}>
        <div className="border-2 w-7"></div>
        <div className="border-2 w-7"></div>
        <div className="border-2 w-7"></div>
      </div>

      {
        burgerActive && (
          <nav className="flex absolute top-20 left-0 w-full flex-col bg-white p-7 border-b">
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
