const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('./api');  // Đảm bảo rằng bạn đã import đúng file api.js

const app = express();
const port = 3002;

// Middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sử dụng route /api từ file api.js
app.use('/api', api);

// Bắt đầu lắng nghe trên cổng
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});