const express = require('express');
var bodyParser = require('body-parser'); // 用來 parse request.post
const app = express();

let port = 3000;

// access the arguments;
process.argv.forEach((ele, indx, ary) => {
    console.log("ele", ele);
    port = ary[2];
});

let Block = require('./block');
let Blockchain = require('./blockchain');
let Transaction = require('./transaction');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// 初始之鏈
let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);
let transactions = [];

app.get('/', function(req, res) {
    res.send("test");
});

app.post('/transactions', function(req, res) {
    let {from, to, amount} = req.body;

    console.log(from, to, amount);
    transactions.push(new Transaction(from, to, amount));

    res.end();
});

app.get('/blockchain', function(req, res) {
    res.json(blockchain);
});

app.post('/mining', function (req, res) {
    let block = blockchain.getNextBlock(transactions);
    blockchain.addBlock(block);

    res.json(block);
});


app.listen(port, function() {
    console.log("server started", "listen on port");
});