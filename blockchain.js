let sha256 = require('js-sha256');
let Block = require('./block');

class Blockchain {

    constructor ( genesisBlock ) {
        this.blocks = [];
        this.addBlock(genesisBlock);
    }

    addBlock(block) {
        if (this.blocks.length <= 0) {
            block.previousHash = "0000000000000000";
            block.hash = this.generagteHash(block);
        }

        this.blocks.push(block);
    }

    generagteHash(block) {
        let hash = sha256(block.key);

        /**
         * 区块验证算法的有趣部分是“工作量证明”概念：
         * 对每个区块进行SHA256哈希处理，将得到的哈希视为长度为256比特的数值，
         * 该数值必须小于不断动态调整的目标数值，本书写作时目标数值大约是2^190。
         * 工作量证明的目的是使区块的创建变得困难，从而阻止女巫攻击者恶意重新生成区块链。
         *
         * 這邊是直接寫死只要找到 0000開頭的區塊 就算成功
         */
        while(!hash.startsWith("0000")) {
            block.nonce += 1;
            hash = sha256(block.key);
            console.log(hash, block.nonce);
        }

        return hash;
    }

    // 產生新的區塊，這其實就是挖礦了吧？
    getNextBlock( transactions ) {
        let block = new Block();

        // 新的 block 也會有所有的交易紀錄
        transactions.forEach(transaction => {
            block.addTransaction( transaction );
        });

        let previousBlock = this.getPreviousBlock();
        block.index = this.blocks.length;
        block.previousHash = previousBlock.hash; // 新的 block 會存有上一個 block 的 hash
        block.hash = this.generagteHash(block); // 產生自己的 hash

        return block;
    }

    getPreviousBlock() {
        // 每一個 block 都會有一個 hash 以確保沒人能夠去竄改這個 block chain
        return this.blocks[this.blocks.length - 1];
    }

}

module.exports = Blockchain;