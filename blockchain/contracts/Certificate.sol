// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Certificate {
    struct Record {
        string fileHash;
        uint256 blockTimestamp;
        string claimedTime;
        string name;
        string description;
    }

    mapping(string => Record) public records;

    function store(
        string memory id,
        string memory fileHash,
        string memory claimedTime,
        string memory name,
        string memory description
    ) public {
        records[id] = Record(
            fileHash,
            block.timestamp,
            claimedTime,
            name,
            description
        );
    }

    function get(string memory id)
        public
        view
        returns (
            string memory,
            uint256,
            string memory,
            string memory,
            string memory
        )
    {
        Record memory r = records[id];
        return (
            r.fileHash,
            r.blockTimestamp,
            r.claimedTime,
            r.name,
            r.description
        );
    }
}