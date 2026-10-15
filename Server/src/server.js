const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();


connectDB();

const app = express();


app.use(cors());
app.use(express.json()); 

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Roomora Server is running perfectly!'
  });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});