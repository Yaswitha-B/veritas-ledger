import { keccak256, toUtf8Bytes } from "ethers";

/**
 * Derive a bytes32 certificate ID from a SHA-256 hex hash.
 * Deterministic: same hash always yields the same ID.
 * @param {string} hash  SHA-256 hex digest
 * @returns {string}     0x-prefixed bytes32 keccak256 digest
 */
export function generateId(hash) {
  return keccak256(toUtf8Bytes(hash));
}