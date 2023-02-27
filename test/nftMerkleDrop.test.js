const { expect } = require("chai");
const { ethers, getNamedAccounts, deployments } = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");

function hash(account) {
  return Buffer.from(ethers.utils.solidityKeccak256(["address"], [account]).slice(2), "hex");
}

function createMerkleTree(addresses) {
  return new MerkleTree(
    addresses.map((a) => hash(a)),
    keccak256,
    { sortPairs: true }
  );
}

describe("NFTMerkleDrop contract", async () => {
  let nftMerkleDrop;
  let deployer, luckyBoy, luckyGirl, badBoy;
  let merkleTree;

  before(async () => {
    ({ deployer, luckyBoy, luckyGirl, badBoy } = await getNamedAccounts());

    const d = await deployments.fixture("nft-merkle-drop");
    nftMerkleDrop = new ethers.Contract(d.NFTMerkleDrop.address, d.NFTMerkleDrop.abi, await ethers.getSigner(deployer));

    merkleTree = createMerkleTree([luckyBoy, luckyGirl]);
    await nftMerkleDrop.setMerkleRoot(merkleTree.getHexRoot());
  });

  it("luck boy mint", async () => {
    let nftMerkleDropByLuckyBoy = await nftMerkleDrop.connect(await ethers.getSigner(luckyBoy));
    let proof = merkleTree.getHexProof(hash(luckyBoy));

    let v = merkleTree.verify(proof, hash(luckyBoy), merkleTree.getHexRoot());

    await nftMerkleDropByLuckyBoy.mintWithProof(proof);
  });
});
