const jwt = require('jsonwebtoken');

// Step 1: Generate Token
const generateToken = (user) => {
    const token = jwt.sign({ id: user.id, email: user.email }, 'your_secret_key', { expiresIn: '1h' });
    return token;
};

// Step 2: Send Token to Client (Assuming this is part of a login route handler)
app.post('/login', (req, res) => {
    // Assuming user authentication is successful
    const user = { id: 1, email: 'user@example.com' };
    
    // Generate token
    const token = generateToken(user);
    
    // Send token in response
    res.json({ token });
});

// Step 4: Middleware to Verify Token on Incoming Requests
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'Token is required' });
    }

    jwt.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        
        req.user = decoded;
        next();
    });
};

// Step 5: Protected Route Example
app.get('/protected', verifyToken, (req, res) => {
    // Access user information from req.user
    res.json({ message: 'Protected route', user: req.user });
});
