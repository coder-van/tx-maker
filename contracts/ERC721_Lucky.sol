// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity >=0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract LuckyERC721Token is ERC721 {
    constructor() ERC721("LuckyERC721Token", "LT721") {
        _safeMint(msg.sender, 666);
    }
}