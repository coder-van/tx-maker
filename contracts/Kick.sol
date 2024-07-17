// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;


contract Kick {
    address private owner;

    mapping(address => uint256) kickCounter;

    event KickEvent(address sender);

    // constructor() {
    //     // owner = _owner;
    // }
    
    function kick() external {
        kickCounter[msg.sender] ++;
        emit KickEvent(msg.sender);
    }

    
    function kicknum() public view returns (uint256){
        return kickCounter[msg.sender];
    }

    function kicknumOf(address sender) public view returns (uint256){
        return kickCounter[sender];
    }

}