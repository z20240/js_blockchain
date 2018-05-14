let Block = require('./block');
let Blockchain = require('./blockchain');
let Transaction = require('./transaction');

// 初始之鏈
let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

// 創建一筆交易
let transaction = new Transaction('Mary', 'Groge', 100);
let block = blockchain.getNextBlock([transaction]);
blockchain.addBlock(block);

// 創建一筆交易
transaction = new Transaction('Groge', 'Mary', 100);
block = blockchain.getNextBlock([transaction]);
blockchain.addBlock(block);

console.log(blockchain);