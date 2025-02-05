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
  const [message, setMessage] = useState("");
  
  // Fungsi untuk menginisiasi provider dan kontrak tidak digunakan secara langsung di halaman ini
  // Karena interaksi token akan dilakukan di API atau sesuai kebutuhan.
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
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

  // Fungsi joinLottery yang memanggil API untuk menyimpan data peserta ke GitHub
  const joinLottery = async () => {
    if (!account) {
      setMessage("Please connect your wallet first.");
      return;
    }
    try {
      const response = await fetch('/api/joinLottery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address: account })
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "Error joining lottery.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error joining lottery.");
    }
  };

  const drawWinner = () => {
    // Fitur drawWinner pada halaman utama masih berupa simulasi.
    setMessage("Feature not implemented on client side. Use backend or smart contract for secure drawing.");
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
        <p>{message}</p>
      </main>
    </div>
  );
}
