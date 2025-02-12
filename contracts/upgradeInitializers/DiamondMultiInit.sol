// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;


import { LibDiamond } from "../libraries/LibDiamond.sol";

error AddressAndCalldataLengthDoNotMatch(uint256 _addressesLength, uint256 _calldataLength);

contract DiamondMultiInit {    


    function multiInit(address[] calldata _addresses, bytes[] calldata _calldata) external {        
        if(_addresses.length != _calldata.length) {
            revert AddressAndCalldataLengthDoNotMatch(_addresses.length, _calldata.length);
        }
        for(uint i; i < _addresses.length; i++) {
            LibDiamond.initializeDiamondCut(_addresses[i], _calldata[i]);            
        }
    }
}
