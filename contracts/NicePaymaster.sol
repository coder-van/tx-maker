// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

/* solhint-disable reason-string */
/* solhint-disable no-inline-assembly */

import "../interfaces/IPaymaster.sol";


contract NicePaymaster is IPaymaster {
    bytes4 public constant MAGIC_VALUE_SENDER = 0xbf45c166;
    bytes4 public constant MAGIC_VALUE_PAYMASTER = 0xe0e6183a;
    uint256 public constant MAX_CONTEXT_SIZE = 65536;
    // constructor() {
    // }
    event PostOp(bool success, uint256 actualGasCost, bytes context);

    struct ValidationData {
        address aggregator;
        uint48 validAfter;
        uint48 validUntil;
    }

    function _packValidationData(
        // address sender,
        uint48 validUntil,
        uint48 validAfter
    ) pure private returns (uint256) {
        // return bytes32(MAGIC_VALUE_PAYMASTER) | bytes32(uint256(validUntil)) << 48 | bytes32(uint256(validAfter)); // bytes32
        return
            (uint256(uint32(MAGIC_VALUE_PAYMASTER)  ) << (96 + 128)) |
            // (uint256(uint160(sender)) << 12) |
            (uint256(validUntil) << 48) |
            (uint256(validAfter));
    }

    function validatePaymasterTransaction(uint256 version, bytes32 txHash, bytes calldata trx) external returns (uint256 validationData, bytes memory context){
        (version, txHash);
        return (_packValidationData(0, 0), trx[:10]);
    }
  
    function postPaymasterTransaction(bool success, uint256 actualGasCost, bytes calldata context) external{
        emit PostOp(success, actualGasCost, context);
    }

    receive() external payable {}
}
