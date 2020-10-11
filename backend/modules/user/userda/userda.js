const dbaccess = require("../../dataaccess")
const pool = dbaccess.getDBPool()

const getBlockChainAddressAndSalt = async (email) => {
  email = dbaccess.escapeParameterString(email)
  
  var blockchainAddress, salt;
  
  try{
    var results = await pool.query('SELECT address, pwd_salt FROM users WHERE email = $1', [email])
  
    blockchainAddress = results.rows[0].address
    salt = results.rows[0].pwd_salt
    
  }catch(err){
    return [null, null, err];
  }
  
  return [blockchainAddress, salt, null]
}

const createNewUser = async (email, blockchainAddress, salt) => {
  email = dbaccess.escapeParameterString(email)
  blockchainAddress = dbaccess.escapeParameterString(blockchainAddress)
  
  try{
    var results = await pool.query('INSERT INTO users (email, blockchain_address, pwd_salt) VALUES($1, $2, $3)', [email, blockchainAddress, salt])
    
  }catch(err){
    return {"error": err}
  }
  
  return null
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
  const [queryString, param] = buildUpdateQueryString("users", data, userid)
  
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
  userid = dbaccess.escapeParameterString(userid)
  
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
