const { expect } = require("chai");
const { ethers, getNamedAccounts, deployments } = require("hardhat");

function hash(account) {
  return Buffer.from(ethers.utils.solidityKeccak256(["address"], [account]).slice(2), "hex");
}

describe("NFTSigningDrop contract", async () => {
  let nftSigningDrop;
  let deployer, signer, luckyBoy, luckyGirl, badBoy;

  before(async () => {
    ({ deployer, signer, luckyBoy, luckyGirl, badBoy } = await getNamedAccounts());

    const d = await deployments.fixture("nft-signing-drop");
    nftSigningDrop = new ethers.Contract(d.NFTSigningDrop.address, d.NFTSigningDrop.abi);

    const nftSigningDropByDeployer = nftSigningDrop.connect(await ethers.getSigner(deployer));
    const signerRole = await nftSigningDropByDeployer.SIGNER_ROLE();
    await nftSigningDropByDeployer.grantRole(signerRole, signer);
  });

  it("bad boy mint", async () => {
    const badBoySigner = await ethers.getSigner(badBoy);
    const badSignature = await badBoySigner.signMessage(hash(badBoy));
    const nftSigningDropByBadBoy = await nftSigningDrop.connect(badBoySigner);
    await expect(nftSigningDropByBadBoy.mintWithSignature(badSignature)).to.be.reverted;
  });

  it("lucky boy mint", async () => {
    const mintSigner = await ethers.getSigner(signer);
    const goodSignature = await mintSigner.signMessage(hash(luckyBoy));
    const nftSigningDropByLuckyBoy = await nftSigningDrop.connect(await ethers.getSigner(luckyBoy));
    await nftSigningDropByLuckyBoy.mintWithSignature(goodSignature);
  });

  it("mint with others good signature", async () => {
    const mintSigner = await ethers.getSigner(signer);
    const goodSignature = await mintSigner.signMessage(hash(luckyBoy));
    const nftSigningDropByLuckyGirl = await nftSigningDrop.connect(await ethers.getSigner(luckyGirl));
    await expect(nftSigningDropByLuckyGirl.mintWithSignature(goodSignature)).to.be.reverted;
  });
});
