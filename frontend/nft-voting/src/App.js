// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import axios from 'axios';

// Assuming these components are in a './components' folder
// If not, you might need to create them or adjust the import paths.
const Layout = ({ children }) => <div className="container mx-auto p-4">{children}</div>;
const Navbar = ({ address, onConnect, onDisconnect }) => (
    <nav className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg">
        <h1 className="text-xl font-bold">NFTVoter</h1>
        {address ? (
            <div>
                <span className="mr-4">{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</span>
                <button onClick={onDisconnect} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Disconnect
                </button>
            </div>
        ) : (
            <button onClick={onConnect} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Connect Wallet
            </button>
        )}
    </nav>
);

const NFTCard = ({ tokenId, name, image, owner, votes, onVote, onDetails }) => (
    <div className="card-neo border-2 border-black rounded-lg p-4 shadow-neo-sm bg-white">
        <img src={image} alt={name} className="w-full h-48 object-cover rounded-md mb-4" onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/EEE/31343C?text=Image+Not+Found'; }} />
        <h3 className="text-lg font-bold">{name}</h3>
        <p className="text-sm text-gray-600 truncate">Owner: {owner}</p>
        <p className="text-md font-semibold">Votes: {votes}</p>
        <div className="flex justify-between mt-4 gap-2">
            <button onClick={onVote} className="btn-neo flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Vote</button>
            <button onClick={onDetails} className="btn-neo flex-1 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">Details</button>
        </div>
    </div>
);

const Leaderboard = ({ items }) => (
    <div className="card-neo border-2 border-black rounded-lg p-4 shadow-neo-sm bg-white">
        <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
        <ol className="list-decimal list-inside">
            {items.map((item, index) => (
                <li key={item.tokenId} className="mb-2 p-2 rounded-md bg-gray-100 flex justify-between">
                    <span>{index + 1}. {item.name} (Token #{item.tokenId})</span>
                    <span className="font-bold">{item.votes} Votes</span>
                </li>
            ))}
        </ol>
    </div>
);


// ====== CONFIG ======
const PINATA_API_KEY = '223553f88ea60420fae4';
const PINATA_SECRET_KEY = '36b531be959f28db2b3a9b8672fe4243dd82ccf518624ebbffd1b5b1280ec78d';
const CONTRACT_ADDRESS = '0x3b1597EF32B27c223B57ad9ccB1aF38a87A00A55';
// FIX: Copied the full ABI from oldApp.js
const CONTRACT_ABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "mintedby", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "tokenID", "type": "uint256" }, { "indexed": false, "internalType": "string", "name": "tokenURI", "type": "string" }], "name": "NFTMINTED", "type": "event" },
    { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "votedby", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "votedfor", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "Amountdonated", "type": "uint256" }], "name": "Voted", "type": "event" },
    { "inputs": [], "name": "returncurrentrewardpool", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "string", "name": "tokenUri", "type": "string" }], "name": "mintnft", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "vote", "outputs": [], "stateMutability": "payable", "type": "function" },
    { "inputs": [], "name": "selectwinner", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "sendwinningamount", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
    { "inputs": [], "name": "getAllMintedNFTs", "outputs": [{ "components": [{ "internalType": "address", "name": "mintedby", "type": "address" }, { "internalType": "string", "name": "tokenuri", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }, { "internalType": "uint256", "name": "tokenID", "type": "uint256" }], "internalType": "struct NFTVOTING.NFTINFO[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "s_tokenidtouri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "voterinfo", "outputs": [{ "internalType": "uint256", "name": "Tokenidvotedfor", "type": "uint256" }, { "internalType": "uint256", "name": "Amountdonated", "type": "uint256" }, { "internalType": "bool", "name": "hasVoted", "type": "bool" }], "stateMutability": "view", "type": "function" },
    { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "nftinfo", "outputs": [{ "internalType": "address", "name": "mintedby", "type": "address" }, { "internalType": "string", "name": "tokenuri", "type": "string" }, { "internalType": "uint256", "name": "votes", "type": "uint256" }, { "internalType": "uint256", "name": "tokenID", "type": "uint256" }], "stateMutability": "view", "type": "function" },
    { "inputs": [], "name": "rewardpool", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }
];


export default function App() {
  const [address, setAddress] = useState(null);
  const [nfts, setNfts] = useState([]);
  const [file, setFile] = useState(null);
  const [nftName, setNftName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [amount, setAmount] = useState('');
  const [rewardPool, setRewardPool] = useState(0);
  const [winner, setWinner] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loadingNFTs, setLoadingNFTs] = useState(false);

  // ====== CONNECT WALLET ======
  async function handleConnect() {
    // Clear previous messages on new connection attempt
    setError('');
    setMessage('');
    if (typeof window.ethereum === 'undefined') {
        setError('Please install MetaMask to use this application.');
        return;
    }
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request account access
      const signer = await provider.getSigner();
      setAddress(await signer.getAddress());
    } catch (err) {
      setError(err.message || 'Failed to connect wallet. Please try again.');
    }
  }

  function handleDisconnect() {
    setAddress(null);
    setNfts([]);
    setRewardPool(0);
    setMessage('Wallet disconnected.');
  }

  // ====== FILE UPLOAD ======
  function handleFileChange(e) {
    const f = e.target.files[0];
    if (f && (f.type === 'image/jpeg' || f.type === 'image/png') && f.size < 5 * 1024 * 1024) {
      setFile(f);
      setError('');
    } else {
      setFile(null);
      setError('Invalid file. Only JPEG/PNG under 5MB allowed.');
    }
  }

  // ====== PINATA UPLOAD ======
  async function uploadToPinata(fileToUpload) {
    setIsUploading(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      const fileRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
      });
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${fileRes.data.IpfsHash}`;
      const metadata = {
        name: nftName || fileToUpload.name,
        image: imageUrl,
        description: 'NFT voting contest submission',
      };
      const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
      });
      return `https://gateway.pinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;
    } catch (err) {
      setError('Upload to Pinata failed. Please check your API keys and network connection.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }
  
  // ====== FETCH NFTS ======
  // FIX: Wrapped in useCallback to stabilize the function reference
  const fetchNFTs = useCallback(async () => {
    if (!address) return;
    setLoadingNFTs(true);
    setError('');
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const nftList = await contract.getAllMintedNFTs();
      
      const withMetadata = await Promise.all(
        nftList.map(async (n) => {
          try {
            const metaRes = await axios.get(n.tokenuri.replace('gateway.pinata.cloud', 'ipfs.io'));
            return {
              tokenId: n.tokenID.toString(),
              name: metaRes.data.name,
              image: metaRes.data.image.replace('gateway.pinata.cloud', 'ipfs.io'),
              owner: n.mintedby,
              votes: ethers.formatEther(n.votes), // Assuming votes are in wei
              description: metaRes.data.description,
            };
          } catch (e) {
            // Fallback for failed metadata fetch
            return {
              tokenId: n.tokenID.toString(),
              name: 'Unknown NFT',
              image: 'https://placehold.co/600x400/EEE/31343C?text=Metadata+Error',
              owner: n.mintedby,
              votes: ethers.formatEther(n.votes),
            };
          }
        })
      );
      setNfts(withMetadata);
    } catch (err) {
      setError('Failed to fetch NFTs. Please check the contract address and your network.');
    } finally {
      setLoadingNFTs(false);
    }
  }, [address]); // This function depends on the user's address

  // ====== FETCH REWARD POOL ======
  // FIX: Wrapped in useCallback to stabilize the function reference
  const fetchRewardPool = useCallback(async () => {
    if (!address) return;
    try {
      const provider = new BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const reward = await contract.returncurrentrewardpool();
      setRewardPool(ethers.formatEther(reward));
    } catch (err) {
        console.error("Could not fetch reward pool:", err);
    }
  }, [address]); // This function also depends on the user's address

  // ====== MINT NFT ======
  async function mintNFT() {
    if (!file) {
      setError('Please select an image to mint.');
      return;
    }
    setMessage('Uploading to IPFS...');
    try {
      const tokenUri = await uploadToPinata(file);
      if (!tokenUri) return;

      setMessage('Minting NFT... Please approve the transaction in your wallet.');
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      const tx = await contract.mintnft(tokenUri);
      await tx.wait();
      
      await fetchNFTs();
      setMessage('NFT minted successfully!');
      setFile(null);
      setNftName('');
    } catch (err) {
      setError(err.reason || err.message || 'Minting failed. The transaction may have been rejected.');
    }
  }

  // ====== VOTE ======
  async function onVote(tokenId) {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount to vote.');
      return;
    }
    setMessage('');
    setError('');
    try {
      setMessage(`Voting for Token #${tokenId}... Please approve the transaction.`);
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.vote(tokenId, ethers.parseEther(amount), {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      
      await fetchNFTs();
      await fetchRewardPool();
      setMessage('Vote cast successfully!');
      setAmount('');
    } catch (err) {
      setError(err.reason || err.message || 'Voting failed. You may have already voted or the transaction was rejected.');
    }
  }

  // ====== WINNER FUNCTIONS ======
  async function selectWinner() {
    setMessage('');
    setError('');
    try {
      setMessage('Selecting winner... Please approve the transaction.');
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const winId = await contract.selectwinner();
      setWinner(winId.toString());
      setMessage(`Winner selected! Token ID: ${winId.toString()}`);
    } catch (err) {
      setError(err.reason || err.message || 'Selecting winner failed. This can only be done by the contract owner.');
    }
  }

  async function sendWinningAmount() {
    setMessage('');
    setError('');
    try {
      setMessage('Sending prize... Please approve the transaction.');
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.sendwinningamount();
      await tx.wait();
      
      await fetchRewardPool();
      setMessage('Winning prize sent successfully!');
    } catch (err) {
      setError(err.reason || err.message || 'Sending prize failed. This can only be done by the contract owner after a winner is selected.');
    }
  }

  // ====== LOAD DATA WHEN CONNECTED ======
  useEffect(() => {
    if (address) {
      fetchNFTs();
      fetchRewardPool();
    }
    // FIX: Added fetchNFTs and fetchRewardPool to the dependency array
  }, [address, fetchNFTs, fetchRewardPool]);
  
  // Create a sorted list for the leaderboard
  const leaderboard = [...nfts].sort((a, b) => parseFloat(b.votes) - parseFloat(a.votes));

  return (
    <Layout>
      <Navbar address={address} onConnect={handleConnect} onDisconnect={handleDisconnect} />

      <main className="mt-8 space-y-8">
        <section id="hero">
          <div className="card-neo flex flex-col md:flex-row justify-between items-center gap-5 p-6 border-2 border-black rounded-lg shadow-neo-md bg-yellow-300">
            <div>
              <h1 className="text-4xl font-bold">NFT Voting Contest</h1>
              <p className="text-gray-700 mt-2">Mint your NFT, cast your vote, and win the prize pool!</p>
            </div>
            <div>
              <button className="btn-neo bg-black text-white font-bold py-3 px-6 rounded-lg border-2 border-black shadow-neo-sm hover:shadow-none transition-shadow" onClick={() => document.getElementById('grid').scrollIntoView({ behavior: 'smooth' })}>
                Browse NFTs
              </button>
            </div>
          </div>
        </section>

        {address && (
            <>
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Minting and Voting Section */}
                    <section id="actions" className="space-y-8">
                        <div className="card-neo p-6 border-2 border-black rounded-lg shadow-neo-sm bg-white">
                            <h2 className="text-2xl font-bold mb-4">1. Mint your NFT</h2>
                            <div className="flex flex-col gap-4">
                                <input className="input-neo p-3 border-2 border-black rounded-md" placeholder="NFT Name (e.g. Cool Cat)" value={nftName} onChange={(e) => setNftName(e.target.value)} />
                                <input className="input-neo p-2 border-2 border-black rounded-md" type="file" accept="image/png, image/jpeg" onChange={handleFileChange} />
                                <button className="btn-neo bg-blue-500 text-white font-bold py-3 px-6 rounded-lg border-2 border-black shadow-neo-sm hover:bg-blue-600 disabled:bg-gray-400" onClick={mintNFT} disabled={isUploading || !file}>
                                {isUploading ? 'Uploading...' : 'Mint NFT'}
                                </button>
                            </div>
                        </div>

                        <div className="card-neo p-6 border-2 border-black rounded-lg shadow-neo-sm bg-white">
                            <h2 className="text-2xl font-bold mb-4">2. Vote for an NFT</h2>
                            <p className="text-sm mb-2 text-gray-600">Enter an amount and click 'Vote' on any NFT in the gallery.</p>
                            <input className="input-neo w-full p-3 border-2 border-black rounded-md" type="number" placeholder="Amount in ETH (e.g., 0.01)" value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </div>
                    </section>

                    {/* Leaderboard and Admin Section */}
                    <section id="status" className="space-y-8">
                        <Leaderboard items={leaderboard.slice(0, 5)} />
                        <div className="card-neo p-6 border-2 border-black rounded-lg shadow-neo-sm bg-white">
                            <h2 className="text-2xl font-bold mb-2">Reward Pool: {rewardPool} ETH</h2>
                            <button className="btn-neo w-full bg-gray-200 font-bold py-2 px-4 rounded-lg border-2 border-black shadow-neo-sm hover:bg-gray-300" onClick={fetchRewardPool}>Refresh</button>
                        </div>
                         <div className="card-neo p-6 border-2 border-black rounded-lg shadow-neo-sm bg-red-200">
                            <h2 className="text-2xl font-bold mb-4">Owner Actions</h2>
                            <div className="flex gap-4">
                                <button className="btn-neo flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg border-2 border-black shadow-neo-sm hover:bg-red-600" onClick={selectWinner}>Select Winner</button>
                                <button className="btn-neo flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg border-2 border-black shadow-neo-sm hover:bg-red-600" onClick={sendWinningAmount}>Send Prize</button>
                            </div>
                            {winner && <p className="mt-4 font-bold text-center">Winner Token ID: {winner}</p>}
                        </div>
                    </section>
                </div>

                {/* Messages and Errors */}
                {error && (
                    <div className="card-neo p-4 border-2 border-black rounded-lg bg-red-400 text-black font-bold text-center">
                        <p>Error: {error}</p>
                    </div>
                )}
                {message && (
                    <div className="card-neo p-4 border-2 border-black rounded-lg bg-green-400 text-black font-bold text-center">
                        <p>{message}</p>
                    </div>
                )}

                <section id="grid">
                    <h2 className="text-3xl font-bold mb-6">NFT Gallery</h2>
                    {loadingNFTs ? <p className="text-center">Loading NFTs...</p> : (
                        nfts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {nfts.map(n => (
                                <NFTCard
                                    key={n.tokenId}
                                    tokenId={n.tokenId}
                                    name={n.name}
                                    image={n.image}
                                    owner={n.owner}
                                    votes={n.votes}
                                    onVote={() => onVote(n.tokenId)}
                                    onDetails={() => alert(`Token ID: ${n.tokenId}\nOwner: ${n.owner}\nDescription: ${n.description || 'N/A'}`)}
                                />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500">No NFTs have been minted yet. Be the first!</p>
                        )
                    )}
                </section>
            </>
        )}

        {!address && (
            <div className="text-center p-10 border-2 border-dashed border-black rounded-lg bg-gray-50">
                <h2 className="text-2xl font-bold">Please connect your wallet to continue.</h2>
                <p className="text-gray-600 mt-2">Connect your wallet to mint, vote, and see the gallery.</p>
            </div>
        )}
      </main>
    </Layout>
  );
}
