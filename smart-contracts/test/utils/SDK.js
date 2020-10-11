let Web3 = require("web3");
let ENS = require('ethereum-ens');
const chains = require('./chainID.json');
const ecies = require("eth-ecies");
const util = require('ethereumjs-util');

module.exports = class GeneralizeSDK {
    constructor(_ensAddress, _rpc="127.0.0.1:8545"){
        if (!_ensAddress && process.env['ENS_ADDRESS']){
            _ensAddress = process.env['ENS_ADDRESS'];
        }
        if (!_ensAddress){
            _ensAddress='0xD712CF6D5ADd6ddee0F3CEfF9FEde7c7CB4e8412';
        }
        this.ensAddress = _ensAddress;
        this.hnsCache={};
        this.rpc = "http://127.0.0.1:8545";
        this.chainId = "1337";
        this.web3 = new Web3(this.rpc);
        this.web3Priv = new Web3(this.rpc);
    }

    async setRPC(newRPC){
        try{
            this.rpc = newRPC;
            this.web3 = new Web3(this.rpc);
        }catch(e){
            console.log(e);
            return false;
        }
        return this.web3;
    }

    //get Chain ID according to defined RPC or current RPC to sign tx
    async getChainId(rpc = ''){
        if(!rpc) rpc = this.rpc;
        for(let chainKey in chains){
            if (rpc.includes(chainKey)){
                return chains[chainKey];
            }
        }
        return false;
    }

    async getHns(name, type, params){
        let ens = new ENS(this.web3Priv, this.ensAddress);
        var a = await ens.resolver(name);
        
        if(type == 'ABI' && !params){
            params = ["1"];            
        }
        if(!params) params = [];
        
        let res = await a[type](...params);
        if(type == 'ABI'){
            res = res['1'];
        }
        if(res.startsWith && res.startsWith('0x') && type!='addr'){
            res = this.web3.utils.toUtf8(res);
        }
        if(type == 'ABI') res = JSON.parse(res);
        return res;
    }

    async getContractInstance(name, addr = ''){
        if (!addr) addr = await this.getHns(name, 'addr');
        let ABI = await this.getHns(name, 'ABI' );
        return new this.web3.eth.Contract(ABI, addr);
    }
    
    async deployContract(bytecode, abi, callback, ...args){
        let fromAddress = await callback.getAddress();//needs documentation
        let txHash, result;
        let contract = new this.web3.eth.Contract(abi);
        let contractData = null;
        
        contractData = await contract.deploy({
            data:"0x"+bytecode.object,
            arguments: [...args]
        }).encodeABI();
        
    
        await this.web3.eth.getTransactionCount( fromAddress ).then( async (count)=>{
            
            let data = contractData;
            let gasLimit;
            let tempTx={
                from:fromAddress,
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('0', 'gwei')),
                data: data,
                nonce: count,
            }
            
            try{
                gasLimit = await this.web3.eth.estimateGas(tempTx);
            }catch(err){
                gasLimit = 30000000;
            };

            let tx = {
                from: fromAddress,
                nonce: count,
                data: data,
                gasPrice: this.web3.utils.toHex(this.web3.utils.toWei('0', 'wei')),
                gasLimit: gasLimit,
                chainId: this.chainId
            };
            
            let signedTx;
            try{
                signedTx = await callback.sign(tx); //needs documentation
            }catch(err){
                result = err;
            }
            txHash = this.web3.utils.sha3(signedTx);
            result = this.web3.eth.sendSignedTransaction(signedTx);
        });
        return new Promise( (resolve,reject) => {
            result.once('confirmation', function(confNumber, receipt){
                if (receipt.status==false) return; //if something's wrong happen
                let result = {
                    "txHash":txHash
                }
                resolve(result);
                return
            }).on('error',function(error){
                reject(error);
            })
            return;
        });
    }

    async contract(method, callback, addr, ...args){
        // console.log("method addr", method, addr)
        let ABI = require("../../user.json"); //WARNINING!!
        
        let res = {
            __ABI: ABI,
            __addr: addr,
            __SDK: this,
            __callback: callback,
            chainId: "1337", //WARNING!!!
            contract: new this.web3.eth.Contract(ABI,addr)
        };
        
        for(let x of ABI){
            if(x.type == 'function'){
                res[x.name] = async function (...args){
                    if(x.stateMutability == 'view' || x.stateMutability == 'pure'){
                        let fromAddress;
                        if (this.__callback){
                            fromAddress = await this.__callback.getAddress();//needs documentation
                        }else {
                            fromAddress = null;
                        }
                        return new Promise( (resolve,reject) => {
                            if (fromAddress) return this.contract.methods[x.name](...args).call({from:fromAddress}).then(data=>{
                                let result = {
                                    "result": data
                                }
                                resolve(result);
                            });

                            return this.contract.methods[x.name](...args).call().then(data=>{
                                let result = {
                                    "result": data
                                }
                                resolve(result);
                            });
                        });
                    }
                    else {
                        let fromAddress = await this.__callback.getAddress();//needs documentation
                        let txHash, result;
                        await this.__SDK.web3.eth.getTransactionCount( fromAddress ).then( async (count)=>{
                            
                            let data = await this.contract.methods[x.name](...args).encodeABI();
                            let gasLimit;
                            let tempTx={
                                to: this.__addr,
                                gasPrice: this.__SDK.web3.utils.toHex(this.__SDK.web3.utils.toWei('0', 'gwei')),
                                data: data,
                                nonce: count,
                            }
                            
                            try{
                                gasLimit = await this.__SDK.web3.eth.estimateGas(tempTx);
                            }catch(err){
                                console.log(err);
                                gasLimit = 30000000;
                            };
                            // console.log("gas limit bro ", gasLimit);
                            let tx = {
                                from: fromAddress,
                                to: this.__addr,
                                nonce: count,
                                data: data,
                                // gasPrice: '1',
                                gasPrice: this.__SDK.web3.utils.toHex(this.__SDK.web3.utils.toWei('0', 'wei')),
                                gasLimit: gasLimit,
                                chainId: this.chainId
                            };
                            let signedTx;
                            try{
                                if(tx.chainId != 1212) tx.gasPrice = this.__SDK.web3.utils.toHex(this.__SDK.web3.utils.toWei('0', 'gwei'));
                                signedTx = await this.__callback.sign(tx); //needs documentation
                            }catch(err){
                                result = err;
                            }
                            
                            txHash = this.__SDK.web3.utils.sha3(signedTx);                            
                            result = this.__SDK.web3.eth.sendSignedTransaction(signedTx);
                        });
                        return new Promise( (resolve,reject) => {
                            result.once('confirmation', function(confNumber, receipt){
                                if (receipt.status==false) return; //if something's wrong happen
                                let result = {
                                    "txHash":txHash
                                }
                                resolve(result);
                                return
                            }).on('error',function(error){
                                reject(error);
                            })
                            return;
                        });
                    }
                };
            }else if(x.type == 'event'){
                
            }
        }
        return res;
    }

    async fetch(fn,callback,addr = '',...params){
        let ctr = await this.contract(fn, callback, addr, ...params);
        return ctr[fn](...params);
    }

    async getTransactionReceipt(txHash){
        let receipt = null;
        while(receipt==null || receipt==undefined){
            receipt = await this.web3.eth.getTransactionReceipt(txHash);
        }
        return receipt;
    }

    async getTransaction(txHash){
        let result;
        try{
            result = await this.web3.eth.getTransaction(txHash);
        }catch(e){
            console.log(e);
            result = false;
        }
        return result;
    }

    async getPastEvents( uri ,eventName, filter ){
        let tempAddr = uri + '#addr', addr;
        if (this.hnsCache[tempAddr]){
            addr = this.hnsCache[tempAddr];
        } else {
            addr = await this.getHns(uri,'addr');
            this.hnsCache[tempAddr] = addr;
        }
        let ABI;
        let tempABI = uri + '#ABI';
        if ( this.hnsCache[tempABI]  ){
            ABI = this.hnsCache[tempABI];
        } else {
            ABI = await this.getHns(uri,'ABI');
            this.hnsCache[tempABI] = ABI;
        }
        let contract = new this.web3.eth.Contract(ABI, addr);
        return contract.getPastEvents(eventName,{
            filter:{ filter },
            fromBlock:0,
            toBlock: 'latest'
        })
    }
    
    async generatedWallet (seed) {
        return {
            encrypt: (data)=>{
                let pk = this.web3.utils.sha3(seed);
                pk = this.web3.eth.accounts.privateKeyToAccount(pk).privateKey;
                // // console.log(Wallet);
                // console.log("ini pk ", pk);
                // // const wallet = Wallet.fromPrivateKey(util.toBuffer(pk))
                // // const pubkey= wallet.getPublicKeyString()
                // // console.log("yow", pubkey);
                // // console.log("pubkey ", privateToPublic(pk).toString());
                let bufferPubKey = util.privateToPublic(pk);
                let bufferData = new Buffer(data);
                let encryptedData = ecies.encrypt(bufferPubKey, bufferData);
                // // console.log(encryptedData.toString('base64'));
                return data;
            },
            decrypt: (encryptedData)=>{
                let pk = this.web3.utils.sha3(seed);
                pk = this.web3.eth.accounts.privateKeyToAccount(pk).privateKey;
                // console.log("sampe sini ?", encryptedData);
                let encryptedDat = new Buffer(encryptedData, 'base64');
                let userPrivateKey = new Buffer(pk, 'hex');
                // let decryptedData = ecies.decrypt(userPrivateKey, encryptedData);
                // console.log("decrypted data", decryptedData);
                return encryptedData;
            },
            sign: async (tx)=> {
                let pk = this.web3.utils.sha3(seed);
                let acc = this.web3.eth.accounts.privateKeyToAccount(pk);
                tx.fromAddress = acc.address;
                let signedTx = await acc.signTransaction(tx);
                return signedTx.rawTransaction;
            },
            getAddress: async () => {
                let pk = this.web3.utils.sha3(seed);
                return this.web3.eth.accounts.privateKeyToAccount(pk).address;
            },
            getSign: async (message)=> {
                let pk = this.web3.utils.sha3(seed);
                let acc = this.web3.eth.accounts.privateKeyToAccount(pk);
                return await acc.sign(message);
            }
        }
    }

}