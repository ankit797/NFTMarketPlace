import React, { useEffect, useState } from "react";
import { UserbuyingNFT } from "../utils/Intereact";
import {NavLink, Route} from 'react-router-dom';
import superEth from "../assets/supereth.png";
import axios from "axios";
const {ethers} = require('ethers');


require('dotenv').config();

const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = require("../contracts/NFTMarketplace.json");

export default function SuperRare() {

  const [nfts, setNfts] = useState([]);
    const [loadingState, setLoadingState] = useState('not-loaded');
    useEffect(() => {
        loadNFTs();
    }, []);

    async function loadNFTs(){

      const provider = new ethers.providers.AlchemyProvider('ropsten',alchemyKey);
      const contract = await new ethers.Contract(contractAddress,contractABI.abi,provider);

      const data = await contract.fetchMarketItems();

      const items = await Promise.all(data.map(async i=>{
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri)
          
          let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
          
          let item = {
              ItemId:i.ItemId,
              price:price,
              tokenId:i.tokenId.toNumber(),
              seller:i.seller,
              owner: i.owner,
              image: meta.data.image,
              name: meta.data.name,
              description: meta.data.description,
          }
          return item;
      }))
      setNfts(items);
      setLoadingState('loaded');
    }

    async function buyNft(ItemId,ItemPrice) {

      await UserbuyingNFT(ItemId,ItemPrice);
      // reload page
      loadNFTs();
    }

    if(loadingState === 'loaded' && !nfts.length) return (<h1>No items in market Place</h1>)

  return (
    <>
      <div className="super-rare">
        <div className="title-container">
          <h2 className="title">Super Rare Auction</h2>
          <p className="description">
            We have released some limited edition NFT's early which can be
            bid.
          </p>
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
