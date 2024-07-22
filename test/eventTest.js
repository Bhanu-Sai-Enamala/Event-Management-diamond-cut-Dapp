const { getSelectors, FacetCutAction } = require('../scripts/libraries/diamond.js');
const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;

describe("EventFactory", function () {
    let eventFactory;
    let eventInstance;
    let manager;
    let nonManager;
    let diamondAddress;

    before(async function () {
        const accounts = await ethers.getSigners();
        const contractOwner = accounts[0];

        // Deploy DiamondInit
        const DiamondInit = await ethers.getContractFactory('DiamondInit');
        const diamondInit = await DiamondInit.deploy();
        await diamondInit.deployed();

        // Deploy facets and set the `facetCuts` variable
        const FacetNames = [
            'DiamondCutFacet',
            'DiamondLoupeFacet',
            'OwnershipFacet'
        ];
        const facetCuts = [];
        for (const FacetName of FacetNames) {
            const Facet = await ethers.getContractFactory(FacetName);
            const facet = await Facet.deploy();
            await facet.deployed();
            facetCuts.push({
                facetAddress: facet.address,
                action: FacetCutAction.Add,
                functionSelectors: getSelectors(facet)
            });
        }

        // Creating a function call
        let functionCall = diamondInit.interface.encodeFunctionData('init');

        // Setting arguments that will be used in the diamond constructor
        const diamondArgs = {
            owner: contractOwner.address,
            init: diamondInit.address,
            initCalldata: functionCall
        };

        // Deploy Diamond
        const Diamond = await ethers.getContractFactory('Diamond');
        const diamond = await Diamond.deploy(facetCuts, diamondArgs);
        await diamond.deployed();
        diamondAddress = diamond.address; // Save the diamond address

        // Deploy event facets
        const eventCutNames = [
            'CreateEventFacet',
            'GetDeployedEventsFacet'
        ];
        const eventFacetCuts = [];
        for (const FacetName of eventCutNames) {
            const Facet = await ethers.getContractFactory(FacetName);
            const facet = await Facet.deploy();
            await facet.deployed();
            eventFacetCuts.push({
                facetAddress: facet.address,
                action: FacetCutAction.Add,
                functionSelectors: getSelectors(facet)
            });
        }

        // Apply the event facet cuts
        const diamondCutFacet = await ethers.getContractAt('DiamondCutFacet', diamondAddress, contractOwner);
        const theCut = await diamondCutFacet.diamondCut(eventFacetCuts, ethers.constants.AddressZero, '0x');
        await theCut.wait();

        // Attach facets to diamond address
        const createEventFacet = await ethers.getContractAt('CreateEventFacet', diamondAddress, contractOwner);
        const getDeployedEventsFacet = await ethers.getContractAt('GetDeployedEventsFacet', diamondAddress, contractOwner);

        // Set manager and non-manager accounts
        [manager, nonManager] = await ethers.getSigners();

        // Create initial event
        await createEventFacet.createEvent("First Event", ethers.utils.parseEther("1"), 100); // Use ethers.utils.parseEther
        const deployedEvents = await getDeployedEventsFacet.getDeployedEvents();
        const eventAddress = deployedEvents[0];
        const Event = await ethers.getContractFactory("Event");
        eventInstance = Event.attach(eventAddress);
    });

    beforeEach(async function () {
        // Take a snapshot before each test
        snapshotId = await hre.network.provider.send("evm_snapshot");
    });

    afterEach(async function () {
        // Revert to the snapshot after each test
        await hre.network.provider.send("evm_revert", [snapshotId]);
    });

    it("should create a new event", async function () {
        const createEventFacet = await ethers.getContractAt('CreateEventFacet', diamondAddress, manager);
        await createEventFacet.createEvent("Second Event", ethers.utils.parseEther("1"), 100); // Use ethers.utils.parseEther
        const getDeployedEventsFacet = await ethers.getContractAt('GetDeployedEventsFacet', diamondAddress, manager);
        const deployedEvents = await getDeployedEventsFacet.getDeployedEvents();
        expect(deployedEvents.length).to.equal(2);
    });

    it("should mark caller as manager", async function () {
        const managerAddress = await eventInstance.manager();
        expect(managerAddress).to.equal(manager.address);
    });

    it("should enforce only manager can withdraw funds", async function () {
        await expect(
            eventInstance.connect(nonManager).withdrawFunds()
        ).to.be.revertedWith("Only manager can perform this action");
    });

    it("should enforce valid ticket ID", async function () {
        const invalidTicketId = 101;
        await expect(eventInstance.useTicket(invalidTicketId)).to.be.revertedWith("Invalid ticket ID");
    });

    it("should enforce ticket ownership", async function () {
        await eventInstance.buyTicket({ value: ethers.utils.parseEther("1") }); // Use ethers.utils.parseEther
        await expect(
            eventInstance.connect(nonManager).useTicket(99)
        ).to.be.revertedWith("You do not own this ticket");
    });

    it("should allow buying a ticket", async function () {
        await eventInstance.buyTicket({ value: ethers.utils.parseEther("1") }); // Use ethers.utils.parseEther

        const ticket = await eventInstance.tickets(99); // Assuming ticket ID starts from 0
        expect(ticket.owner).to.equal(manager.address);
        expect(ticket.isUsed).to.be.false;
    });

    it("should allow using a ticket", async function () {
        await eventInstance.buyTicket({ value: ethers.utils.parseEther("1") }); // Use ethers.utils.parseEther
        await eventInstance.useTicket(99); // Assuming ticket ID starts from 0

        const ticket = await eventInstance.tickets(99); // Assuming ticket ID starts from 0
        expect(ticket.isUsed).to.be.true;
    });

    it("should allow transferring a ticket", async function () {
        const newOwner = nonManager.address;

        await eventInstance.buyTicket({ value: ethers.utils.parseEther("1") }); // Use ethers.utils.parseEther
        await eventInstance.transferTicket(99, newOwner);

        const ticket = await eventInstance.tickets(99);
        expect(ticket.owner).to.equal(newOwner);
    });
});
