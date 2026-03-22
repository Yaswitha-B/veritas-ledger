// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct Record {
        string  fileHash;   // SHA-256 hex digest of the original file
        uint256 timestamp;  // block.timestamp at the time of storage
        address owner;      // MetaMask account that paid for the transaction
        string  label;      // human-readable description supplied by the user
    }

    mapping(bytes32 => Record) private _records;

    event RecordStored(
        bytes32 indexed id,
        string          fileHash,
        address indexed owner,
        uint256         timestamp,
        string          label
    );

    function store(
        bytes32        id,
        string calldata fileHash,
        string calldata label
    ) external {
        require(bytes(_records[id].fileHash).length == 0, "Record already exists");
        require(bytes(fileHash).length > 0, "fileHash is required");

        _records[id] = Record(fileHash, block.timestamp, msg.sender, label);
        emit RecordStored(id, fileHash, msg.sender, block.timestamp, label);
    }

    function get(bytes32 id)
        external
        view
        returns (
            string  memory fileHash,
            uint256        timestamp,
            address        owner,
            string  memory label
        )
    {
        Record storage r = _records[id];
        require(bytes(r.fileHash).length != 0, "Record not found");
        return (r.fileHash, r.timestamp, r.owner, r.label);
    }

    function exists(bytes32 id) external view returns (bool) {
        return bytes(_records[id].fileHash).length != 0;
    }
}
