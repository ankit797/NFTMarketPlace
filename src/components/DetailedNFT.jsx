import React, { useEffect, useState } from "react";
import MintedNFTcard from "./MintedNFTCard";



require('dotenv').config();
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(`https://eth-ropsten.alchemyapi.io/v2/${alchemyKey}`);


export default function DetailedNFT(props) {

    const [nft, setNft] = useState([]);
    
    
    const NFTDetails =  async () =>{
        const nftData = await web3.alchemy.getNftMetadata({
            contractAddress:contractAddress, 
            tokenId:props.match.params.id
        });
        setNft(nftData);
    };
    
    useEffect(() => {
        NFTDetails();
    }, []);
    
  return (
      <>{nft.contract ?
        (<div className="releases">
            
            <div className="release green">
                <div className="card-container">
                <MintedNFTcard
                    image={nft.metadata.image}
                    series="Gloop Series"
                    title={nft.metadata.name}
                    tokenId={parseInt(nft.id.tokenId)}
                    time='1'
                    SelltokenId = {`/sellNFT/${nft.id.tokenId}`}
                />

                <div className="ellipse orange"></div>
                </div>
                <div className="content">
                <h2 className="title">Details</h2>
                <p className="description">
                    Contract Address:  
                    <a href={`https://ropsten.etherscan.io/address/${nft.contract.address}`}>
                        {String(nft.contract.address).substring(0, 6) +
                        "..." +
                        String(nft.contract.address).substring(38)}
                    </a>
                </p>
                <p className="description">
                    Token Id: {parseInt(nft.id.tokenId)}
                </p>
                <p className="description">
                    Token Standard: <span className="text-right">{nft.id.tokenMetadata.tokenType}</span>
                </p>
                <p className="description">
                    Blockchain: Ethereum
                </p>
                <p className="description">
                    Metadata: Centralized
                </p>
                <p className="description">
                    Description: 
                    {nft.metadata.description}
                </p>
                </div>
            </div>
            </div>): <h1>NFT detail Not Found!</h1>}
        
    </>
  );
}
