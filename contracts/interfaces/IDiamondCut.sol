// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;



import { IDiamond } from "./IDiamond.sol";

interface IDiamondCut is IDiamond {    

    function diamondCut(
        FacetCut[] calldata _diamondCut,
        address _init,
        bytes calldata _calldata
    ) external;    
}
