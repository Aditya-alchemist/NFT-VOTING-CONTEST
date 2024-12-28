import React, { useState, useEffect } from 'react';
import { ethers, BrowserProvider } from 'ethers';
import axios from 'axios';
import "./App.css";

const PINATA_API_KEY = '223553f88ea60420fae4';
const PINATA_SECRET_KEY = '36b531be959f28db2b3a9b8672fe4243dd82ccf518624ebbffd1b5b1280ec78d';
const contractAddress = '0x3b1597EF32B27c223B57ad9ccB1aF38a87A00A55';
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "mintedby",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "tokenID",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tokenURI",
                "type": "string"
            }
        ],
        "name": "NFTMINTED",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "votedby",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votedfor",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "Amountdonated",
                "type": "uint256"
            }
        ],
        "name": "Voted",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "returncurrentrewardpool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "tokenUri",
                "type": "string"
            }
        ],
        "name": "mintnft",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "selectwinner",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sendwinningamount",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllMintedNFTs",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "mintedby",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "tokenuri",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "votes",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenID",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct NFTVOTING.NFTINFO[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "s_tokenidtouri",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "voterinfo",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "Tokenidvotedfor",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "Amountdonated",
                "type": "uint256"
            },
            {
                "internalType": "bool",
                "name": "hasVoted",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "nftinfo",
        "outputs": [
            {
                "internalType": "address",
                "name": "mintedby",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "tokenuri",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "tokenID",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardpool",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]


const App = () => {
    const [walletAddress, setWalletAddress] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [amount, setAmount] = useState(0);
    const [tokenId, setTokenId] = useState(null);
    const [nfts, setNfts] = useState([]);
    const [winner, setWinner] = useState(null);
    const [rewardPool, setRewardPool] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (walletAddress) {
            fetchMintedNFTs();
            fetchRewardPool();
        }
    }, [walletAddress]);

    const connectButton = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            setWalletAddress(await signer.getAddress());
            setError("");
        } catch (err) {
            setError(err.message || "Please install Metamask");
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png') && file.size < 5 * 1024 * 1024) {
            setImage(file);
            setError("");
        } else {
            setError("Invalid file. Only JPEG/PNG under 5MB allowed.");
        }
    };

    const uploadToPinata = async (file) => {
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                },
            });
            const imageUrl = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
            const metadata = {
                name: file.name,
                image: imageUrl,
                description: 'NFT voting contest',
            };
            const metadataRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', metadata, {
                headers: {
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET_KEY,
                },
            });
            return `https://gateway.pinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;
        } catch (err) {
            setError("Upload to Pinata failed.");
            return null;
        } finally {
            setIsUploading(false);
        }
    };

    const mintNFT = async () => {
        if (!image) {
            setError("Please select an image.");
            return;
        }
        try {
            const tokenUri = await uploadToPinata(image);
            if (!tokenUri) return;

            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.mintnft(tokenUri);
            await tx.wait();
            setError("NFT minted successfully!");
            fetchMintedNFTs();
        } catch (err) {
            setError(err.message || "Minting failed.");
        }
    };

    const voteNFT = async () => {
        if (!tokenId || !amount) {
            setError("Please provide Token ID and amount to vote.");
            return;
        }
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.vote(tokenId, ethers.parseEther(amount.toString()), {
                value: ethers.parseEther(amount.toString()),
            });
            await tx.wait();
            setError("Vote cast successfully!");
            fetchMintedNFTs();
            fetchRewardPool();
        } catch (err) {
            setError(err.message || "Voting failed.");
        }
    };

    const fetchRewardPool = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const reward = await contract.returncurrentrewardpool();
            setRewardPool(ethers.formatEther(reward));
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMintedNFTs = async () => {
        try {
            setIsLoading(true);
            const provider = new BrowserProvider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, contractABI, provider);
            const nfts = await contract.getAllMintedNFTs();
            
            // Map over NFTs and fetch metadata for each
            const nftsWithMetadata = await Promise.all(
                nfts.map(async (nft) => {
                    try {
                        // Fetch metadata from IPFS
                        const response = await axios.get(nft.tokenuri);
                        const metadata = response.data;
                        
                        return {
                            tokenId: nft.tokenID.toString(),
                            imageUrl: metadata.image, // Get image URL from metadata
                            votes: nft.votes.toString(),
                            mintedBy: nft.mintedby,
                            name: metadata.name,
                            description: metadata.description
                        };
                    } catch (err) {
                        console.error(`Error fetching metadata for token ${nft.tokenID}:`, err);
                        return {
                            tokenId: nft.tokenID.toString(),
                            imageUrl: nft.tokenuri, // Fallback to tokenuri if metadata fetch fails
                            votes: nft.votes.toString(),
                            mintedBy: nft.mintedby
                        };
                    }
                })
            );
    
            setNfts(nftsWithMetadata);
        } catch (err) {console.error("Error fetching NFTs:", err);
            setError("Failed to fetch NFTs.");
        } finally {
            setIsLoading(false);
        }
    };

    const selectWinner = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const winnerTokenId = await contract.selectwinner();
            setWinner(winnerTokenId.toString());
            setError("Winner selected successfully!");
        } catch (err) {
            alert('only owner can select winner');
            setError(err.message || "Selecting winner failed.");
        }
    };

    const sendWinningAmount = async () => {
        try {
            const provider = new BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            const tx = await contract.sendwinningamount();
            await tx.wait();
            setError("Winning amount sent successfully!");
            fetchRewardPool();
        } catch (err) {
            alert('only owner can send winning amount');
            setError(err.message || "Sending winning amount failed.");
        }
    };
    
    return (
        <div className="app-container">
            <div className="content-wrapper">
                <div className="header">
                    <h1 className="title">NFT Voting Platform</h1>

                    {!walletAddress && (
                        <button 
                            onClick={connectButton} 
                            className="connect-button"
                        >
                            Connect Wallet
                        </button>
                    )}
                </div>

                {walletAddress && (
                    <div className="wallet-section">
                        <div className="wallet-address">
                            <p>{walletAddress}</p>
                        </div>

                        <div className="feature-grid">
                            <div className="card">
                                <h2>Mint NFT</h2>
                                <label>
                                    <span>Upload Image</span>
                                    <input 
                                        type="file" 
                                        onChange={handleFileUpload}
                                        className="file-input"
                                    />
                                </label>
                                <button 
                                    onClick={mintNFT} 
                                    disabled={isUploading}
                                    className="action-button"
                                >
                                    {isUploading ? "Uploading..." : "Mint NFT"}
                                </button>
                            </div>

                            <div className="card">
                                <h2>Vote for NFT</h2>
                                <input 
                                    type="number" 
                                    placeholder="Token ID" 
                                    onChange={(e) => setTokenId(e.target.value)}
                                    className="input-field"
                                />
                                <input 
                                    type="number" 
                                    placeholder="Amount (ETH)" 
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="input-field"
                                />
                                <button 
                                    onClick={voteNFT} 
                                    className="action-button"
                                >
                                    Cast Vote
                                </button>
                            </div>
                        </div>

                        <div className="card">
                            <div className="reward-pool">
                                <h2>Current Reward Pool</h2>
                                <p>{rewardPool} ETH</p>
                            </div>
                            <button 
                                onClick={fetchRewardPool} 
                                className="action-button"
                            >
                                Refresh Pool
                            </button>
                        </div>

                        <div className="card">
                            <div className="gallery-header">
                                <h2>NFT Gallery</h2>
                                <button 
                                    onClick={fetchMintedNFTs} 
                                    className="action-button"
                                >
                                    Refresh Gallery
                                </button>
                            </div>
                            {isLoading ? (
                                <div className="loader"></div>
                            ) : (
                                <div className="gallery-grid">
                                    {nfts.map((nft) => (
                                        <div key={nft.tokenId} className="gallery-item">
                                            <img 
                                                src={nft.imageUrl} 
                                                alt={`NFT ${nft.tokenId}`} 
                                                className="gallery-image"
                                            />
                                            <div className="gallery-info">
                                                <p>Token ID: {nft.tokenId}</p>
                                                <p>Votes: {nft.votes}</p>
                                                <p>Owner: {nft.mintedBy}</p>
                                                {nft.name && <p>{nft.name}</p>}
                                                {nft.description && <p>{nft.description}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card">
                            <h2>Winner Selection</h2>
                            <div className="winner-actions">
                                <button 
                                    onClick={selectWinner} 
                                    className="action-button winner-button"
                                >
                                    Select Winner
                                </button>
                                <button 
                                    onClick={sendWinningAmount} 
                                    className="action-button winner-button"
                                >
                                    Send Prize
                                </button>
                            </div>
                            {winner !== null && (
                                <div className="winner-display">
                                    <p>Winner Token ID: {winner}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};


export default App;