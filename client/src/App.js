import React, { useState, useEffect } from "react";
import getContract from "./getWeb3";
import Web3 from 'web3';
import "./App.css";

import Navbar from "./components/Navbar";
import MarketPlace from "./contracts/MarketPlace.json";

const baseUrl = "https://ipfs.infura.io/ipfs/";

const App = () => {

  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({
    name: '',
    price: 0
  });

  const handleChange = (e) => {
    setProduct(prev => ({
      ...prev, [e.target.name]: e.target.value
    }))
  }
  useEffect(() => {
    let connect = async () => {
      await connectToMetaMask();
    }
    connect()
  }, [])

  const create = async (e) => {
    e.preventDefault();
    try {
      await contract.methods.createProduct(product.name, Number(product.price)).send({ from: accounts });
    } catch (error) {
      console.log(error);
    }
  }

  const purchase = async (id, price) => {
    try {
      let pc = web3.utils.toWei(String(price), "Ether");
      console.log(pc)
      await contract.methods.purchaseProduct(Number(id)).send({ from: accounts, value: price });
    } catch (error) {
      console.log(error);
    }
  }


  const connectToMetaMask = async () => {
    if (typeof window !== undefined && typeof window.ethereum !== undefined) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        let web3 = new Web3(window.ethereum);
        let accounts = await web3.eth.getAccounts();
        const contract = await getContract(web3, MarketPlace);
        const name = await contract.contract.methods.name().call();
        const productCount = await contract.contract.methods.productCount().call();
        for (let i = 1; i < productCount; i++) {
          let pd = await contract.contract.methods.products(i).call();
          setProducts(prev => ([...prev, pd]));
        }

        setName(name);
        setWeb3(web3);
        setContract(contract.contract);
        setAccounts(accounts[0]);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.error("Please install Meta Mask")
    }
  }
  console.log(products);
  return (
    <>
      <Navbar address={accounts} NavText={name} />
      {/* form */}
      <form className="bg-light card card-body w-50 mx-auto mt-5" onSubmit={create}>
        <input type="text" placeholder="Product Name" className="form-control mb-2" onChange={handleChange} value={product.name} name="name" />
        <input type="number" placeholder="Product Price" name="price" className="form-control mb-2" onChange={handleChange} value={product.price} />
        <button className="btn btn-dark btn-block">Create</button>
      </form>
      {/* form ends */}
      {/* product list */}
      <div className="bg-light card card-body w-50 mx-auto mt-3">
        <ul className="list-group">
          {
            products.map(product => (<li className="list-group-item d-flex justify-content-between align-items-center" key={product.id}>
              <p className="d-flex flex-column">
                <span className="lead">Name : {product.name}</span>
                <small className="text-muted">Price : {product.price} ETH</small>

              </p>
              {product.owner !== accounts && <button className="btn btn-dark" onClick={() => purchase(product.id, product.price)}>Purchase</button>}
            </li>))
          }
        </ul>
      </div>
      {/* product list */}
    </>
  );
}


export default App;

