require("dotenv").config();
const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const signer = provider.getSigner(0);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  [
    "function store(string id, string fileHash, string claimedTime, string name, string description)",
    "function get(string id) view returns (string, uint256, string, string, string)"
  ],
  signer
);

async function storeRecord(id, hash, claimedTime, name, description) {
  const tx = await contract.store(id, hash, claimedTime, name, description);
  await tx.wait();
}

async function getRecord(id) {
  const [fileHash, blockTimestamp, claimedTime, name, description] =
    await contract.get(id);

  return { fileHash, blockTimestamp, claimedTime, name, description };
}

module.exports = { storeRecord, getRecord };