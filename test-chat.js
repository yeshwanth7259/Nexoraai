const fetch = require("node-fetch");

async function run() {
  const res = await fetch("http://localhost:3000/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "i need a thumbnail poster for my dosa canteen give me professional poster" }]
    })
  });

  const text = await res.text();
  console.log("RESPONSE:", text);
}
run();
