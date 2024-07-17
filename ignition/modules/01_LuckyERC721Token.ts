import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


export default buildModule("LuckyERC721Token", (m) => {
  const contract = m.contract("LuckyERC721Token", []);

  // LuckyERC721Token_transfer
  m.call(
    contract, 
    "safeTransferFrom(address,address,uint256)", 
    [ m.getAccount(0), '0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 666 ],
    { id: "LuckyERC721Token_transfer" }
  );

  return { contract };
});