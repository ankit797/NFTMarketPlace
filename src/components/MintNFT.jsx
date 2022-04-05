import React from "react";
import { useEffect, useState } from "react";
import { mintNFT } from "../utils/Intereact";
import "../sass/components/_form.scss";
import { Redirect } from "react-router-dom";

const MintNFT = ()=> {


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [status, setStatus] = useState(false);


  useEffect(() => {

  }, [status]);

  const onMintPressed = async () => {
    await mintNFT(url, name, description);
    setStatus(true);
  };
  

  return (
    <>  
      {status ? <Redirect to="/mintednfts" /> : (
        <div className="formContainer">
        <div className="formInput">
        <br></br>
            <h2 id="title">🧙‍♂️ Alchemy NFT Minter</h2>
            
            {/* <p>
                Simply add your asset's link, name, and description, then press "Mint."
            </p> */}
            <form className="form">
                <h3>🖼 Link to asset: </h3>
                <input
                type="text"
                placeholder="Asset Line:- https://gateway.pinata.cloud/ipfs/<hash>"
                onChange={(event) => setURL(event.target.value)}
                />
                <h3>🤔 Name: </h3>
                <input
                type="text"
                placeholder="NFT Name!"
                onChange={(event) => setName(event.target.value)}
                />
                <h3>✍️ Description: </h3>
                <input
                type="text"
                placeholder="Description"
                onChange={(event) => setDescription(event.target.value)}
                />
            </form>
            <div className="buttonContainer">
                <button className="mintButton" onClick={onMintPressed}>
                    List NFT
                </button>
            </div>
        </div>
        </div>
        ) }
    </>
    
  );
}

export default MintNFT;
