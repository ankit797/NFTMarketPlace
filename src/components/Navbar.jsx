import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { ImSun } from "react-icons/im";
import { BsFillMoonFill } from "react-icons/bs";
import logo from "../assets/logo.png";
import { connectWallet, getCurrentWalletConnected } from "../utils/Intereact";
import { NavLink } from "react-router-dom";


export default function Navbar({ changeTheme, currentTheme }) {
  const [navState, setNavState] = useState(false);

  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");


  useEffect(() => {

    async function fetchWallet() {
      const {address, status} = await getCurrentWalletConnected();
      setWallet(address);
      setStatus(status); 
    }
    fetchWallet();
    addWalletListener();
    console.log(status);

  }, [status]);

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }
  
  const connectWalletPressed = async (e) => {
    e.preventDefault();
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };


  return (
    <nav>
      <div className="brand-container">
        <div className="brand">
        <NavLink  exact  to="/">
          <img src={logo} alt="logo" />
        </NavLink>
        
        </div>
        <div className="toggle-container">
          <div className="toggle">
            {navState ? (
              <MdClose onClick={() => setNavState(false)} />
            ) : (
              <GiHamburgerMenu onClick={() => setNavState(true)} />
            )}
          </div>
          <div className="mode" onClick={changeTheme}>
            {currentTheme === "dark" ? (
              <ImSun className="light" />
            ) : (
              <BsFillMoonFill className="dark" />
            )}
          </div>
        </div>
      </div>
      <div className={`links-container ${navState ? "nav-visible" : ""}`}>
        <ul className="links">
          <li>
            <NavLink  exact  to="/mintednfts">
              Listed NFTs
            </NavLink>
          </li>
          <li>
            <NavLink  exact  to="/allunsoldnfts">
              All Unsold NFTs
            </NavLink>
          </li>
          <li>
            <NavLink  exact  to="/dashboard">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink  exact  to="/mintnft">
              Create NFT
            </NavLink>
          </li>

          <li>
          
            <a href="/" onClick={connectWalletPressed}>

                {walletAddress.length > 0 ? (
                  "Account: " +
                    String(walletAddress).substring(0, 6) +
                    "..." +
                    String(walletAddress).substring(38)
                ) : (
                  <span>Connect Wallet</span>
                )}
              
              
            </a>
            
          </li>
          <li onClick={changeTheme}>
            {currentTheme === "dark" ? (
              <ImSun className="light" />
            ) : (
              <BsFillMoonFill className="dark" />
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
