import './App.css';
import Upload from "./artifacts/contracts/Lock.sol/Upload.json";
import { useState, useEffect } from "react";
const ethers = require("ethers");
import FileUpload from './components/FileUpload';
import Display from './components/Display';
import Modal from './components/Modal';

// npx hardhat node -> npx hardhat run --network localhost scripts/deploy.js

function App() {

  const [account, setAccount] = useState("");
  const [contract, setContract] = useState();
  const [provider, setProvider] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = ethers.providers.Web3Provider(window.ethereum);

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });
        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send('eth_requestAccounts', []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(contractAddress, Upload.abi, signer)
        console.log(contract);
        setContract(contract);
        setProvider(provider);
      } else {
        alert("metamask is not installed");
      }
    }
    provider && loadProvider();
  }, [])

  return (
    <div className='App'>
      {
        modalOpen ?
        <Modal setModalOpen={setModalOpen} contract={contract} />
        :
        <>
        <button className='share' onClick={() => setModalOpen(true)}>Share</button>
        </>
      }
      <h1 style={{ color: 'white' }}>Gdrive 3.0</h1>
      <div className='bg'></div>
      <div className='bg bg2'></div>
      <div className='bg bg3'></div>

      <p style={{ color: "white" }}>Account : {account ? account : "Not Connected"}</p>
      <FileUpload account={account} provider={provider} contract={contract} />
      <Display account={account} contract={contract} />
    </div>
  );
}

export default App;
