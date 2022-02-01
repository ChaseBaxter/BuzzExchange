pragma solidity ^0.5.0;

import "./Buzzcoin.sol";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
contract BuzzExchange{
    string public name="Buzz Coin Exchange";
    Buzzcoin public buzzcoin;
    uint public rate=100;

    event BuzzcoinsPurchased(
        address account,
        address buzzcoin,
        uint amount,
        uint rate
    );

    event BuzzcoinsSold(
        address account,
        address buzzcoin,
        uint amount,
        uint rate
    );

    constructor(Buzzcoin _buzzcoin) public {
        buzzcoin = _buzzcoin;
    }

    function buyBuzzcoins() public payable {
        // Calculate the number of tokens to buy
        uint buzzcoinAmount = msg.value * rate;
        buzzcoin.transfer(msg.sender,buzzcoinAmount);

         // Require that EthSwap has enough buzzcoins
      require(buzzcoin.balanceOf(address(this)) >= buzzcoinAmount);

        //Emit an event
        emit BuzzcoinsPurchased(msg.sender,address(buzzcoin),buzzcoinAmount, rate);
    }
}