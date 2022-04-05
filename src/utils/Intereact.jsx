import { ethers } from 'ethers';
import { pinJSONToIPFS } from './pinata';
import Web3Modal from "web3modal";
import axios from 'axios';
require('dotenv').config();

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const contractABI = require("../contracts/NFTMarketplace.json");
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
};

export  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
};

// The three inputs to our function will be the url of our digital asset, name, and description
export const mintNFT = async(url, name, description) => {

  //error handling
  if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) { 
      return {
      success: false,
      status: "❗Please make sure all fields are completed before minting.",
      }
  }

  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  
  let contract = new ethers.Contract(contractAddress,contractABI.abi,signer);
  
  var Id = await contract.getTokenCount();
  Id = parseInt(Id) + 1;

  //make metadata we want to upload on pinata
  const metadata = new Object();
  metadata.name = name;
  metadata.image = url;
  metadata.description = description;
  metadata.tokenId = Id;

  //make pinata call
  const pinataResponse = await pinJSONToIPFS(metadata);
  if (!pinataResponse.success) {
      return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
      }
  } 
  const tokenURI = pinataResponse.pinataUrl;
  // console.log(tokenURI);

  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();
  // console.log(listingPrice);

  let transaction = await contract.mintNFT(tokenURI, {value:listingPrice});

  await transaction.wait();
  // Router.push("/");
}

export const listNFTForSale = async (tokenId, price) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const nftPrice = ethers.utils.parseUnits(price, 'ether');
  let contract = new ethers.Contract(contractAddress,contractABI.abi,signer);

  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();
  // console.log(listingPrice);

  let transaction = await contract.createMarketItem(tokenId, nftPrice, { value: listingPrice });
  await transaction.wait();

  // console.log(transaction);

}

export const UserbuyingNFT = async (ItemId, price) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  let contract = new ethers.Contract(contractAddress,contractABI.abi,signer);

  // convert wei amount into ether
  const nftPrice = ethers.utils.parseUnits(price.toString(), 'ether');
  // console.log(nftPrice);
  let listingPrice = await contract.getListingPrice();
  

  const toatalAmount = parseFloat(nftPrice) + parseFloat(listingPrice);
  const toatalPayAmount = toatalAmount.toString();

  // console.log(toatalPayAmount);
  const transaction = await contract.createMarketSale(ItemId, {value:toatalPayAmount});
  await transaction.wait();

  // console.log(transaction);
}

export const reselNFT = async (ItemId, price) => {
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();

  const nftPrice = ethers.utils.parseUnits(price, 'ether');
  let contract = new ethers.Contract(contractAddress,contractABI.abi,signer);

  let listingPrice = await contract.getListingPrice();
  listingPrice = listingPrice.toString();
  
  // console.log(ItemId);
  // console.log(price);
  // console.log(listingPrice);

  const transaction = await contract.resellToken(ItemId,nftPrice,{value:listingPrice});
  await transaction.wait();

  // console.log(transaction);
}

