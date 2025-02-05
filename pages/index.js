// pages/index.js
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";

// Data kontrak (sesuai kebutuhan)
const CONTRACT_ADDRESS = "0x2ED49c7CfD45018a80651C0D5637a5D42a6948cb";
const OWNER_WALLET = "0x702C14376cC18CaC83A0589440455a88Dce46f3f";
// ABI minimal sebagai contoh (jika diperlukan)
const tokenABI = [
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)"
];

export default function Home() {
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");

  // Cek apakah ada injected provider (misalnya, dari Coinbase Wallet in-app browser)
  useEffect(() => {
    if (typeof window.ethereum === 'undefined') {
      setMessage("No injected wallet found. You can use Coinbase Wallet app or WalletConnect.");
    }
  }, []);

  // Fungsi untuk menghubungkan wallet
  const connectWallet = async () => {
    try {
      let provider;
      // Jika ada window.ethereum (misal, dibuka lewat in-app browser Coinbase Wallet)
      if (typeof window.ethereum !== "undefined") {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
      } else {
        // Jika tidak ada, gunakan WalletConnect
        const walletConnectProvider = new WalletConnectProvider({
          rpc: {
            // Ganti dengan URL RPC yang valid; contoh: menggunakan Infura untuk Mainnet
            1: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID"
          },
          qrcode: true,
        });
        await walletConnectProvider.enable();
        provider = new ethers.providers.Web3Provider(walletConnectProvider);
      }
      const accounts = await provider.listAccounts();
      if (accounts.length === 0) {
        setMessage("No accounts found.");
      } else {
        setAccount(accounts[0]);
        setMessage("Wallet connected: " + accounts[0]);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting wallet.");
    }
  };

  // Fungsi untuk Join Lottery, memanggil API Route
  const joinLottery = async () => {
    if (!account) {
      setMessage("Please connect your wallet first.");
      return;
    }
    try {
      const response = await fetch('/api/joinLottery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  // Fungsi untuk Draw Winner, memanggil API Route
  const drawWinner = async () => {
    try {
      const response = await fetch('/api/drawWinner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(`Winner: ${data.winner}`);
      } else {
        setMessage(data.message || "Error drawing winner.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error drawing winner.");
    }
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
