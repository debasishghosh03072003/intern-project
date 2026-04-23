const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');
let uri = '';

for (const line of lines) {
  if (line.trim().startsWith('MONGODB_URI=')) {
    const index = line.indexOf('=');
    uri = line.slice(index + 1).trim().replace(/^["']|["']$/g, '');
    break;
  }
}

if (!uri) {
  console.error("MONGODB_URI not found in .env.local");
  process.exit(1);
}

console.log("Attempting to connect to MongoDB...");
const redactedUri = uri.replace(/:([^@]+)@/, ':****@');
console.log("URI:", redactedUri);

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000 // 5 seconds timeout
})
  .then(() => {
    console.log("Successfully connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
