require('dotenv').config();
// react alchemy key
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = require("../contracts/MintNFT.json");

export const contract = ()=>{
    const contract =  new web3.eth.Contract(contractABI.abi, contractAddress);
    return contract;
};

export const WEB3Object = ()=>{
    return web3;
};