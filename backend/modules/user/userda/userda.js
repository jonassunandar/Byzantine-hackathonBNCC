const dbaccess = require("../../dataaccess")
const pool = dbaccess.getDBPool()

const getBlockChainAddressAndSalt = async (email) => {
  email = dbaccess.escapeParameterString(email)
  
  var blockchainAddress, salt, userid;
  
  try{
    var results = await pool.query('SELECT id, blockchain_address, pwd_salt FROM users WHERE email = $1', [email])
  
    blockchainAddress = results.rows[0].blockchain_address
    salt = results.rows[0].pwd_salt
    userid = results.rows[0].id
    
  }catch(err){
    return [null, null, null, err];
  }
  
  return [userid, blockchainAddress, salt, null]
}

const createNewUser = async (email, blockchainAddress, salt, response) => {
  email = dbaccess.escapeParameterString(email)
  blockchainAddress = dbaccess.escapeParameterString(blockchainAddress)
  console.log
  pool.query('INSERT INTO users (email, blockchain_address, pwd_salt) VALUES($1, $2, $3)', [email, blockchainAddress, salt])
    .then((results) => {
      response.status(200).json({
        "message": "register success"
      })
    }).catch((err) => {
      response.status(200).json({
        'error': err,
      })
      throw(err)
    })
}

function buildUpdateQueryString(tableName, data, userid) {
  var query = "UPDATE " + tableName + " SET "
  var param = []
  for(var key in data){
    if(param.length > 0)query += ", "
    param.push(dbaccess.escapeParameterString(data[key]))
    query += key + " = $" + param.length.toString()
  }
  param.push(userid)
  query += " WHERE id = $" + param.length.toString()
  return [query, param]
}

const updateUserProfile = (userid, data, response) => {
  if(Object.keys(data).length == 0){
    response.json({
      "error": "empty update parameters",
    })
    return
  }
  const [queryString, param] = buildUpdateQueryString("users", data, userid)
  console.log(queryString, param);
  pool.query(queryString, param, (error, results) => {
    if(error){
      response.status(200).json({
        "error": error,
      })
      return
    }
    response.status(200).json({
      "message": "update success"
    })
  })
}

const getUserProfile = (userid, response) => {
  pool.query("SELECT * FROM users WHERE id = $1", [userid], (error, results) => {
    if(error){
      response.status(200).json({
        "error": error
      })
      return
    }
    response.status(200).json({
      "data": results.rows 
    })
  })
}

module.exports = {
    getBlockChainAddressAndSalt,
    updateUserProfile,
    getUserProfile,
    createNewUser,
}
