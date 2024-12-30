# NFT Minting and Voting DApp

This is a decentralized application (DApp) built with React that allows users to mint NFTs by uploading images, vote for their favorite NFTs, and select a winner. The images are uploaded to IPFS via Pinata, and the metadata is stored on the blockchain using a smart contract.

## Features

- Connect to MetaMask wallet
- Upload and validate image files
- Upload images to IPFS via Pinata
- Mint NFTs using a smart contract
- Vote for minted NFTs
- Select and reward the winner

- ## Smart Contract Functions

### Public Functions

- **mintnft(string tokenUri)**
  - Mints a new NFT and stores metadata on IPFS.
  - Payable function.

- **vote(uint256 tokenId, uint256 amount)**
  - Votes for a specific NFT by donating ETH.
  - Payable function.

- **selectwinner()**
  - Returns the ID of the NFT with the highest votes.

- **sendwinningamount()**
  - Sends the reward pool to the winner's address.

### View Functions

- **returncurrentrewardpool()**
  - Retrieves the current reward pool amount.

- **getAllMintedNFTs()**
  - Returns all minted NFTs with their details (owner, votes, token URI).

- **voterinfo(address)**
  - Provides voting details for a specific user.

- **rewardpool()**
  - Displays the total reward pool.
 

## Frontend Features

### Wallet Connection

- Allows users to connect their Ethereum wallet using MetaMask.

### File Upload

- Validates and uploads NFT images (JPEG/PNG, max size 5MB).

### Live Countdown Timer

- Displays remaining time for voting.

### Error Handling

- Displays messages for invalid actions or errors (e.g., incorrect file type).

### Data Fetching

- Automatically fetches all minted NFTs and the reward pool upon wallet connection.



## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and npm installed
- MetaMask installed in your browser
- Pinata account and API keys

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Aditya41205/NFT-MINTING.git
   cd NFT-MINTING

2. Install the dependencies:
   ```sh
   npm install
   
3. Configuration
 Create a .env file in the root directory and add your Pinata API credentials:
```sh
REACT_APP_PINATA_API_KEY=your_pinata_api_key
REACT_APP_PINATA_SECRET_KEY=your_pinata_secret_key

```
4 Running the App
Start the development server:
```sh
npm start

```
## Usage

1. Connect your MetaMask wallet by clicking the "Connect Wallet" button.
2. Upload a valid PNG or JPEG image under 5MB.
3. Click "Mint NFT" to upload the image to IPFS and mint an NFT.
4. Enter the Token ID and amount to vote for an NFT and click "Vote".
5. Click "Select Winner" to select a winner (only accessible by the contract owner).
6. Click "Send Winning Amount" to send the reward to the winner (only accessible by the contract owner).

 6 License
 
This project is licensed under the MIT License.

https://github.com/user-attachments/assets/2e9579a3-d82f-43ed-8bf5-e4a897bcee89

## Acknowledgements

- [React](https://reactjs.org/)
- [Ethers.js](https://docs.ethers.io/v5/)
- [Pinata](https://www.pinata.cloud/)
- [OpenZeppelin](https://openzeppelin.com/)


## More updates
Stay tuned more updated are underway to make nft minting process gasless





