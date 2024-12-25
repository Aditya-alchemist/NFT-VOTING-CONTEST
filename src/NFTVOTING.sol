// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTVOTING is ERC721, Ownable, ReentrancyGuard {

    struct NFTINFO {
        address mintedby;
        string tokenuri;
        uint256 votes;
        uint256 tokenID;
    }

    struct Voter {
        uint256 Tokenidvotedfor;
        uint256 Amountdonated;
        bool hasVoted;
    }

    event NFTMINTED(address indexed mintedby, uint256 tokenID, string tokenURI);
    event Voted(address indexed votedby, uint256 votedfor, uint256 Amountdonated);

    uint256 public rewardpool;
    uint256 public mintingfees = 0.01 ether;
    uint256 private s_tokencounter;

    mapping(uint256 => string) public s_tokenidtouri;
    mapping(address => Voter) public voterinfo;
    mapping(uint256 => NFTINFO) public nftinfo;

    constructor() ERC721("NFTPHOTOCONTEST", "NPC") Ownable() {
        s_tokencounter = 0;
    }

    function mintnft(string memory tokenUri) public payable {
        require(msg.value >= mintingfees, "Not sufficient ether to mint NFT");

        s_tokenidtouri[s_tokencounter] = tokenUri;
        _safeMint(msg.sender, s_tokencounter);

        rewardpool += msg.value;

        NFTINFO storage nftinformation = nftinfo[s_tokencounter];
        nftinformation.mintedby = msg.sender;
        nftinformation.tokenID = s_tokencounter;
        nftinformation.tokenuri = tokenUri;
        nftinformation.votes = 0;

        emit NFTMINTED(msg.sender, s_tokencounter, tokenUri);
        s_tokencounter++;
    }

    function vote(uint256 tokenId, uint256 amount) public payable {
        require(tokenId < s_tokencounter, "Token does not exist");
        require(msg.value == amount, "Incorrect amount sent");

        Voter storage voterinformation = voterinfo[msg.sender];
        require(!voterinformation.hasVoted, "You have already voted");

        NFTINFO storage nft = nftinfo[tokenId];
        nft.votes += 1;

        voterinformation.Tokenidvotedfor = tokenId;
        voterinformation.Amountdonated += amount;
        voterinformation.hasVoted = true;

        rewardpool += amount;

        emit Voted(msg.sender, tokenId, amount);
    }

    function selectwinner() public view onlyOwner returns (uint256) {
        require(s_tokencounter > 0, "No NFTs minted");

        uint256 highestVotes = 0;
        uint256 winningToken = 0;

        for (uint256 i = 0; i < s_tokencounter; i++) {
            if (nftinfo[i].votes > highestVotes) {
                highestVotes = nftinfo[i].votes;
                winningToken = i;
            }
        }

        return winningToken;
    }

    function sendwinningamount() public nonReentrant onlyOwner {
        uint256 winningTokenId = selectwinner();
        NFTINFO memory winningNFT = nftinfo[winningTokenId];

        uint256 commission = (rewardpool * 5) / 100;
        uint256 rewardToNFT = rewardpool - commission;

        rewardpool = 0;

        (bool success,) = winningNFT.mintedby.call{value: rewardToNFT}("");
        require(success, "Reward transfer to winner failed");

        (bool sent,) = owner().call{value: commission}("");
        require(sent, "Commission transfer to owner failed");
    }

  
}
