// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0;

interface IAccount {
    /**
     * https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7560.md
     * Validate user's signature and nonce
     * the entryPoint will make the call to the recipient only if this validation call returns successfully.
     * signature failure should be reported by returning SIG_VALIDATION_FAILED (1).
     * This allows making a "simulation call" without a valid signature
     * Other failures (e.g. nonce mismatch, or invalid signature format) should still revert to signal failure.
     *
     * @param version              - The version default 1.
     * @param txHash               - Transaction hash.
     * @param transaction          - RIP7560 txdata format https://github.com/ethereum/RIPs/blob/master/RIPS/rip-7560.md.
     * @return validationData       - Packaged ValidationData structure. use `_packValidationData` and
     *                              `_unpackValidationData` to encode and decode.
     *                              <20-byte> sigAuthorizer - sender address, default MAGIC_VALUE_SENDER when failure, not revert
     *                              <6-byte> validUntil - Last timestamp this operation is valid. 0 for "indefinite"
     *                              <6-byte> validAfter - First timestamp this operation is valid
     *                              
     *                              Note that the validation code cannot use block.timestamp (or block.number) directly.
     */
    function validateTransaction(
        uint256 version, 
        bytes32 txHash, 
        bytes calldata transaction) external returns (uint256 validationData);
}
