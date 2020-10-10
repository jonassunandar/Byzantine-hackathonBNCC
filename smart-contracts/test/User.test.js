const User = artifacts.require("User");

/*global web3, contract, assert, artifacts*/
contract("User", accounts => {
    let userSC;
    before(async()=>{
        
    })
    function generatedWallet (seed) {
        return {
            sign: async function (tx) {
                let pk = web3.utils.sha3(seed + process.env['TOKEN_SALT']);
                let acc = web3.eth.accounts.privateKeyToAccount(pk);
                tx.fromAddress = acc.address;
                let signedTx = await acc.signTransaction(tx);
                return signedTx.rawTransaction;
            },
            getAddress: async function () {
                let pk = web3.utils.sha3(seed + process.env['TOKEN_SALT']);
                return web3.eth.accounts.privateKeyToAccount(pk).address;
            },
            getSign: async function(message) {
                let pk = web3.utils.sha3(seed + process.env['TOKEN_SALT']);
                let acc = web3.eth.accounts.privateKeyToAccount(pk);
                return await acc.sign(message);
            }
        }
    }
    describe('Generating Account Test', async()=>{
        let PWD,SALT,seed;
        before(async()=>{
            PWD = "myStrongPassword";
            SALT = "USER_0X_SALT";
            seed = PWD + SALT;
        })
        it('Generate Address', async()=>{
            let newAddr = await generatedWallet(seed).getAddress();
            assert.strictEqual(newAddr!="", true, "Address is not generated.");
        });
        
        it('Generate User Smart Contract', async()=>{
            let user = await generatedWallet(seed);
            let hashedPK = web3.utils.sha3(seed);
            let ipfs = web3.utils.sha3("test");
            let sender = await user.getAddress();
            console.log("wtf", await web3.eth.getBalance(sender))
            userSC = await User.new(hashedPK, ipfs,{from: sender });
            let resHashedPK = await User.checkHash(hashedPK);
            assert.strictEqual(resHashedPK, true, "hashedPK is not the same");
        });
    });
    
})
