// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MiToken is ERC20 {
    constructor() ERC20("TokenPago", "TKP") {
        // Le asignamos 1 millón de tokens a la billetera que despliega el contrato
        _mint(msg.sender, 1000000 * 10 ** decimals()); 
    }
}