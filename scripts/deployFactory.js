const { getSelectors, FacetCutAction } = require('./libraries/diamond.js')

async function main() {
    const { ethers } = require("hardhat");
    const accounts = await ethers.getSigners();
    const contractOwner = accounts[0];
    const eventCutNames = [
        'CreateEventFacet',
        'GetDeployedEventsFacet'
    ];
    const eventFacetCuts =[];
    for ( const FacetName of eventCutNames) {
        const Facet = await ethers.getContractFactory(FacetName)
        const facet = await Facet.deploy()
        await facet.deployed
        console.log(`${FacetName} deployed: ${facet.address}`)
        eventFacetCuts.push({
            facetAddress: facet.address,
            action: FacetCutAction.Add,
            functionSelectors: getSelectors(facet)
        })
    }
    const diamondAddress = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";
    diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress,contractOwner);
    const theCut = await diamondCutFacet.diamondCut(eventFacetCuts,ethers.constants.AddressZero, '0x',{ gasLimit: 6000000 });
    const receipt = await theCut.wait();
    receipt.events.forEach((event) => {
            console.log(`Own: ${event.args[0]}`);
    });

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error(error);
    process.exit(1);
    });