const { Client } = require('ssh2');

const conn = new Client();
conn.on('ready', () => {
  console.log('Client :: ready');

  const command = `
    export NVM_DIR="$HOME/.nvm";
    [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh";
    cd /opt/upflow-web && ./update.sh
  `;

  conn.exec(`bash -l -c '${command}'`, (err, stream) => {
    if (err) throw err;

    stream
      .on('close', (code, signal) => {
        console.log(`Finalizado: code=${code}, signal=${signal}`);
        conn.end();
      })
      .on('data', (data) => {
        console.log('STDOUT:', data.toString());
      })
      .stderr.on('data', (data) => {
        console.error('STDERR:', data.toString());
      });
  });
}).connect({
  host: '127.0.0.1',
  port: 22,
  username: 'root',
  privateKey: `
  -----BEGIN OPENSSH PRIVATE KEY-----
YOUR PRIVATE KEY
-----END OPENSSH PRIVATE KEY-----
  `
});