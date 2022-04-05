import React, { useState, useEffect } from "react";
import {BrowserRouter,Switch, Route, Redirect } from 'react-router-dom';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import scrollreveal from "scrollreveal";
import "./sass/index.scss";
import MainPage from "./components/MainPage";
import DetailedNFT from "./components/DetailedNFT";
import MintedNFTs from "./components/MintedNFTs";
import MintNFT from "./components/MintNFT";
import SellNFT from "./components/SellNFT";
import AllUnsoldNFTs from "./components/AllUnsoldNFTs";
import NFTDetailPage from "./components/NFTDetailPage";
import AllMyListedNFTs from "./components/AllMyListedNFTs";
import MyPurchasedNFT from "./components/MyPurchasedNFT";
import DashBoard from "./components/Dasbord";
import ReSellNFT from "./components/Resalenft";


const App=()=> {
  const [theme, setTheme] = useState("dark");
  const changeTheme = () => {
    theme === "dark" ? setTheme("light") : setTheme("dark");
  };
  useEffect(() => {
    const registerAnimations = () => {
      const sr = scrollreveal({
        origin: "bottom",
        distance: "80px",
        duration: 2000,
        reset: false,
      });
      sr.reveal(
        `
        nav,
        .home,
        .free,
        .clients,
        .super-rare,
        .releases,
        .like,
        .signup,
        footer
    `,
        {
          interval: 500,
        }
      );
    };
    registerAnimations();
  }, []);
  window.setTimeout(() => {
    
    const nav = document.getElementsByTagName("nav");
    nav[0].style.transform = "none";
  }, 1500);
  return (
    <BrowserRouter>
    <div data-theme={theme} className="app-container">
      <ScrollToTop />
      <Navbar changeTheme={changeTheme} currentTheme={theme} />
      <Switch>
        <Route exact path="/" component={MainPage} /> {/* use ether */}
        <Route exact path="/mintednfts" component={MintedNFTs} /> {/* use ether */}
        <Route exact path="/DashBoard" component={DashBoard} />
        <Route exact path="/allunsoldnfts" component={AllUnsoldNFTs} /> 
        <Route exact path="/AllMyListedNFTs" component={AllMyListedNFTs} />
        <Route exact path="/MyPurchasedNFT" component={MyPurchasedNFT} />
        <Route exact path="/mintnft" component={MintNFT} /> 

        <Route exact path="/DetailedNFT/:id" render={props =>(
          <DetailedNFT {...props}/>
        )}>
        </Route> {/* use ether */}

        <Route exact path="/nftdetailpage/:id" render={props =>(
          <NFTDetailPage {...props}/>
        )}>
        </Route>{/* use ether */}
        
        

        <Route exact path="/sellNFT/:id" render={props =>(
          <SellNFT {...props}/>
        )}>
        </Route>

        <Route exact path="/resellNFT/:id" render={props =>(
          <ReSellNFT {...props}/>
        )}>
        </Route>
        
        <Redirect to="/" />
      </Switch>
      <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;
