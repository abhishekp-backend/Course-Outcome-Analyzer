import React from "react";
import { useLocation } from "react-router-dom";
import {useSelector} from "react-redux"

function Header() {

  // const {user} = useSelector(state=>state.auth)
  const { currentSubject } = useSelector(state => state.subjects)
  const user = JSON.parse(localStorage.getItem("user"))
  function capitalize(text) {
    if (text){
      return text[0].toUpperCase() + text.slice(1);
    } else {
      return
    }
  }
  const location = useLocation();
  
  return (
    <div className="p-3 w-screen flex h-fit shadow bg-red-500/90 text-white ">
      <p className=" text-3xl font-semibold ">
        {console.log(location.pathname.split("/"))}
        {location.pathname.split("/")[1] !== "subject" ? capitalize(location.pathname.slice(1)) : currentSubject?.name + "-" + currentSubject?.branch}
      </p>
      <div className="profile ml-auto flex gap-4">
        <img src="defaultPFP.png" className="w-10 m-auto" />
        <h1 className="text-2xl m-auto">{user?.name}</h1>
      </div>
    </div>
  );
}

export default Header;
