import logo from './logo.svg';
import './App.css';
import { Connection, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getParsedNftAccountsByOwner, isValidSolanaAddress, createConnectionConfig, } from "@nfteyez/sol-rayz";
import React, { useEffect, useState } from 'react';
import axios from "axios";

const App = () => {

  const [nftData, setNftData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);


  useEffect(() => {
    console.log("working controller");
  });

  const getNFT = async (event) => {
    event.preventDefault();
    console.log("third method calling");
    getNftTokenData();
  }


  const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
      }
    }
  };

  const getNftTokenData = async () => {
    console.log("Method Calling");
    try {

      const connectData = new Connection(clusterApiUrl("devnet"));
      console.log("Connection is ", connectData);

      const connect = createConnectionConfig(clusterApiUrl("devnet"));
      console.log("connecting url is", connect);
      const provider = getProvider();
      console.log("provider is", provider);
      let ownerToken = new PublicKey("35CB6WNzbNCPY2yD337jr87n6U6M6RvGkLANDwHdxdeY");
      console.log("public key  is", ownerToken);
      const result = isValidSolanaAddress(ownerToken);
      console.log("result", result);
      const nfts = await getParsedNftAccountsByOwner({
        publicAddress: ownerToken,
        connection: connect,
        serialization: true,
      });

      console.log("nft is", nfts);

      let nftData = nfts;
      var data = Object.keys(nftData).map((key) => nftData[key]);
      let arr = [];
      let n = data.length;
      for (let i = 0; i < n; i++) {
        console.log(data[i].data.uri);
        let val = await axios.get(data[i].data.uri);
        val.mintKey = data[i].mint;
        arr.push(val);
      }
      console.log(arr);
      setNftData(arr);
      setLoading(true);
      console.log("process completed");

    } catch (error) {
      console.log(error);
    }
  };

  const selectImage = (event, data) => {
    event.preventDefault();
    console.log(data);
    setMintAddress(data.mintKey);
    setWalletAddress("35CB6WNzbNCPY2yD337jr87n6U6M6RvGkLANDwHdxdeY");
  }
  return (
    <div >
      <button onClick={(event) => { getNFT(event) }}>Get NFT</button>
      <section className="nft mt-2 my-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-12">
              <h4 className="title">NFT</h4>
            </div>
          </div>
          <div className="row  d-flex justify-content-center">
            {loading ? (
              <>
                {nftData &&
                  nftData.length > 0 &&
                  nftData.map((val, ind) => {
                    return (
                      <div className="col-4 mt-3" key={ind}>
                        <div className="cart text-center">
                          <div className="img mt-4 pt-3">
                            <img src={val.data.image} alt="loading..." height="200px" width="200px" />
                            <input type="checkbox" id={ind+"check"} onClick={(event) => { selectImage(event, val) }} />
                            <br />{"Mint Address " + mintAddress}<br />
                            {"Wallet Address " + walletAddress}<br />
                            <p className="mt-1">{val.data.name}</p>
                            <h6 className=" mt-2">
                              {val.data.description}
                            </h6>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </>
            ) : (
              <>
                <p className="text-center">loading...</p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
