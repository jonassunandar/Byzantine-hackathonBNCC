const User = artifacts.require("User");
const SDK = require("./utils/SDK.js");
const userABI = require("../user.json");
const userBytecode = require("../userBytecode.json");
// const IPFS = require("ipfs");
const ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");
const util = require("ethereumjs-util");
const ecies = require("eth-ecies");
const Wallet = require('ethereumjs-wallet');

/*global web3, contract, assert, artifacts*/
contract("User", accounts => {
    let userSC,sdk, contractAddr, userContract;
    // ,ipfs;
    before(async()=>{
        sdk = new SDK();
        console.log(sdk.generatedWallet("seed"));
        // ipfs = await IPFS.create();
    })
    let address = [];
    describe('Generating Account Test', async()=>{
        let PWD,SALT,seed, user;
        
        before(async()=>{
            PWD = "myStrongPassword";
            SALT = "USER_0X_SALT";
            seed = PWD + SALT;
            user = await sdk.generatedWallet(seed);
        });
        
        it('Generate Address', async()=>{
            let newAddr = await user.getAddress();
            address.push(newAddr);
            assert.strictEqual(newAddr!="", true, "Address is not generated.");
        });
        
        it('Generate User Smart Contract', async()=>{
            user = await sdk.generatedWallet(seed);
            userContract = new web3.eth.Contract(userABI);
            address.push(await user.getAddress());
            let pk = web3.utils.sha3(seed);
            let hashedPK = web3.utils.sha3(pk);
            let ipfs = web3.utils.sha3("not created");
            
            let res = await sdk.deployContract(userBytecode, userABI, user, hashedPK, ipfs);
            res = await sdk.getTransactionReceipt(res.txHash);
            contractAddr = res.contractAddress;

            userContract.options.address = contractAddr;
            assert.strictEqual(contractAddr!=null, true, "contract hasn't been created");
        });
        
        it('can check IPFS', async()=>{
            let ipfs = web3.utils.sha3("not created");
            let newIPFS = await sdk.fetch("getIPFS", user, contractAddr);
            assert.strictEqual(newIPFS.result, ipfs, "ipfs is not the same");
        });
        
        it('can check hashedPK', async()=>{
            let pk = web3.utils.sha3(seed);
            let hashedPK = web3.utils.sha3(pk);
            let resHashedPK = await sdk.fetch("checkHash", user, contractAddr, hashedPK);
            assert.strictEqual(resHashedPK.result, true, "hashedPK is not authenticated.");
        }); 
    });
    
    describe('User Smart Contract Test', async()=>{
        
        let PWD,SALT,seed, user;
        
        before(async()=>{
            PWD = "myStrongPassword";
            SALT = "USER_0X_SALT";
            seed = PWD + SALT;
            user = await sdk.generatedWallet(seed);
        });
        
        it('can change IPFS', async()=>{
            let oldIPFS = web3.utils.sha3("not created");
            let newIPFS = web3.utils.sha3("new ipfs");
            address.push(await user.getAddress());
            
            let res = await sdk.fetch("setIPFS", user, contractAddr, newIPFS);
            let txHash = res.txHash;
            
            assert.strictEqual(txHash!=null, true, "txHash of setIPFS is not created");
            let result = await sdk.fetch("getIPFS", user, contractAddr);
            assert.strictEqual(result.result, newIPFS, "ipfs is not changed");
            assert.notEqual(oldIPFS, newIPFS, "ipfs is not changed");
        });
        
        it('can change hashedPK', async()=>{
            
            let pk = web3.utils.sha3(seed);
            let oldHash = web3.utils.sha3(pk);
            let newHash = web3.utils.sha3(oldHash);
            
            let res = await sdk.fetch("setHash", user, contractAddr, newHash);
            let txHash = res.txHash;
            
            assert.strictEqual(txHash!=null, true, "txHash of setHash is not created");
            let result = await sdk.fetch("checkHash", user, contractAddr, newHash);
            assert.strictEqual(result.result, true, "ipfs is not changed");
        });
    })
    describe('Login test', async()=>{
        let PWD,SALT,seed, user;
        
        before(async()=>{
            PWD = "myStrongPassword";
            SALT = "USER_0X_SALT";
            seed = PWD + SALT;
            user = await sdk.generatedWallet(seed);
        });
        
        it('user can login and authenticated', async()=>{
            let pk = web3.utils.sha3(seed);
            let hashedPK = web3.utils.sha3(pk);
            let newHash = web3.utils.sha3(hashedPK);
            let resHashedPK = await sdk.fetch("checkHash", user, contractAddr, newHash);
            assert.strictEqual(resHashedPK.result, true, "User is not authenticated");
        });
    });
  
    describe('Generated-Wallet Test', async()=>{  
        let PWD,SALT,seed, user;
        
        before(async()=>{
            PWD = "myStrongPassword";
            SALT = "USER_0X_SALT";
            seed = PWD + SALT;
            user = await sdk.generatedWallet(seed);
        });
        
        it('can getAddress', async()=>{
            let newAddress = await user.getAddress();
            assert.strictEqual(newAddress!=null, true, "address is not generated");
        });
        
        it('can generate different accounts if PWD is changed',async()=>{
            PWD = PWD + "1";
            let newUser = await sdk.generatedWallet(PWD + SALT);
            assert.notEqual(await newUser.getAddress(), await user.getAddress(), "PWD changed, yet account remains the same");
        });
        
        it('can generate different accounts if SALT is changed',async()=>{
            SALT = SALT + "1";
            let newUser = await sdk.generatedWallet(PWD + SALT);
            assert.notEqual(await newUser.getAddress(), await user.getAddress(), "SALT changed, yet account remains the same");
        });
        
        it('can sign rawTransaction', async()=>{
             let tx = {
                from: await user.getAddress(),
                to: await user.getAddress(),
                nonce: 0,
                data: '0x0',
                gasPrice: web3.utils.toHex(web3.utils.toWei('0', 'wei')),
                gasLimit: 100000000,
                chainId: "1337"
            };
            let signedTx = user.sign(tx);
            assert.strictEqual(signedTx!=null, true, "signedTx error");
        });
        
        it('can get sign', async()=>{
            let message = "hello";
            let signedMessage = user.getSign(message)
            assert.strictEqual(signedMessage!=null, true, "sign message error");
        });
    });
    
    describe('IPFS Integration', async()=>{
        let PWD,SALT,seed, user, cid, input;
        
        before(async()=>{
            PWD = "myStrongPassword";
            SALT = "USER_0X_SALT";
            seed = PWD + SALT;
            user = await sdk.generatedWallet(seed);
            input={
                'ktp': '0101',
                'alamat': 'jl. wawa',
                'cc': '123'
            }
        });
        
        // it('can add item in ipfs', async()=>{
        //     cid = await ipfs.add(JSON.stringify(input));
        //     console.log("nicee ", cid.length);
        // });
        
        it('can add ', async()=>{
            // user.decrypt(await user.encrypt("hallo"));
            // let result = await ipfs.cat(cid);
            // console.log("result", result);
        })
    })
})
