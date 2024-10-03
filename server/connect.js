const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: 'cs3099user12.host.cs.st-andrews.ac.uk',
  database: 'cs3099user12_project',
  user: 'cs3099user12',
  password: 'pSDvsjY.TJ61N6',
  connectionLimit: 5
});
pool.getConnection()
  .then(conn => {
    conn.query("SELECT * FROM Account")
      .then((rows) => {
      })
      .then((res) => {
        conn.end();
      })
      .catch(err => {
        conn.end();
      })

  }).catch(err => {

  }).catch(err => {
    //not connected
  });

