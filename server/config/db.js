const mongoose = require('mongoose');
const dns = require('dns');

// 有些本地网络的默认 DNS 不响应 mongodb+srv 的 SRV 查询，这里换成稳定的公共 DNS
dns.setServers(['223.5.5.5', '119.29.29.29', '8.8.8.8']);

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    console.log('MongoDB Atlas connected');
  } catch (err) {
    console.error('Could not connect to database: ' + err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
