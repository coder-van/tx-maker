// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.20;

// import "./PackedUserOperation.sol";

/**
 * The interface exposed by a paymaster contract, who agrees to pay the gas for user's operations.
 * A paymaster must hold a stake to cover the required entrypoint stake and also the gas for the transaction.
 */
interface IPaymaster {
    enum PostOpMode {
        // User op succeeded.
        opSucceeded,
        // User op reverted. Still has to pay for gas.
        opReverted,
        // Only used internally in the EntryPoint (cleanup after postOp reverts). Never calling paymaster with this value
        postOpReverted
    }

    /**
     * Payment validation: check if paymaster agrees to pay.
     * Must verify sender is the entryPoint.
     * Revert to reject this request.
     * Note that bundlers will reject this method if it changes the state, unless the paymaster is trusted (whitelisted).
     * The paymaster pre-pays using its deposit, and receive back a refund after the postOp method returns.
     * @param version         - The version default 1.
     * @param txHash          - Hash of the tx.
     * @param transaction     - abi encode transaction data.
     * @return context         - context
     * @return validationData - abi.encodePacked(MAGIC_VALUE_SENDER, validUntil, validAfter)
     */
    function validatePaymasterTransaction(uint256 version, bytes32 txHash, bytes calldata transaction) external returns (bytes memory context, uint256 validationData);


    /**
     * Post-operation handler.
     * Must verify sender is the entryPoint.
     * @param success       - is exection  success
     * @param context       -  payment validation returned 
     * @param actualGasCost - actual amount by tx exection (without this postOp call).
     */
    function postPaymasterTransaction(bool success, uint256 actualGasCost, bytes calldata context) external;
}
