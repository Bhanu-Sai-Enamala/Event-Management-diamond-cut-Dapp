import web3 from './web3';
import EventFactory from '../artifacts/contracts/facets/CreateEventFacet.sol/CreateEventFacet.json';
import deployedEvents from '../artifacts/contracts/facets/GetDeployedEventsFacet.sol/GetDeployedEventsFacet.json';

const createEventInstance = new web3.eth.Contract(
    EventFactory.abi,
    '0x5DD4D838609dc7f88CA6Fc3c8000A930d66E1A4d'
);

const getDeployedEventsInstance = new web3.eth.Contract(
    deployedEvents.abi,
    '0x5DD4D838609dc7f88CA6Fc3c8000A930d66E1A4d'
);

export { createEventInstance, getDeployedEventsInstance };

