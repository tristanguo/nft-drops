// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

contract NFTSigningDrop is ERC721, AccessControl {
  bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
  mapping(address => bool) private _minted;
  uint256 private _count = 0;

  constructor() ERC721("NFTSigningDrop", "NFTD") {
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
    return super.supportsInterface(interfaceId);
  }

  function mintWithSignature(bytes calldata signature) public {
    require(!_minted[_msgSender()], "already minted");

    bytes32 digest = ECDSA.toEthSignedMessageHash(keccak256(abi.encodePacked(_msgSender())));
    require(verify(digest, signature), "invalid signature");

    _mint(_msgSender(), _count);
    _count++;
  }

  function verify(bytes32 digest, bytes memory signature) private view returns (bool) {
    address signer = ECDSA.recover(digest, signature);
    return hasRole(SIGNER_ROLE, signer);
  }
}
