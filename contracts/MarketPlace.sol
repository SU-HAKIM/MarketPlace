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
}