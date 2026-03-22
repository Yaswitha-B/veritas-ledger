import { ethers } from "ethers";

const ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

// ABI in sync with blockchain/contracts/Certificate.sol
const ABI = [
  "function store(bytes32 id, string fileHash, string label) external",
  "function get(bytes32 id) external view returns (string fileHash, uint256 timestamp, address owner, string label)",
  "function exists(bytes32 id) external view returns (bool)",
];

function assertConfig() {
  if (!ADDRESS || ADDRESS === "0xYourDeployedContractAddress") {
    throw new Error(
      "Contract address not set. Add VITE_CONTRACT_ADDRESS to your .env " +
        "and run: truffle migrate --reset"
    );
  }
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
}

async function getProvider() {
  assertConfig();
  return new ethers.BrowserProvider(window.ethereum);
}

async function getSigner() {
  const provider = await getProvider();
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

/**
 * Return a raw Contract instance.
 * @param {boolean} write  true = signer (write), false = provider (read-only)
 */
export async function getContract(write = false) {
  if (write) {
    const signer = await getSigner();
    return new ethers.Contract(ADDRESS, ABI, signer);
  }
  const provider = await getProvider();
  return new ethers.Contract(ADDRESS, ABI, provider);
}

/**
 * Safe store wrapper:
 *  1. Pre-checks for duplicate ID with exists() so we get a clean error
 *     instead of an opaque estimateGas revert from Ganache.
 *  2. Parses all known error shapes into human-readable messages.
 *
 * @param {string} id     bytes32 certificate ID (0x-prefixed)
 * @param {string} hash   SHA-256 hex digest
 * @param {string} label  human-readable description
 * @returns {Promise<ethers.ContractTransactionReceipt>}
 */
export async function storeRecord(id, hash, label) {
  const readContract  = await getContract(false);
  const writeContract = await getContract(true);

  // Pre-check: avoid the opaque estimateGas revert on duplicate records
  const alreadyExists = await readContract.exists(id);
  if (alreadyExists) {
    throw new Error(
      `This file has already been certified.\nCertificate ID: ${id}`
    );
  }

  let tx;
  try {
    tx = await writeContract.store(id, hash, label);
  } catch (err) {
    throw parseContractError(err);
  }

  let receipt;
  try {
    receipt = await tx.wait();
  } catch (err) {
    throw parseContractError(err);
  }

  return receipt;
}

/**
 * Convert the opaque ethers CALL_EXCEPTION into a readable message.
 * Handles the "missing revert data" Ganache quirk, standard Error(string)
 * ABI encoding, ABI mismatch hints, and MetaMask rejection.
 */
function parseContractError(err) {
  const msg = err?.message ?? String(err);

  // Ethers v6 exposes the decoded revert reason directly when available
  if (err?.reason) return new Error(err.reason);

  // Attempt to decode a standard Error(string) revert from raw data
  const rawData = err?.data ?? err?.revert?.args?.[0];
  if (typeof rawData === "string" && rawData.startsWith("0x08c379a0")) {
    try {
      const [decoded] = ethers.AbiCoder.defaultAbiCoder().decode(
        ["string"],
        "0x" + rawData.slice(10)
      );
      return new Error(decoded);
    } catch { /* fall through */ }
  }

  // Ganache/estimateGas opaque revert — most likely ABI mismatch or duplicate
  if (msg.includes("estimateGas") || msg.includes("CALL_EXCEPTION")) {
    return new Error(
      "Transaction reverted. Possible causes:\n" +
        "1. Redeploy required — the contract needs the label parameter. " +
        "Run: truffle migrate --reset and update VITE_CONTRACT_ADDRESS.\n" +
        "2. This file may have already been certified."
    );
  }

  // MetaMask user rejection
  if (msg.includes("user rejected") || err?.code === 4001) {
    return new Error("Transaction cancelled in MetaMask.");
  }

  return new Error(msg);
}