import React from "react";
import {NavLink, Route} from 'react-router-dom';

export default function MintedNFTcard({ image, series, title, tokenId, time, DetailedUrl, SelltokenId }) {
  return (
    <div className="card">
      <div className="card-image">
      {DetailedUrl?
        (<Route>
          <NavLink  exact  to={`${DetailedUrl}`}>
            <img src={image} alt="super1" />
          </NavLink>
        </Route>): <img src={image} alt="super1" />
      }
      </div>
      <div className="card-content">
        <div className="card-heading">
          <span className="card-series">{series}</span>
          <span className="card-top">Top bid</span>
        </div>
        <div className="card-details">
          <div className="card-Id">
            <h4>#{tokenId}</h4>
          </div>
          <h4 className="card-title">{title}</h4>
        </div>
        <div className="card-sub-details">
          <span></span>
          <span >
            <NavLink className="Button" exact  to={`${SelltokenId}`}>
              sell
            </NavLink>
          </span>
        </div>
      </div>
    </div>
  );
}
