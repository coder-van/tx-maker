import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


export default buildModule("LuckyERC1155Token", (m) => {
  const contract = m.contract("LuckyERC1155Token", []);

  // LuckyERC1155Token _transfer
  // mint(address account, uint256 id, uint256 amount, bytes memory data)
  // safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes calldata data) external;
  m.call(
    contract, 
    "mint", 
    [ m.getAccount(0), 666, 100, '0x11'],
    { id: "LuckyERC1155Token_mint" }
  );

  m.call(
    contract, 
    "safeTransferFrom", 
    [ m.getAccount(0), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 666, 1, '0x11'],
    { id: "LuckyERC1155Token_transfer" }
  );

  return { contract };
});