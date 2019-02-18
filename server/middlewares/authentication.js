const jwt = require('jsonwebtoken');

// Check Token
let checkToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();
    });    
};

let checkRole = (req, res, next) => {
    if (req.user.role === 'ADMIN_ROLE') {
        next(); 
    } else {
        return res.status(400).json({
            ok: false,
            err: { msg: 'The user is not an Administrator'}
        });
    }
    
};

module.exports = {
    checkToken,
    checkRole
}