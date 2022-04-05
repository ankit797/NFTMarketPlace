import React, { useEffect, useState } from "react";
import MintedNFTcard from "./MintedNFTCard";

require('dotenv').config();
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(`https://eth-ropsten.alchemyapi.io/v2/${alchemyKey}`);



const MintedNFTs = () => {

  const [result, setResult] = useState([]);

  const UsersNFTs =  async () =>{
    const walletAddress = await window.ethereum.request({method: "eth_requestAccounts"});
    // console.log(walletAddress[0]);
    const nftMetadata = await web3.alchemy.getNfts({owner:walletAddress[0], contractAddresses:contractAddress});
    setResult(nftMetadata.ownedNfts);
    // console.log(nftMetadata.ownedNfts);
  };

  useEffect(() => {
    UsersNFTs();
  }, []);

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
        
          {result.length ?
            (result.map((element,index)=>{
                if(element.contract.address === contractAddress)
                
                    return (<MintedNFTcard
                      image={element.metadata.image}
                      series="Gloop Series"
                      title={element.metadata.name}
                      tokenId={parseInt(element.id.tokenId)}
                      time='1'
                      key={index}
                      DetailedUrl = {`/DetailedNFT/${element.id.tokenId}`}
                      SelltokenId = {`/sellNFT/${element.id.tokenId}`}
                    />)
            }) )
            : <h1>There is no NFT In This Account</h1>
          }
        </div>
      </div>
    </>
  );
}

export default MintedNFTs;