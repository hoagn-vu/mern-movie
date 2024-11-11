const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access token required" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = user; // thông tin từ token
        next();
    });
};

const authorizeRoles = (allowedRoles) => async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Lấy người dùng từ cơ sở dữ liệu dựa vào ID trong mã token
        const user = await User.findById(req.user._id).select(['-password', '-createdAt', '-updatedAt', '-__v']);
        // console.log("User: ", user);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Kiểm tra vai trò của người dùng
        if (!allowedRoles.includes(user.role)) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Tiếp tục nếu người dùng có quyền truy cập
        next();
    } catch (error) {
        console.error("Error in authorization middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { authMiddleware, authorizeRoles };









// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// const authMiddleware = (req, res, next) => {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ error: "No token provided" });

//     const token = authHeader.split(" ")[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if (err) return res.status(403).json({ error: "Invalid token" });
//         req.user = user;
//         // console.log("User: ", req.user);
//         next();
//     });
// };

// const authorizeRoles = (allowedRoles) => (req, res, next) => {
//     if (!req.user) {
//         return res.status(401).json({ message: "Unauthorized" });
//     }
//     const userRole = User.findById(req.user.id);

//     // Kiểm tra xem vai trò của người dùng có nằm trong danh sách `allowedRoles` hay không
//     if (!allowedRoles.includes(userRole)) {
//         return res.status(403).json({ message: "Access denied" });
//     }

//     // Tiếp tục nếu người dùng có quyền truy cập
//     next();
// };

// module.exports = { authMiddleware, authorizeRoles };
