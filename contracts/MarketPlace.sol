// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;


contract MarketPlace{
    string public name;
    uint public productCount=1;


    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    mapping(uint => Product) public products;

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );
    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor(){
        name="Market Place";
    }

    function createProduct(string memory _name,uint _price) public{
        require(bytes(_name).length>0);
        require(_price>0);
        require(msg.sender != address(0x0));

        products[productCount]=Product(productCount,_name,_price,payable(msg.sender),false);
        emit ProductCreated(productCount, _name, _price, payable(msg.sender), false);
        productCount++;
    }

    function purchaseProduct(uint _id) public payable{
        require(_id<=productCount);
        require(msg.sender != address(0x0));

        Product memory _product=products[_id];
        require(msg.value==_product.price);
        require(!_product.purchased);
        address payable _seller=_product.owner;
        require(msg.sender != _seller);


        _product.owner=payable(msg.sender);
        _product.purchased=true;
        products[_id]=_product;
        _seller.transfer(_product.price);

        emit ProductPurchased(_id, _product.name, _product.price, payable(msg.sender), true);
    }
}