import React from "react";
import {NavLink, Route} from 'react-router-dom';
import superEth from "../assets/supereth.png";
export default function Card({ image, series, title, price, tag, time, tokenId, SelltokenId }) {
  return (
    <div className="card">
      <div className="card-image">
      {tokenId?
        (<Route>
          <NavLink  exact  to={`${tokenId}`}>
            <img src={image} alt="super1" />
          </NavLink>
        </Route>) : <img src={image} alt="super1" />
      }

      </div>
      <div className="card-content">
        <div className="card-heading">
          <span className="card-series">{series}</span>
          <span className="card-top">Price</span>
        </div>
        <div className="card-details">
          <h4 className="card-title">{title}</h4>
          <div className="card-price">
            <img src={superEth} alt="super eth" />
            <h4>{price} ETH</h4>
          </div>
        </div>
        <div className="card-sub-details">
          <span>#{tag}</span>
          <span>
            { SelltokenId?
              (<NavLink className="Button" exact  to={`${SelltokenId}`}>
                sellNFT
              </NavLink>):<div></div>
            }
 
          </span>
        </div>
      </div>
    </div>
  );
}
