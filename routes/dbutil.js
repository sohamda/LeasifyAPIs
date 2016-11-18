
var oracledb = require('oracledb'); 

module.exports = {

handleDatabaseOperation: function( request, response, callback) {
  console.log(request.method + ":" + request.url );
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  
  console.log('Handle request: '+request.url);
  oracledb.getConnection({
    user          : process.env.DBAAS_USER_NAME || "dont_know",
    password      : process.env.DBAAS_USER_PASSWORD || "this_as_well",
    connectString : process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR || "no_way"
  },
  function(err, connection) {
    if (err) {
	  console.log('Error in acquiring connection ...');
	  console.log('Error message '+err.message);

      // Error connecting to DB
      response.writeHead(500, {'Content-Type': 'application/json'});
      response.end(JSON.stringify({
                status: 500,
                message: "Error connecting to DB",
                detailed_message: err.message
              }));
      return;
    }        
    // do with the connection whatever was supposed to be done
	console.log('Connection acquired ; go execute ');
	callback(request, response, connection);
 });
}, //handleDatabaseOperation

doRelease: function(connection) {
  connection.release(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}
};