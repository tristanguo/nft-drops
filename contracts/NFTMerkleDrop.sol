// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "hardhat/console.sol";

contract NFTMerkleDrop is ERC721, Ownable {
  bytes32 private _merkleRoot;
  mapping(address => bool) private _minted;
  uint256 private _count = 0;

  constructor() ERC721("NFTMerkleDrop", "NMD") {}

  function setMerkleRoot(bytes32 merkleRoot) public onlyOwner {
    _merkleRoot = merkleRoot;
  }

  function mintWithProof(bytes32[] memory proof) public {
    require(!_minted[_msgSender()], "already minted");

    bytes32 leaf = keccak256(abi.encodePacked(_msgSender()));
    require(MerkleProof.verify(proof, _merkleRoot, leaf), "Not in merkle tree");

    _mint(_msgSender(), _count);
    _count++;
  }
}
