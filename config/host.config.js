const envHandler = require('../server/utils/envHandler')();

module.exports = {
  protocol: "http://",
  host: "localhost",
  port: envHandler.PORT,
  endpoints: {
   
  }
};
