import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal1", "Proposal2", "Proposal3"];

function convertStringArraytoByteArray(array: string[]){
  const byte32array = [];
  for (let index = 0; index < array.length; index++){
    byte32array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return byte32array;
}


describe("Ballot", async () => {
  let ballotContract: Ballot;
  let accounts: SignerWithAddress[];
beforeEach(async () => {
    accounts = await ethers.getSigners();
    const ballotContractFactory = await ethers.getContractFactory("Ballot");
    ballotContract = await ballotContractFactory.deploy(
      convertStringArraytoByteArray(PROPOSALS));
      await ballotContract.deployed();
    });


    describe("when the contract is deployed", function () {
      it("has the provided proposals", async function () {
        for (let index = 0; index < PROPOSALS.length; index++) {
          const proposal = await ballotContract.proposals(index);
          expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
            PROPOSALS[index]
          );
        }
      });
  });
  it("sets the deployer address as chaiperson", async () => {
    const chairPerson = await ballotContract.chairperson();
    expect(chairPerson).to.eq(accounts[0].address);
  });
  it("sets the voting weight for the chairperson at 1", async () => {
    const chairpersonVoter = await ballotContract.voters(accounts[0].address);
    //expect(chairpersonVoter.weight).to.be(1);
  });
});
