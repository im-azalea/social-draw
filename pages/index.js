// pages/index.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x2ED49c7CfD45018a80651C0D5637a5D42a6948cb";
const OWNER_WALLET = "0x702C14376cC18CaC83A0589440455a88Dce46f3f";
// ABI minimal untuk token (misalnya, balanceOf dan transfer)
const tokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

export default function Home() {
  const [account, setAccount] = useState("");
  const [participants, setParticipants] = useState([]);
  const [winner, setWinner] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const prov = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(prov);
      const cont = new ethers.Contract(CONTRACT_ADDRESS, tokenABI, prov.getSigner());
      setContract(cont);
    } else {
      setMessage("Please install MetaMask.");
    }
  }, []);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setMessage("Wallet connected: " + accounts[0]);
    } catch (error) {
      console.error(error);
      setMessage("Error connecting wallet.");
    }
  };

  // Fungsi simulasi join lottery
  const joinLottery = async () => {
    if (!contract) {
      setMessage("Contract not loaded");
      return;
    }
    if (!account) {
      setMessage("Please connect your wallet first.");
      return;
    }
    try {
      // Untuk demo: menambahkan alamat wallet ke array peserta.
      // Di implementasi nyata, Anda akan memanggil fungsi transfer atau
      // melakukan validasi transaksi token sebesar 500 $SOCIAL.
      setParticipants([...participants, account]);
      setMessage("You have joined the lottery!");
    } catch (error) {
      console.error(error);
      setMessage("Error joining lottery.");
    }
  };

  const drawWinner = () => {
    if (participants.length === 0) {
      setMessage("No participants to draw from.");
      return;
    }
    // Pemilihan pemenang secara random
    const randomIndex = Math.floor(Math.random() * participants.length);
    const selectedWinner = participants[randomIndex];
    setWinner(selectedWinner);
    setMessage("Winner drawn: " + selectedWinner);
    // Di implementasi nyata, setelah pemenang dipilih, distribusi token harus dilakukan:
    // 95% ke pemenang dan 5% tersisa di OWNER_WALLET.
  };

  return (
    <div style={{
      backgroundColor: 'black',
      color: 'white',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <header>
        {/* Ganti URL di bawah dengan direct link dari logo yang Anda inginkan */}
        <img 
          src="https://i.imgur.com/BQ7W9Ev.png" 
          alt="SOCIAL DRAW Logo" 
          style={{ width: '150px', height: 'auto', marginBottom: '1rem' }} 
        />
        <h1>SOCIAL DRAW</h1>
      </header>
      <main>
        {account ? (
          <p>Connected wallet: {account}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
        <div style={{ margin: '2rem' }}>
          <button onClick={joinLottery}>Join Lottery (Cost: 500 $SOCIAL)</button>
        </div>
        <div style={{ margin: '2rem' }}>
          <button onClick={drawWinner}>Draw Winner</button>
        </div>
        {winner && <h2>Winner: {winner}</h2>}
        <p>{message}</p>
      </main>
    </div>
  );
}
