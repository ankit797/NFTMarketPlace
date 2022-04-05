import React, { useEffect, useState } from "react";
import "../sass/components/_dashboard.scss";
import { allMyPurchasedNFT, createdItems, loadNFTs, UserbuyingNFT } from "../utils/Intereact";
import { NavLink, Route } from "react-router-dom";
import superEth from "../assets/supereth.png";



const DashBoard = () => {

    const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    useEffect(() => {
        const byDefault = ()=>{
          if(loadingState === 'not-loaded'){
            listedNFT();
          }
        }
        byDefault()
    }, [loadingState]);

    const UnsoldNFTs = async()=>{
      const items = await loadNFTs();
      
      setNfts(items);
      setLoadingState('Unsold items');
    }

    async function buyNft(ItemId,ItemPrice) {
      
      await UserbuyingNFT(ItemId,ItemPrice);
      // reload page
      UnsoldNFTs();
    }

    const PurchasedNFT = async()=>{
      const items = await allMyPurchasedNFT();
      
      setNfts(items);
      setLoadingState('Purchased items');
    }

    const listedNFT = async()=>{
      const items = await createdItems();
      
      setNfts(items);
      setLoadingState('Listed items');
    }
   
  return (
    <>
        <div className="dashboard">
          <button onClick={UnsoldNFTs}>Unsold Items</button>
          <button onClick={PurchasedNFT}>Purchased Items</button>
          <button onClick={listedNFT}>My Listed items</button>
        </div>
        <div className="super-rare">
        <div className="title-container">
          <h2 className="title">{loadingState}</h2>
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
                        {(loadingState === 'Unsold items')?
                          (<button className="Button" type="submit" onClick={()=>buyNft(element.ItemId, element.price)}>
                              Buy
                          </button>):<div></div>
                        }
                        {(loadingState === 'Purchased items') ?
                          (<NavLink className="Button" exact  to={`/resellNFT/${element.ItemId}`}>
                            sell Again
                          </NavLink>):<div></div>
                        }
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

export default DashBoard;