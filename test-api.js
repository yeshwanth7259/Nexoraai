const fs = require('fs');

async function test() {
  const formData = new FormData();
  formData.append('file', new Blob([fs.readFileSync('test.pdf')]), 'test.pdf');
  
  try {
    const res = await fetch('http://localhost:3000/api/studios/resume/parse', {
      method: 'POST',
      body: formData
    });
    
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error(e);
  }
}

test();
