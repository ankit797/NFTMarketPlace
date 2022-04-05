import React from "react";
import logo from "../assets/logo.png";
import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin, BsGithub } from "react-icons/bs";

export default function Footer() {
  const links = [
    {
      title: "About",
      data: ["About", "Terms", "Legal"],
    },
    {
      title: "NFT",
      data: ["OpenSea", "Maker", "Learn"],
    },
    {
      title: "Contact",
      data: ["Press", "Support"],
    },
    {
      title: "Social",
      data: ["Twiiter", "Instagram"],
    },
  ];
  const socialLink = [
    <BsFacebook />,
    <BsTwitter />,
    <BsInstagram />,
    <BsGithub />,
    <BsLinkedin />,
  ];
  const SocialApplinks = [
    {
      logo: <BsFacebook />,
      link: '#',
    },
    {
      logo: <BsTwitter />,
      link: '#',
    },
    {
      logo: <BsInstagram />,
      link: 'https://www.instagram.com/its_ak797/',
    },
    {
      logo: <BsGithub />,
      link: 'https://github.com/ankit797',
    },
    {
      logo: <BsLinkedin />,
      link: 'https://www.linkedin.com/in/ankit797/',
    },
  ];
  return (
    <footer>
      <div className="upper">
        <div className="brand-container">
          <div className="brand">
            <img src={logo} alt="logo" />
          </div>
          <p>Exclusive NFT Collection</p>
          {/* <ul>
            {socialLink.map((link, index) => (
              <li key={index}><a href="">{link}</a></li>
            ))}
          </ul> */}
          <ul>
            {SocialApplinks.map(({logo, link}, index) => (
              <li key={index}><a href={link}><span className="social">{logo}</span></a></li>
            ))}
            
          </ul>
        </div>
        <div className="links">
          {links.map(({ title, data }, index) => {
            return (
              <div className="link" key={index}>
                <h4>{title}</h4>
                <ul>
                  {data.map((link, index2) => (
                    <li key={index2}>{link}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <div className="lower">
        <span>&copy; Copyright 2022 NFT</span>
        <span>Launching August 2022</span>
      </div>
    </footer>
  );
}
