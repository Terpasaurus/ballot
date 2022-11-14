
import { ethers, Wallet } from "ethers";
import { Ballot, Ballot__factory } from "../typechain-types";
import * as dotenv from 'dotenv';
dotenv.config();

const PROPOSALS = ["Proposal1", "Proposal2", "Proposal3"];

function convertStringArraytoByteArray(array: string[]){
  const byte32array = [];
  for (let index = 0; index < array.length; index++){
    byte32array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return byte32array;
}

async function main(){
    const provider = ethers.getDefaultProvider("goerli", {
      infura: process.env.INFURA_API_KEY,
      etherscan: process.env.ETHERSCAN_API_KEY,
      alchemy: process.env.ALCHEMY_API_KEY,});
    const wallet = ethers.Wallet.fromMnemonic(process.env.MNEMONIC ?? "");
    //const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "");
    const signer = wallet.connect(provider);
    const balanceBN = await signer.getBalance();
    console.log(`Connected to the account of ${signer.address}
    \nThis account has a balance of ${balanceBN.toString()}} Wei`);
    const args = process.argv;
    const proposals = args.slice(2);
    if (proposals.length < 1) throw new Error("not enough arguments")
    console.log("Deploying Ballot contract");
    console.log("Proposals: ");
    proposals.forEach((element, index) => {
      console.log(`Proposal N. ${index + 1}: ${element}`);
    });


    let ballotContract: Ballot;
  //  let accounts: SignerWithAddress[];
  //  accounts = await ethers.getSigners();
    const ballotContractFactory = new Ballot__factory(signer);
    ballotContract = await ballotContractFactory.deploy(
      convertStringArraytoByteArray(proposals));
    await ballotContract.deployed();
    console.log(`The Contract was Deployed at the address ${ballotContract.address}`);
    const chairPerson = await ballotContract.chairperson();
    console.log(`The chairperson for this ballot is ${chairPerson}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});