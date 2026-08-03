const http = require('http');

const data = JSON.stringify({ prompt: 'A simple todo app' });

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/studios/app-dev/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', d => {
    body += d;
  });
  res.on('end', () => {
    console.log('BODY:', body.substring(0, 500) + (body.length > 500 ? '...' : ''));
  });
});

req.on('error', error => {
  console.error('ERROR:', error);
});

req.write(data);
req.end();
