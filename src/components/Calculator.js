// src/components/Calculator.js
import React, { useState } from 'react';
import axios from 'axios';

const Calculator = () => {
  const [numberId, setNumberId] = useState('');
  const [result, setResult] = useState(null);
  const [token, setToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `/numbers/${numberId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setResult(res.data);
      setError(null);
    } catch (err) {
      setError(err.res ? err.res.data.error : 'Server error');
      setResult(null);
    }
  };

  return (
    <div>
      <h1>Number Calculator</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={numberId}
          onChange={(e) => setNumberId(e.target.value)}
          placeholder="Enter number ID"
        />
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter Bearer Token"
        />
        <button type="submit">Calculate</button>
      </form>
      {result && (
        <div>
          <h2>Average: {result.average}</h2>
          <h3>Stored Numbers: {result.storedNumbers.join(', ')}</h3>
        </div>
      )}
    </div>
  );
};

export default Calculator;