// load all unsold nfts
export const loadNFTs= async()=>{
  // const web3modal = new Web3Modal();
  // const connection = await web3modal.connect();
  // const provider = new ethers.providers.Web3Provider(connection);
  // const signer = provider.getSigner();
  const provider = new ethers.providers.AlchemyProvider('ropsten',alchemyKey);

  const contract = await new ethers.Contract(contractAddress,contractABI.abi,provider);

  // const contract = await new web3.eth.Contract(contractABI.abi, contractAddress);
  const data = await contract.fetchMarketItems();


  // const data = await contract.methods.fetchMarketItems().call();
  // console.log(data);
  const items = await Promise.all(data.map(async i=>{
    const tokenUri = await contract.tokenURI(i.tokenId);
    const meta = await axios.get(tokenUri)
      // const nftData = await web3.alchemy.getNftMetadata({
      //   contractAddress:contractAddress, 
      //   tokenId:i.tokenId
      // });
      // const meta = nftData.metadata;
      
      // get price and convert into ether
      // let price = web3.utils.fromWei(i.price, "ether");
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
  return items;
}

// load all my purchased items
export const allMyPurchasedNFT= async()=>{
  const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = await new ethers.Contract(contractAddress,contractABI.abi,signer);

    // const contract = await new web3.eth.Contract(contractABI.abi, contractAddress);
    const data = await contract.fetchMyNFTs();
    // console.log(data);

    // const data = await contract.methods.fetchMyNFTs().call();
    // console.log(data);
    const items = await Promise.all(data.map(async i=>{
      const tokenUri = await contract.tokenURI(i.tokenId);
      const meta = await axios.get(tokenUri)
        // const nftData = await web3.alchemy.getNftMetadata({
        //   contractAddress:contractAddress, 
        //   tokenId:i.tokenId
        // });
        // const meta = nftData.metadata;
        
        // get price and convert into ether
        // let price = web3.utils.fromWei(i.price, "ether");
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

    return items;
}

// load all my created items
export const createdItems = async()=>{
  const web3modal = new Web3Modal();
  const connection = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const contract = await new ethers.Contract(contractAddress,contractABI.abi,signer);

  // const contract = await new web3.eth.Contract(contractABI.abi, contractAddress);
  const data = await contract.fetchItemsListed();
  // console.log(data);

  // const data = await contract.methods.fetchItemsListed().call();
  // console.log(data);
  const items = await Promise.all(data.map(async i=>{
    const tokenUri = await contract.tokenURI(i.tokenId);
    const meta = await axios.get(tokenUri)
      // const nftData = await web3.alchemy.getNftMetadata({
      //   contractAddress:contractAddress, 
      //   tokenId:i.tokenId
      // });
      // const meta = nftData.metadata;
      
      // get price and convert into ether
      // let price = web3.utils.fromWei(i.price, "ether");
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
  return items;
}


// using alchemy web3.js
// // The three inputs to our function will be the url of our digital asset, name, and description
// export const mintNFT = async(url, name, description) => {
//     //error handling
//     if (url.trim() === "" || (name.trim() === "" || description.trim() === "")) { 
//         return {
//         success: false,
//         status: "❗Please make sure all fields are completed before minting.",
//         }
//     }

//   window.contract = await new web3.eth.Contract(contractABI.abi, contractAddress);

//   var Id = await window.contract.methods.getTokenCount().call();
//   Id = parseInt(Id) + 1;

//   //make metadata we want to upload on pinata
//   const metadata = new Object();
//   metadata.name = name;
//   metadata.image = url;
//   metadata.description = description;
//   metadata.tokenId = Id;
  

//   //make pinata call
//   const pinataResponse = await pinJSONToIPFS(metadata);
//   if (!pinataResponse.success) {
//       return {
//           success: false,
//           status: "😢 Something went wrong while uploading your tokenURI.",
//       }
//   } 
//   const tokenURI = pinataResponse.pinataUrl;
  // console.log(tokenURI);
//   // load our smart contract using the Alchemy Web3 API

//   //set up your Ethereum transaction
//     const transactionParameters = {
//         // Required except during contract publications.
//         to: contractAddress, 
//         // must match user's active address.
//         from: window.ethereum.selectedAddress, 
//         //make call to NFT smart contract 
//         'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI()
//     };

    

//     //sign the transaction via Metamask
//     try {
//     const txHash = await window.ethereum
//         .request({
//             method: 'eth_sendTransaction',
//             params: [transactionParameters],
//         });
//     return {
//         success: true,
//         status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
//     }
//     } catch (error) {
//         return {
//             success: false,
//             status: "😥 Something went wrong: " + error.message
//         }

//     }
// }

// export const createSale = async (tokenId, price) => {
//   const MainContract = await new web3.eth.Contract(contractABI.abi, contractAddress);

//   let listingPrice = await MainContract.methods.getListingPrice().call();
//   listingPrice = listingPrice.toString();
//   console.log(listingPrice);

//   const nftPrice = web3.utils.toWei(price,'ether');

//   //set up your Ethereum transaction
//   const transactionParameters = {
//     // Required except during contract publications.
//     to: contractAddress, 
//     // must match user's active address.
//     from: window.ethereum.selectedAddress, 
//     //make call to NFT smart contract 
//     'data': MainContract.methods.createMarketItem(window.ethereum.selectedAddress, tokenId, nftPrice, listingPrice).encodeABI()
//   };

//   //sign the transaction via Metamask
//   try {
//   const txHash = await window.ethereum
//       .request({
//           method: 'eth_sendTransaction',
//           params: [transactionParameters],
//       });
//   return {
//       success: true,
//       status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
//   }
//   } catch (error) {
//       return {
//           success: false,
//           status: "😥 Something went wrong: " + error.message
//       }

//   } 

// }

// export const UserbuyingNFT = async (ItemId, ItemPrice) => {
//   const MainContract = await new web3.eth.Contract(contractABI.abi, contractAddress);

//   let listingPrice = await MainContract.methods.getListingPrice().call();
//   // convert wei amount into ether
//   const NFTPrice = web3.utils.toWei(ItemPrice,'ether');

//   const toatalAmount = parseFloat(NFTPrice) + parseFloat(listingPrice);
//   const toatalPayAmount = toatalAmount.toString();
//   console.log(toatalPayAmount);

  

//   //set up your Ethereum transaction
//   const transactionParameters = {
//     // Required except during contract publications.
//     to: contractAddress, 
//     // must match user's active address.
//     from: window.ethereum.selectedAddress, 
//     //total payment pay for buying this nft
//     'value':toatalPayAmount,
//     //make call to NFT smart contract 
//     'data': MainContract.methods.createMarketSale(window.ethereum.selectedAddress, ItemId, toatalPayAmount).encodeABI()
//   };

//   //sign the transaction via Metamask
//   try {
//   const txHash = await window.ethereum
//       .request({
//           method: 'eth_sendTransaction',
//           params: [transactionParameters],
//       });
//   return {
//       success: true,
//       status: "✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash
//   }
//   } catch (error) {
//       return {
//           success: false,
//           status: "😥 Something went wrong: " + error.message
//       }

//   } 

// }






