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
    
    var [userid, blockchainAddress, salt, err] = await userda.getBlockChainAddressAndSalt(email)
    if(err){
        return {"error":err}
    }
    console.log("passwordd ", password);
    // Todo: Jonas integrate with smart contract for authentication
    let sdk = new SDK();
    let web3 = new Web3("http://127.0.0.1:8545");
    let contractAddr = blockchainAddress;
    let seed = password + salt;
    let pk = web3.utils.sha3(seed);
    let hashedPK = web3.utils.sha3(pk);
    console.log("ini blockchainAddress", blockchainAddress, "salt ", salt, " pk ", pk, "hashedPK ", hashedPK)
    let user = await sdk.generatedWallet(pk);
    let resHashedPK = await sdk.fetch("checkHash", user, contractAddr, hashedPK);
    
    console.log(resHashedPK, contractAddr);
    
    if (resHashedPK.result==true){
        var jwtToken = jwt.sign({
            "userid":userid,
            "email":email
        }, global.JWT_SECRET)
        response.status(200).json({
            'message':'success',
            'token': jwtToken
        }) 
    }
    else
        response.status(200).json({
            'message' :'User is not authenticated'
        })
}

const register = async (request, response) => {
    const email = request.body.email || ""
    const password = request.body.password || ""
    const salt = generateSalt()
    
    var blockchainAddress;
    
    let sdk = new SDK();
    let web3 = new Web3("http://127.0.0.1:8545");
    let seed = password + salt;
    let pk = web3.utils.sha3(seed);
    let hashedPK = web3.utils.sha3(pk);
    let user = await sdk.generatedWallet(pk);
    
    let ipfs = web3.utils.sha3("not created");
    
    
    let res = await sdk.deployContract(userBytecode, userABI, user, hashedPK, ipfs);
    res = await sdk.getTransactionReceipt(res.txHash);
    blockchainAddress = res.contractAddress;
    
    userda.createNewUser(email, blockchainAddress, salt, response);
}

const getUserProfile = (request, response) => {
    var userid = request.user.id
    userda.getUserProfile(userid, response)
}

const getUserProfileSensitive = async(request, response) => {
    // var userid = request.params.userid;
    var email = request.user.email;
    const password = request.body.password || ""
    
    
    var [, blockchainAddress, salt, err] = await userda.getBlockChainAddressAndSalt(email)
    
    let sdk = new SDK();
    let web3 = new Web3("http://127.0.0.1:8545");
    
    let seed = password + salt;
    let pk = web3.utils.sha3(seed);
    let hashedPK = web3.utils.sha3(pk);
    let user = await sdk.generatedWallet(pk);
    
    let resHashedPK = await sdk.fetch("checkHash", user, blockchainAddress, hashedPK);
    
    if (resHashedPK.result==false) 
        response.status(200).json({
            "error": "User is not authenticated",
        })
    try{
        let result = await sdk.fetch("getIPFS", user, blockchainAddress);
        let cid = result.result;
        if (cid==web3.utils.sha3("not created")){
            response.status(200).json({
                message:"no data sensitive available"
            })
            return;
        }
        console.log("ini cid ", cid);
        let encryptedData = await ipfs.cat(cid);
        console.log("encrypted ", encryptedData)
        response.status(200).json({
            "message": 'success update sensitive',
            "data": JSON.parse(encryptedData),
        })
    }catch(error){
        console.log(error)
        response.status(200).json({
            "error": "error getIPFS",
        })
        return
    }
    
}

const updateSensitive = async(request, response) => {
    const userid = request.user.id || ""
    const email = request.user.email || ""
    const password = request.body.password || ""
    let sdk = new SDK();
    var updatedData = request.body
    delete updatedData["userid"]
    
    let input={
      'ktp': updatedData.ktp,
      'cc': updatedData.cc
    }
    let cid;
    
    let web3 = new Web3("http://127.0.0.1:8545");
    console.log("password ", password);
    var [, blockchainAddress, salt, err] = await userda.getBlockChainAddressAndSalt(email)
    let seed = password + salt;
    let pk = web3.utils.sha3(seed);
    let hashedPK = web3.utils.sha3(pk);
    let user = await sdk.generatedWallet(pk);
    
    console.log("ini blockchainAddress", blockchainAddress, "salt ", salt, " pk ", pk, "hashedPK ", hashedPK)
    let resHashedPK = await sdk.fetch("checkHash", user, blockchainAddress, hashedPK);
    
    //MASIH USER IS NOT AUTHENTICATED
    if (resHashedPK.result==false){
        response.status(200).json({
            "error": "User is not authenticated",
        })
        return
    } 
        
    try{
        let newIPFS = cid;
        cid = await ipfs.add(JSON.stringify(input));
        let result = await sdk.fetch("setIPFS", user, blockchainAddress, cid);
        response.status(200).json({
            "message": 'success update sensitive',
        })
    }catch(error){
        response.status(200).json({
            "error": error,
        })
    }
}

const updateNonSenstitve = (request, response) => {
    const userid = request.user.id || ""
    
    var updatedData = request.body
    delete updatedData["userid"]
    
    userda.updateUserProfile(userid, updatedData, response)
}

const register_benchmark = (request, response) => {
    const email = request.body.email || ""
    var password = request.body.password || ""
    
    let web3 = new Web3("http://127.0.0.1:8545");
    let salt = generateSalt()
    password = web3.utils.sha3(password + salt)
    
    userda.createUserBenchmark(email, password, salt, response)
}

const login_benchmark = async (request, response) => {
    const email = request.body.email || ""
    var password = request.body.password || ""
    
    let web3 = new Web3("http://127.0.0.1:8545");
    
    const [user_pwd, salt, err] = await userda.getPassword(email)
    
    password = web3.utils.sha3(password + salt)
    
    if(password !== user_pwd){
        response.status(200).json({
            "message": "wrong password",
        })
    }
    
    var jwtToken = jwt.sign({
        "userid":123,
        "email":email
    }, global.JWT_SECRET)
    response.status(200).json({
        "message": "good login",
        "jwt_token": jwtToken
    })
}

module.exports = {
    login,
    register,
    getUserProfile,
    updateNonSenstitve,
    updateSensitive,
    getUserProfileSensitive,
    login_benchmark,
    register_benchmark,
}