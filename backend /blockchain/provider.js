require("dotenv").config();

const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = provider.getSigner(0);

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const ABI = [
  "function store(string memory _hash) public",
  "function verify(string memory _hash) public view returns (bool)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

async function anchorProof(hash) {
  const tx = await contract.store(hash);
  await tx.wait();
}

async function verifyProof(hash) {
  return await contract.verify(hash);
}

module.exports = {
  anchorProof,
  verifyProof
};