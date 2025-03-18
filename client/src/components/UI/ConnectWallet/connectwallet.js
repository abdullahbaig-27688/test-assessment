

//This is BlockChain Part connecting wallet button
import { useState } from "react";
import { ethers } from "ethers";
import "./connectwallet.css"
export default function ConnectWallet() {
    const [walletAddress, setWalletAddress] = useState("");

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await window.ethereum.request({ method: "eth_requestAccounts" });
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                setWalletAddress(address);
            } catch (error) {
                console.error("Error connecting to MetaMask:", error);
            }
        } else {
            alert("MetaMask is not installed. Please install MetaMask to connect.");
        }
    };

    return (
        <div className="button">
            <button 
                className="wallet"
                onClick={connectWallet}
            >
                {walletAddress ? "Connected" : "Connect Wallet"}
            </button>
            {walletAddress && (
                <p className="mt-2 text-gray-600">Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            )}
        </div>
    );
}
