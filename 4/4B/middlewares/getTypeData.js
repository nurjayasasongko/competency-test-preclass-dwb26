const dbConnection = require("../config/db");

module.exports = (req, res, next) => {
  let typeData;
  dbConnection.query("SELECT * FROM types_tb ORDER BY id DESC", (err, rows) => {
    if (err) throw err;
    typeData = rows;
    req.typeData = typeData;
    return next();
  });
};
