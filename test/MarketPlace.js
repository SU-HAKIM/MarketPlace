const MarketPlace = artifacts.require("../contracts/MarketPlace.sol");

contract("MarketPlace", ([deployer, seller, buyer]) => {
    let marketPlace;
    let productPrice = 1000;

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

    describe("helps to create a new product", () => {
        it("creates a new product", () => {
            return marketPlace.createProduct("", productPrice, { from: seller }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return marketPlace.createProduct("Mac Book Pro", 0, { from: seller })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return marketPlace.createProduct("Mac Book Pro", productPrice, { from: "0x0" })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert') >= 0);
                return marketPlace.createProduct("Mac Book Pro", productPrice, { from: seller })
            }).then(receipt => {
                assert.equal(receipt.logs.length, 1, "triggers one event");
                assert.equal(receipt.logs[0].event, "ProductCreated", "triggers 'ProductCreated' event");
                assert.equal(receipt.logs[0].args.id, 1, "logs product 1");
                assert.equal(receipt.logs[0].args.name, "Mac Book Pro", "logs product name");
                assert.equal(receipt.logs[0].args.price, productPrice, "logs product price");
                assert.equal(receipt.logs[0].args.owner, seller, "logs product owner");
                assert.equal(receipt.logs[0].args.purchased, false, "logs id product is purchased");
                return marketPlace.productCount();
            }).then(count => {
                assert.equal(count, 2);
            })
        })
    })

    describe("it helps to purchase product", () => [
        it("give you to purchase product", () => {
            return marketPlace.purchaseProduct(1, { from: "0x0", value: 10 }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert' >= 0));
                return marketPlace.purchaseProduct(1, { from: buyer, value: 10 })
            }).then(assert.fail).catch(error => {
                assert(error.message.indexOf('revert' >= 0));
                return marketPlace.purchaseProduct(1, { from: buyer, value: productPrice });
            }).then(receipt => {
                return marketPlace.products(1);
            }).then(product => {
                assert.equal(product.owner, buyer);
                assert.equal(product.purchased, true);
            })
        })
    ])
})

