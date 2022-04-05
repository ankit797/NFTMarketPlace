import React, { useEffect, useState } from "react";
import { loadNFTs, UserbuyingNFT } from "../utils/Intereact";
import {NavLink, Route} from 'react-router-dom';
import superEth from "../assets/supereth.png";


const AllUnsoldNFTs = () => {

    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    useEffect(() => {
        loadAllUnsoldNFTs();
    }, []);

    async function loadAllUnsoldNFTs(){
      const items =await loadNFTs();
      
      setNfts(items);
      setLoadingState('loaded');
    }
    
    async function buyNft(ItemId,ItemPrice) {
        console.log(ItemId);
        console.log(ItemPrice);
        await UserbuyingNFT(ItemId,ItemPrice);
        // reload page
        loadAllUnsoldNFTs();
    }

    if(loadingState === 'loaded' && !nfts.length) return (<h1>No items in market Place</h1>)

  return (
    <>
      <div className="super-rare">
        <div className="title-container">

          {/* <h2 className="title">LE Super Rare Auction</h2>
          <p className="description">
            We have released four limited edition NFT's early which which can be
            bid on via <a href="#">OpenSea</a>.
          </p> */}
        </div>
        <div className="cards">

          {nfts.length ?
            (nfts.map((element,index)=>{
              return(
                <div key={index} className="card">
                  <div className="card-image">
                    
                    <Route>
                      <NavLink  exact  to={`/nftdetailpage/${element.ItemId}`}>
                        <img src={element.image} alt="super1" />
                      </NavLink>
                    </Route>
                  </div>
                  <div className="card-content">
                    <div className="card-heading">
                      <span className="card-series">"Gloop Series"</span>
                      <span className="card-top">Price</span>
                    </div>
                    <div className="card-details">
                      <h4 className="card-title">{element.name}</h4>
                      <div className="card-price">
                        <img src={superEth} alt="super eth" />
                        <h4>{element.price} ETH</h4>
                      </div>
                    </div>
                    <div className="card-sub-details">
                      <span>#{element.tokenId}</span>
                      <span>
                        
                        <button className="Button" type="submit" onClick={()=>buyNft(element.ItemId, element.price)}>
                            Buy
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              )
                
            }) )
            : <h1>There is no NFT In This Account</h1>
          }

          
        </div>
      </div>
    </>
  );
}

export default AllUnsoldNFTs;