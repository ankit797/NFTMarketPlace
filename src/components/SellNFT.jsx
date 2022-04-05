import React from "react";
import { useEffect, useState } from "react";
import { listNFTForSale } from "../utils/Intereact";
import "../sass/components/_form.scss";
import { Redirect } from "react-router-dom";

const SellNFT = (props)=> {

  const [price, setPrice] = useState("");
  const [status, setStatus] = useState(false);


  useEffect(() => {


  }, []);

  const onSellPressed = async () => {
    const tokenId = props.match.params.id;
    await listNFTForSale(tokenId, price);
    setStatus(true);
  };


  return (
    <>{status ? <Redirect to="/allunsoldnfts" /> : (  
      <div className="formContainer">
        <div className="formInput">

            <br></br>
            <h2 id="title">🧙‍♂️ Alchemy NFT Minter</h2>
            
            {/* <p>
                Simply add your asset's link, name, and description, then press "Mint."
            </p> */}
            <form className="form">
                <h3>NFT Price </h3>
                <input
                
                placeholder="Enter NFT Price"
                onChange={(event) => setPrice(event.target.value)}
                />
                
            </form>
            <div className="buttonContainer">
                <button className="mintButton" onClick={onSellPressed}>
                    Sell NFT
                </button>
            </div>
            
        </div>
        </div>
    )}
    </>
    
  );
}

export default SellNFT;
