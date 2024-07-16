const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 5; // Adjust the window size as needed
let storedNumbers = [];

app.use(bodyParser.json());

// Middleware to check for the bearer token
function authToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // if no token, unauthorized

  // Add token verification logic here
  // For simplicity, we are skipping actual verification
  next();
}

// Helper function to fetch numbers from a third-party server
async function fetch() {
  const urls = [
    'http://20.244.56.144/test/primes',
    'http://20.244.56.144/test/fibo',
    'http://20.244.56.144/test/rand'
  ];

  const responses = await Promise.all(urls.map(url => axios.get(url)));
  return responses.map(response => response.data);
}
console.log("check")
// API to accept number IDs and calculate average
app.post('/numbers/:numberId', authToken, async (req, res) => {
  const { numberId } = req.params;

  if (!isValidNumberId(numberId)) {
    return res.status(400).json({ error: 'Invalid number ID' });
  }

  try {
    const numbers = await fetch();
    storedNumbers = storedNumbers.concat(numbers).slice(-WINDOW_SIZE);

    const average = storedNumbers.reduce((sum, num) => sum + num, 0) / storedNumbers.length;
    res.json({ average, storedNumbers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch numbers' });
  }
});

function isValidNumberId(numberId) {
  
  return !isNaN(numberId) && Number(numberId) > 0;
}


app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
