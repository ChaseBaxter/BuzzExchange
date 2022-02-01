const Buzzcoin = artifacts.require("Buzzcoin");
const BuzzExchange = artifacts.require("BuzzExchange");

module.exports = async function(deployer) {
    //deploy token
   await deployer.deploy(Buzzcoin); 
    const buzzcoin = await Buzzcoin.deployed()

    //deploy EtherSwap
  await deployer.deploy(BuzzExchange,buzzcoin.address);
  const buzzExchange = await BuzzExchange.deployed()

  //Transfer all the tokens to EtherSwap (1 Millions)
  await buzzcoin.transfer(buzzExchange.address,'1000000000000000000000000')
};
