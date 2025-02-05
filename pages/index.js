import { useState } from "react";
import { ethers } from "ethers";

const TOKEN_ADDRESS = "0x2ED49c7CfD45018a80651C0D5637a5D42a6948cb";
const REQUIRED_AMOUNT = ethers.utils.parseUnits("500", 18);

export default function Home() {
  const [wallet, setWallet] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Install Coinbase Wallet!");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setWallet(await signer.getAddress());
  }

  async function joinLottery() {
    if (!wallet) {
      alert("Please connect wallet first!");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const tokenContract = new ethers.Contract(
      TOKEN_ADDRESS,
      ["function transfer(address recipient, uint256 amount) returns (bool)"],
      signer
    );

    try {
      const tx = await tokenContract.transfer(process.env.NEXT_PUBLIC_WALLET_OWNER, REQUIRED_AMOUNT);
      await tx.wait();

      await fetch("/api/join", {
        method: "POST",
        body: JSON.stringify({ address: wallet }),
        headers: { "Content-Type": "application/json" }
      });

      alert("You joined the lottery!");
    } catch (error) {
      alert("Transaction failed: " + error.message);
    }
  }

  return (
    <div style={{ backgroundColor: "black", color: "white", textAlign: "center", padding: "50px" }}>
      <h1>Social Draw</h1>
      {wallet ? <p>Connected: {wallet}</p> : <button onClick={connectWallet}>Connect Wallet</button>}
      <button onClick={joinLottery} style={{ marginTop: "20px" }}>Join Lottery</button>
    </div>
  );
}
