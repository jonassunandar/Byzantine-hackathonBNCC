const jwt = require('jsonwebtoken')
const userda = require('./userda/userda.js')
const SDK = require("./smart-contract/SDK.js");
const Web3 = require("web3");
let ipfs = require("nano-ipfs-store").at("https://ipfs.infura.io:5001");
const userABI = require("./smart-contract/userABI.json");
const userBytecode = require("./smart-contract/userBytecode.json");

function generateSalt() {
    return Math.random().toString(36).substring(0, 15) + Math.random().toString(36).substring(0, 15);
}

const login = async (request, response) => {
    const email = request.body.email || ""
    const password = request.body.password || ""
    
    var [blockchainAddress, salt, err] = await userda.getBlockChainAddressAndSalt(email)
    if(err){
        return {"error":err}
    }
    // Todo: Jonas integrate with smart contract for authentication
    let sdk = new SDK();
    let web3 = new Web3("http://127.0.0.0.1:8545");
    let contractAddr = blockchainAddress;
    
    let seed = password + salt;
    let pk = web3.utils.sha3(seed);
    let hashedPK = web3.utils.sha3(seed);
    let user = await sdk.generatedWallet(pk);
    let resHashedPK = await sdk.fetch("checkHash", user, contractAddr, hashedPK);
    resHashedPK.result, true, "User is not authenticated";
    if (resHashedPK.result===true)
        response.status(200).json({
            'token': "jwt-token-here",
        }) 
    else 
        response.status(401).json({
            'message' :'User is not authenticated',
        })
}

const register = async (request, response) => {
    const email = request.body.email || ""
    const password = request.body.password || ""
    const salt = generateSalt()
    
    // Todo: Jonas  create password to smart contract
    
    var blockchainAddress;
    
    let sdk = new SDK();
    let web3 = new Web3("http://127.0.0.0.1:8545");
    let seed = password + salt;
    let pk = web3.utils.sha3(seed);
    let user = await sdk.generatedWallet(pk);
    let hashedPK = web3.utils.sha3(seed);
    let ipfs = web3.utils.sha3("not created");
    
    let res = await sdk.deployContract(userBytecode, userABI, user, hashedPK, ipfs);
    res = await sdk.getTransactionReceipt(res.txHash);
    blockchainAddress = res.contractAddress;
    userda.createNewUser(email, blockchainAddress, salt, response);
}

const getUserProfile = (request, response) => {
    var userid = request.body.userid || -1
    userda.getUserProfile(userid, response)
}

const updateSenstitve = async(request, response) => {
    const userid = request.body.userid || ""
    
    var updatedData = request.body
    delete updatedData["userid"]
    
    let input={
      'ktp': updatedData.ktp,
      'ccNumber': updatedData.ccNumber
    }
    let cid;
    try{
        cid = await ipfs.add(JSON.stringify(input));
        
    }catch(error){
        response.status(200).json({
            "error": error,
        })
        return
    }
    // userda.updateUserProfile(userid, updatedData, response)
}

const updateNonSenstitve = (request, response) => {
    const userid = request.body.userid || ""
    
    var updatedData = request.body
    delete updatedData["userid"]
    
    userda.updateUserProfile(userid, updatedData, response)
}

module.exports = {
    login,
    register,
    getUserProfile,
    updateNonSenstitve,
}