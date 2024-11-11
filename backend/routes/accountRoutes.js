const express = require('express');
const { getAllAccounts, getAccountById, createAccount, updateAccount, deleteAccount } = require('../controllers/accountController');
const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/get', authMiddleware, authorizeRoles(['admin']), getAllAccounts);
router.get('/get/:id', authMiddleware, authorizeRoles(['admin']), getAccountById);
router.post('/create', authMiddleware, authorizeRoles(['admin']), createAccount);
router.put('/update/:id', authMiddleware, authorizeRoles(['admin']), updateAccount);
router.delete('/delete/:id', authMiddleware, authorizeRoles(['admin']), deleteAccount);

module.exports = router;