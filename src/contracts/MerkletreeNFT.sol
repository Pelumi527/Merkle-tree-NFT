//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TheoNFT is ERC721URIStorage, Ownable, Pausable, ReentrancyGuard{

    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string public baseExtension = ".json";
    string public baseURI;
    string public notRevealedUri;
    bytes32 constant root = 0x679e2bbabd15e576870cb3c4ec3c35e65633912666ce3d48afe8b5f2cb0bca28;
    
    uint public maxSupply = 1000;
    uint public maxPublicAmount = 5;
    uint public price = 0.001 ether;

    bool public presale;
    bool isRevealed;

    mapping(address => bool) public isVerified;
    mapping(address => uint) isAllowedToMintInPresale;
    mapping(address => uint) maxMintable;
    mapping(address => uint) preSaleMaxMintAmount;
    mapping(address => uint) presaleMinted;

   


    constructor(string memory name, string memory symbol, string memory initRevealedURI, string memory _newBaseURI) ERC721(name,symbol){
        setNotRevealedURI(initRevealedURI);
        setBaseURI(_newBaseURI);
        for(_tokenIds.current(); _tokenIds.current() < 100; _tokenIds.increment()){
            _safeMint(_msgSender(), _tokenIds.current());
        }
    }


    function mint(uint mintAmount) public payable whenNotPaused() nonReentrant() {
        require(_tokenIds.current() <= maxSupply, "Max amount of NFT minted");
        if(presale == true){
            require(isVerified[msg.sender ] == true,"You are not eligible for presale");
            require(mintAmount <= preSaleMaxMintAmount[msg.sender],"You are not eligible to mint this number of NFT");

            presaleMinted[msg.sender] = presaleMinted[msg.sender] + mintAmount;
            require(presaleMinted[msg.sender] <= preSaleMaxMintAmount[msg.sender], "You cannot mint more than eligible");
            for(uint i = 1; i <= mintAmount; i++ ){
               _safeMint(_msgSender(), _tokenIds.current());
               _tokenIds.increment(); 
            }

        }

        if(presale == false){
            uint amount = price * mintAmount;

            require(msg.value >= amount,"inSufficient Funds");
            require(mintAmount <= maxPublicAmount,"cannot mint more than the amount");

            maxMintable[msg.sender] = maxMintable[msg.sender] + mintAmount;

            require(maxMintable[msg.sender] <= maxPublicAmount,"You cannot mint more than the max NFT allowed");

            for(uint i = 1; i <= mintAmount; i++ ){
               _safeMint(_msgSender(), _tokenIds.current());
               _tokenIds.increment();
            }
            
        }
    }

    function verification(bytes32[] memory proof, bytes32 leaf, uint maxMintAmount) whenNotPaused() nonReentrant() public {
        bool verified= MerkleProof.verify(proof, root, leaf);
        isVerified[msg.sender] = verified;
        preSaleMaxMintAmount[msg.sender] = maxMintAmount;
    }



    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (isRevealed == false) {
            return notRevealedUri;
        }

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function reveal() public onlyOwner() returns(bool){
        isRevealed = true;
        return true;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setNotRevealedURI(string memory _notRevealedURI) internal onlyOwner{
        notRevealedUri = _notRevealedURI;
    }

    function totalMinted() public view returns(uint){
        return _tokenIds.current();
    }

    function startPresale() public onlyOwner returns(bool){
        presale = true;
        return presale;
    }

    function stopPresale() public onlyOwner returns(bool){
        presale = false;
        return presale;
    }

    function whiteListAddress(address _address) public onlyOwner() returns(bool){
        isVerified[_address] = true;
        return true;
    }

    function pause() public onlyOwner() returns(bool) {
        _pause();
        return true;
    }

    function unPaused() public onlyOwner() returns(bool) {
        _unpause();
        return true;
    }

    function setPrice(uint _newPrice ) public onlyOwner returns(bool){
        price = _newPrice;
        return true;
    }

    function withdraw() public onlyOwner() returns (bool) {
        uint amount = address(this).balance;
       payable(msg.sender).transfer(amount);
       return true;
    }
} 