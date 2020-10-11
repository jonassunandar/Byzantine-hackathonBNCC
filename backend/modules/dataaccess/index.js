const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'byzantine',
  password: 'jonasganteng',
  port: 5432,
})

const getDBPool = () => {
    return pool
}

const escapeParameterString = (data) => {
    var result = ""
    for (var i = 0; i < data.length ;i++) {
        if(data[i] == '"' || data[i] == "'")result += "\\";
        result += data[i];
    }
    return result
}

module.exports = {
    getDBPool,
    escapeParameterString
}