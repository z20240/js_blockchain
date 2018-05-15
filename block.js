class Block {
    constructor() {
        this.index = 0;
        this.previousHash = "";
        this.hash = "";
        /**
         *  Nonce是一個在加密通訊只能使用一次的數字。
         * 在認證協定中，它往往是一個隨機或偽隨機數，以避免重送攻擊。
         * Nonce也用於串流加密法以確保安全。
         * 如果需要使用相同的金鑰加密一個以上的訊息，就需要Nonce來確保不同的訊息與該金鑰加密的金鑰流不同。
         */
        this.nonce = 0;
        this.transactions = [];
    }

    get key() {
        // key  主要由四個部分構成 transactions, index, previousHash, nonce
        return JSON.stringify(this.transactions) + this.index + this.previousHash + this.nonce;
    }

    addTransaction(transation) {
        this.transactions.push(transation);
    }
}

module.exports = Block;