const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const admin = require('firebase-admin');
var serviceAccount = require("./Credential.json");

const app = express();
app.use(cors());
app.use(express.json());

// Khởi tạo Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://music-9ae9f-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const JWT_SECRET = "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCr9hhSc91IM+vWgQhRY2XjlHuciTmBnGu0HsjEEjOoppSaqjzuDIpmI8s16rhTb0RBJRtpcHC4Br0BR1wA0Z/M8NE0R8CTn4AK7eRF1MObLmjOhGJ6t71cND3geMXSf0/rkMF4sYnaUwNmb97ZIGnC8I5DsVLHtJfSTEaqzhGT5HsM1Ame0HWwjlGJ5fDIUIRL6eKyYYgGkOjPNVhXE0eShGlPW9XIt3TtIB+w6lb+sbGLk0sLuCkEACE8SlGjMDhPPFPs206uC0oGwD1KDCje5Eh//89RaatT8DISNiOR/pFAyDiG6S59M7k90FfNWdV1ntcbOVPF5P/sAkyslaiZAgMBAAECgf9OT4RECFUoIdJaR+jB0mz+zF/T/v9xRwrFZuoxtcL7dYu3OPpbw4TuKYl2xFhXpr7ZQUzPzPoy1DQT9lYFCXGnTa6itbUS2qWKVKE1gUSTJvoTvQtxV2ZPgdBWqVQYHbeyT08hkmMfny5X4sUERv6NstRsKhTIsuAbpSDe0s6udQojWW/au6P/Vi6bEa6oGIFqxoy+YeLc+aU5gR7CFVVLUwYGZXRn0plVbDnxzkCPAm+7uee/MS77UK1DHmQDE4KkXscXKt3lFMtwq99O426fHnmKoFpEPIMm3Mvnw7atiwQUt5IDEStBu4kiPqA8ksrVbMoC8xonkBm9Rv6In+UCgYEAz9yd42jxV793vRZoIB/bTeZxm8KrjGXLqtU1U2sIiloMXywCjxic0PHumFLF82K8CspEL4L2Hsm6xH45xZRfVLTjgaIDYJzGiIVVgJsxvm7z2XuTgmt9iPv9Gz5FSojYNMSb3zb9mtNMx5TxkABQdXWMJQaJYLGo7+wJ4GrtP10CgYEA08kRNDgPb8fIan2Nps6kETjAoUpBgB74dbcQR69kYro6OVBbVWVii3vJRuGj3ZgXVPmtl0sPaeogDPkR27yLTf0OhYYRqjmj2/3sVp7o5Ka5JI39pGsgChGXV7/cdUA29BfADcjBpCdIM0ejGusoa13VrIw0AAaDmX3zhKSThm0CgYEAv/WCzh/9Ocb1omcN9BTXZ6KYansmB/t+Uh6iJ45iDbrJUB8JofLd50x1xrAyZOlatTBENghgmOA9nfbgDWpPe5+tturS6ab+5dcUtjccgjxe8ArimAACp73m6gDg5stnt5uWQ1a6cAARGQOg7haMN1099neJ6QVI+YDnQhwdS3UCgYEAoZv7Ltfgn7HaM7jfUPy6ohGmnO2nEfeQLXOmTq1+cwAc0gOJzp5xFnM9YoNoof4fP87PMnYqqu3nyz587CryOm7yl914uWcGrScVI/xbR7AZ89UOSlsctdI6pNFZj3eS96zv9xTM/1Cifc8anb34uAWAugy62ZIe9g/wtbVIhfkCgYEAp3oPTknnkBIOdCU3nSHqEsiOvgT6PA1VyTkHAlIF8cJ6XG0Er9LwQaxSDZkutp+3pap/P24T+Am5+luCqaShXUjWaarM/bLPmZV+Sv1KEUW2sCOpQf5sSCfB6whUiNyO3qPdCejZ1meGGDcf9Jc/pl/CSIHH4mpeKeeXQlOjQxU="

// API endpoint để xác thực và tạo JWT
app.post('/api/auth', async (req, res) => {
  const { idToken } = req.body;
  
  try {
    // Xác thực Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Lấy thông tin user từ Firestore
    const userDoc = await admin.firestore()
      .collection('users')
      .doc(decodedToken.uid)
      .get();
    
    const userData = userDoc.data();
    const userRole = userData?.role || 'user';

    // Tạo JWT token
    const jwtToken = jwt.sign(
      {
        uid: decodedToken.uid,
        email: decodedToken.email,
        role: userRole
      },
      JWT_SECRET,
      { expiresIn: '1h' } //Hết hạn sau 2 phút
    );

    res.json({ token: jwtToken });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});

// Kiểm tra token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired', expired: true });
        }
        return res.status(400).json({ error: 'Invalid token' });
    }
};

// API endpoint để kiểm tra token
app.post('/api/verify-token', verifyToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

app.listen(5000, () => console.log('Server running on port 5000'));