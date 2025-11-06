// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title SimpleRegistry - Anchor de hash-uri / CID cu roluri
/// @notice Păstrează dovezi (bytes32 / CID) și emite evenimente indexate pentru audit
contract SimpleRegistry is AccessControl {
    bytes32 public constant RELAYER_ROLE = keccak256("RELAYER_ROLE");

    struct Registration {
        address reporter;
        uint256 timestamp;
        string ipfsCid; // optional — cost în storage; alternativ ținem doar event
    }

    mapping(bytes32 => Registration) public registrations;
    event HashRegistered(bytes32 indexed h, address indexed reporter, string ipfsCid, uint256 timestamp);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(RELAYER_ROLE, admin);
    }

    /// @notice Înregistrează un hash (bytes32) - apelabil de oricine
    function register(bytes32 h, string calldata ipfsCid) external {
        require(registrations[h].timestamp == 0, "already registered");
        registrations[h] = Registration({ reporter: msg.sender, timestamp: block.timestamp, ipfsCid: ipfsCid });
        emit HashRegistered(h, msg.sender, ipfsCid, block.timestamp);
    }

    /// @notice Înregistrează on-chain în numele unui reporter (folosit de relayer)
    function registerByRelayer(bytes32 h, address reporter, string calldata ipfsCid) external onlyRole(RELAYER_ROLE) {
        require(registrations[h].timestamp == 0, "already registered");
        registrations[h] = Registration({ reporter: reporter, timestamp: block.timestamp, ipfsCid: ipfsCid });
        emit HashRegistered(h, reporter, ipfsCid, block.timestamp);
    }

    function isRegistered(bytes32 h) external view returns (bool) {
        return registrations[h].timestamp != 0;
    }
}