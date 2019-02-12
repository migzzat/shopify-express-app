const mysql = require('mysql');
const config = require("../_config_")
const pool_config = {
    // connectionLimit : 10,
    host                : config.MySQL.host,
    port                : config.MySQL.port,
    user                : config.MySQL.user,
    password            : config.MySQL.password,
    database            : config.MySQL.database ,
    connectionLimit     : 10, // this is the max number of connections before your pool starts waiting for a release
    multipleStatements  : true,
 };

let poolConn = mysql.createPool(pool_config);

/************************************ */

const Database = {
   getConnection: () => {
      // if connection open return this connection 
      if (poolConn['_closed']) {
      // if not , open new connection 
      poolConn = mysql.createPool(pool_config);
      return poolConn;
     }else return poolConn;
  }

  ,

  exec : (query , param , cb)=>{
    // 
    //    console.log("Connection Open ..")
       let pool = Database.getConnection();
       //console.log("connection => ",pool['config']['connectionConfig'])
       pool.getConnection((err, connection) =>{
         if (err){ // not connected!
             console.error(err)
         }
             // Use the connection
             connection.query(query , param ,  (error, results, fields)  => {
             // When done with the connection, release it.
             if (error){ // not connected!
                 console.error(error)
             }
             
             connection.release();
            //  console.log("Connection Relased .")
         
             cb(error, results , fields)

         });
     });
  }

};
/****************************** */
module.exports = Database;

