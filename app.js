const express = require('express');
var bodyParser = require('body-parser'); // 用來 parse request.post
const app = express();

let Block = require('./block');
let Blockchain = require('./blockchain');
let BlockchainNode = require('./blockchainNode');
let Transaction = require('./transaction');
let Axios = require('axios');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


let port = 3000;

// access the arguments;
process.argv.forEach((ele, indx, ary) => {
    console.log("ele", ele);
    port = ary[2];
});
if (port === undefined)
    port = 3000;


// 初始之鏈
let genesisBlock = new Block();
let blockchain = new Blockchain(genesisBlock);
let transactions = [];
let nodes = [];

app.get('/', function(req, res) {
    res.send("test");
});


/************************************************
 *             register nodes                   *
 ************************************************/
app.post('/nodes/register', function(req, res) {
    /**
     * 預期要獲得 {"urls" : [{"url": "http://xxx.xxx.com"}, ... ]}
     */
    let nodesList = req.body.urls;
    nodesList.forEach(urlList => {
        let node = new BlockchainNode(urlList["url"]);
        nodes.push(node);
    });

    res.json(nodes);
});

app.get('/nodes', function(req, res) {
    res.json(nodes);
});


/************************************************
 *         basic block chain transition         *
 ************************************************/
app.post('/transactions', function(req, res) {
    let {from, to, amount} = req.body;

    console.log(req.body.from, req.body.to, req.body.amount);
    transactions.push(new Transaction(from, to, amount));

    res.json(transactions);
});

app.get('/blockchain', function(req, res) {
    res.json(blockchain);
});

app.post('/mining', function (req, res) {
    let block = blockchain.getNextBlock(transactions);
    blockchain.addBlock(block);
    // 將交易鍊歸零
    transactions = [];
    res.json(block);
});


app.get('/resolve', function (req, res) {
    console.log("1", blockchain);
    nodes.forEach((node) => {
        console.log("2", node.url + '/blockchain');
        Axios.get(node.url + '/blockchain').then((result) => {
            console.log("3", result.data);
            res.json(result.data); // 這邊送了兩次
        });
    })
})


app.listen(port, function() {
    console.log("server started", "listen on port", port);
});
