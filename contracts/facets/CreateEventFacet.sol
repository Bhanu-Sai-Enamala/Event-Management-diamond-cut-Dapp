// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "../libraries/LibDiamond.sol";
import "../libraries/Event.sol";


contract CreateEventFacet {
    event EventCreated(address indexed eventAddress, string name, uint ticketPrice);

    function createEvent(string memory name, uint ticketPrice, uint ticketSupply) public {
        address newEvent = address(new Event(name, ticketPrice, ticketSupply, msg.sender));
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();
        ds.deployedEvents.push(newEvent);
        emit EventCreated(newEvent, name, ticketPrice);
    }
}
