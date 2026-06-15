// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MatDAO_IPNFT
 * @dev ERC-721 NFT representing validated material science research IP with legal binding
 * Mints NFTs with IPFS metadata containing AI validation scores and legal agreement hashes
 */
contract MatDAO_IPNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Mapping to track original researcher for each token
    mapping(uint256 => address) public originalResearcher;
    
    // Maps Token ID to the SHA-256 hash of the physical Intellectual Property Assignment Agreement (IPAA)
    mapping(uint256 => bytes32) public legalAgreementHashes;
    
    // Struct to track active enterprise sub-licenses (e.g., SCG, DuPont)
    struct IndustrialLicense {
        address licensee;
        uint256 expirationBlock;
        bytes32 licenseTermsHash; 
    }
    mapping(uint256 => IndustrialLicense[]) public activeLicenses;
    
    // Event emitted when a new IP-NFT is minted
    event IPNFTMinted(
        uint256 indexed tokenId, 
        address indexed researcher, 
        string tokenURI,
        bytes32 legalHash
    );
    
    // Event emitted when a corporate license is registered
    event CorporateLicenseRegistered(
        uint256 indexed tokenId,
        address indexed licensee,
        uint256 expirationBlock,
        bytes32 licenseTermsHash
    );

    constructor() ERC721("MatDAO IP-NFT", "MATDAO-IP") Ownable(msg.sender) {
        _nextTokenId = 1;
    }

    /**
     * @dev Mint a new IP-NFT for a researcher with legal binding
     * @param researcher The address of the researcher
     * @param _tokenURI The IPFS URI pointing to the metadata
     * @param _legalHash The SHA-256 hash of the legal agreement document
     * @return tokenId The ID of the newly minted token
     */
    function mintIP(
        address researcher, 
        string memory _tokenURI,
        bytes32 _legalHash
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId;
        
        _safeMint(researcher, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        originalResearcher[tokenId] = researcher;
        legalAgreementHashes[tokenId] = _legalHash;
        
        _nextTokenId++;
        
        emit IPNFTMinted(tokenId, researcher, _tokenURI, _legalHash);
        
        return tokenId;
    }

    /**
     * @dev Register a corporate license for an IP-NFT (admin only)
     * @param tokenId The ID of the IP-NFT
     * @param licensee The address of the enterprise licensee
     * @param durationBlocks The duration of the license in blocks
     * @param licenseTermsHash The hash of the license terms document
     */
    function registerCorporateLicense(
        uint256 tokenId, 
        address licensee, 
        uint256 durationBlocks, 
        bytes32 licenseTermsHash
    ) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(licensee != address(0), "Invalid licensee address");
        require(durationBlocks > 0, "Duration must be positive");
        
        activeLicenses[tokenId].push(IndustrialLicense({
            licensee: licensee,
            expirationBlock: block.number + durationBlocks,
            licenseTermsHash: licenseTermsHash
        }));
        
        emit CorporateLicenseRegistered(tokenId, licensee, block.number + durationBlocks, licenseTermsHash);
    }

    /**
     * @dev Get all active licenses for a token
     * @param tokenId The ID of the IP-NFT
     */
    function getActiveLicenses(uint256 tokenId) external view returns (
        address[] memory licensees,
        uint256[] memory expirationBlocks,
        bytes32[] memory licenseTermsHashes
    ) {
        IndustrialLicense[] memory licenses = activeLicenses[tokenId];
        uint256 count = licenses.length;
        
        licensees = new address[](count);
        expirationBlocks = new uint256[](count);
        licenseTermsHashes = new bytes32[](count);
        
        for (uint256 i = 0; i < count; i++) {
            licensees[i] = licenses[i].licensee;
            expirationBlocks[i] = licenses[i].expirationBlock;
            licenseTermsHashes[i] = licenses[i].licenseTermsHash;
        }
    }

    /**
     * @dev Get the total number of minted tokens
     */
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    /**
     * @dev Get the next token ID to be minted
     */
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
}
