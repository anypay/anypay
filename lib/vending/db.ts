require('dotenv').config()

const util = require('util')

const mysql = require('mysql2');
const { Client } = require('ssh2');
const sshClient = new Client();
const dbServer = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}

var _connection;

import { log } from '../logger'
const tunnelConfig = {
    host: process.env.MYSQL_SSH_HOST,
    port: 22,
    username: process.env.MYSQL_SSH_USER,
    privateKey: require('fs').readFileSync(process.env.MYSQL_SSH_KEY_PATH)

}
const forwardConfig = {
    srcHost: '127.0.0.1',
    srcPort: 3306,
    dstHost: dbServer.host,
    dstPort: dbServer.port
};
const SSHConnection = new Promise((resolve, reject) => {
    sshClient.on('ready', () => {
        sshClient.forwardOut(
        forwardConfig.srcHost,
        forwardConfig.srcPort,
        forwardConfig.dstHost,
        forwardConfig.dstPort,
        (err, stream) => {
             if (err) reject(err);
             const updatedDbServer = {
                 ...dbServer,
                 stream
            };
            const connection =  mysql.createConnection(updatedDbServer);
           connection.connect((error) => {
            if (error) {
                reject(error);
            }
            resolve(connection);
            });
        });
    }).connect(tunnelConfig);
});

SSHConnection
  .then((conn: any) => {
    _connection = conn
    log.debug('mysql.ssh.connection', _connection)
    //return _connection.query('select * from transactionrecord order by terminaltime desc;', console.log)
    return query('select * from transactionrecord order by terminaltime desc;').then(console.log)
  })
  .catch(error => {
    log.error('mysql.ssh.error', error)
  })

export async function query(statement) {
  return new Promise((resolve, reject) => {

    _connection.query(statement, (err, result) => {
      if (err) { return reject(err) } 
      resolve(result)
    })
  })
}


