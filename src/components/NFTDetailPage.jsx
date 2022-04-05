import React, { useEffect, useState } from "react";
import Card from "./Card";
const {ethers} = require('ethers');


require('dotenv').config();
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require("../contracts/NFTMarketplace.json");

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(`https://eth-ropsten.alchemyapi.io/v2/${alchemyKey}`);

export default function NFTDetailPage(props) {

    const [nft, setNft] = useState([]);
    
    const NFTDetails =  async () =>{
        const provider = new ethers.providers.AlchemyProvider('ropsten',alchemyKey);
        const contract = await new ethers.Contract(contractAddress,contractABI.abi,provider);

        
        // const MainContract = await new web3.eth.Contract(contractABI.abi, contractAddress);
        // const items = await MainContract.methods.fetchMarketItems().call();
        const ItemId =parseInt(props.match.params.id);
        const i = await contract.fetchItem(ItemId);
        const nftData = await web3.alchemy.getNftMetadata({
            contractAddress:contractAddress, 
            tokenId:i.tokenId
        });

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            ItemId:i.ItemId.toNumber(),
            price:price,
            tokenId:i.tokenId.toNumber(),
            seller:i.seller,
            owner: i.owner,
            image: nftData.metadata.image,
            name: nftData.metadata.name,
            description: nftData.metadata.description,
            contractAddress:nftData.contract.address,
            tokenType: nftData.id.tokenMetadata.tokenType
        }
        setNft(item);
    
    };
    
    useEffect(() => {
        NFTDetails();
    }, []);
    
  return (
      <>
      {nft.ItemId ?
        (<div className="releases">
            
            <div className="release green">
                <div className="card-container">
                <Card
                    image={nft.image}
                    series="Gloop Series"
                    title={nft.name}
                    price={nft.price}
                    tag={nft.tokenId}
                    time='1'
                />

                <div className="ellipse orange"></div>
                </div>
                <div className="content">
                <h2 className="title">Details</h2>
                <p className="description">
                    Contract Address:  
                    <a href={`https://ropsten.etherscan.io/address/${nft.contractAddress}`}>
                        {String(nft.contractAddress).substring(0, 6) +
                        "..." +
                        String(nft.contractAddress).substring(38)}
                    </a>
                </p>
                <p className="description">
                    Token Id: {nft.tokenId}
                </p>
                <p className="description">
                    Token Standard: <span className="text-right">{nft.tokenType}</span>
                </p>
                <p className="description">
                    Blockchain: Ethereum
                </p>
                <p className="description">
                    Metadata: Centralized
                </p>
                <p className="description">
                    Description: 
                    {nft.description}
                </p>
                </div>
            </div>
            </div>): <h1>NFT detail Not Found!</h1>}
        
    </>
  );
}
