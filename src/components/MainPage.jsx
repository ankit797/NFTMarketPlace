import React from "react";
import Clients from "./Clients";
import Free from "./Free";
import Home from "./Home";
import Like from "./Like";
import Release from "./Release";
import Signup from "./Signup";
import SuperRare from "./SuperRare";

const MainPage=()=> {
  return (
    <>
      <Home />
      <Free />
      <Clients />
      <SuperRare />
      <Release />
      <Like />
      <Signup />
    </>
  );
}

export default MainPage;
