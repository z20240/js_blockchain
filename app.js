const express = require('express');
var bodyParser = require('body-parser'); // 用來 parse request.post
const app = express();

let Block = require('./block');
let Blockchain = require('./blockchain');
let Transaction = require('./transaction');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// 初始之鏈
let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);

app.get('/', function(req, res) {
    res.send("test");
});

app.post('/transactions', function(req, res) {
    let {from, to, amount} = req.body;

    console.log(from, to, amount);

    let transaction = new Transaction(from, to, amount);
    let transactions = JSON.parse(JSON.stringify(blockchain.getPreviousBlock().transactions));

    transactions.push(transaction);
    let block = blockchain.getNextBlock(transactions);
    blockchain.addBlock(block);
    res.end();
});

app.get('/blockchain', function(req, res) {
    res.json(blockchain);
});


app.listen(3000, function() {
    console.log("server started");
});