const MarketPlace = artifacts.require("../contracts/MarketPlace.sol");

contract("MarketPlace", (accounts) => {
    let marketPlace;

    before(async () => {
        marketPlace = await MarketPlace.deployed();
    })

    describe("deploys the contract", () => {
        it("it is deployed with correct info", () => {
            return marketPlace.name().then(name => {
                assert.equal(name, "Market Place");
                assert.notEqual(marketPlace.address, '');
                assert.notEqual(marketPlace.address, null);
                assert.notEqual(marketPlace.address, undefined);
            })
        })
    })

    it("helps to create a new product", () => {
        it("creates a new product", () => {
            return marketPlace.createProduct("", 1000).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return marketPlace.createProduct("Phone", 0)
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return marketPlace.createProduct("Phone", 1000, { from: "0x0" })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return marketPlace.createProduct("Mac Book Pro", web3.utils.toWei(1, "Ether"), { from: accounts[1] })
            }).then(receipt => {
                assert.equal(receipt.logs.length, 1, "triggers one event");
                assert.equal(receipt.logs[0].event, "ProductCreated", "triggers 'ProductCreated' event");
                assert.equal(receipt.logs[0].args.id, 1, "logs product 1");
                assert.equal(receipt.logs[0].args.name, "Mac Book Pro", "logs product name");
                assert.equal(receipt.logs[0].args.price, web3.utils.toWei(1, "Ether"), "logs product price");
                assert.equal(receipt.logs[0].args.owner, accounts[1], "logs product owner");
                assert.equal(receipt.logs[0].args.purchased, false, "logs id product is purchased");
                return marketPlace.productCount();
            }).then(count => {
                assert.equal(count, 2);
            })
        })
    })
})

