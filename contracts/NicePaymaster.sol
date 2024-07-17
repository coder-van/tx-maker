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
        uint48 validUntil,
        uint48 validAfter
    ) pure private returns (uint256) {
        return
            uint32(MAGIC_VALUE_PAYMASTER) |
            (uint256(validUntil) << 160) |
            (uint256(validAfter) << (160 + 48));
    }

    function validatePaymasterTransaction(uint256 version, bytes32 txHash, bytes calldata trx) external returns (bytes memory context, uint256 validationData){
        (version, txHash);
        return (trx[:10], _packValidationData(type(uint48).max, 0));
    }
  
    function postPaymasterTransaction(bool success, uint256 actualGasCost, bytes calldata context) external{
        emit PostOp(success, actualGasCost, context);
    }

    receive() external payable {}
}
