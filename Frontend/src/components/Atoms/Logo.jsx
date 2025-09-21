import React from "react";
import { Link } from "react-router-dom";
import some from "../../assets/some.png";
import icon from "../../assets/icon.png";

function Logo({ width = "w-12 sm:w-16 ", className = "" }) {
  return (
    <Link to={"/"}>
        <div>
          <img src={some} alt="" className="md:h-12 hidden md:block rounded " />
          <img src={icon} alt=""  className="md:hidden block h-6"/>   
        </div>    
    </Link>
  );
}

export default Logo;
