const express = require('express');
const { getAllAccounts, getAccountById, createAccount, updateAccount, deleteAccount, updateAvatarFullname, updateUsernamePassword, changePassword } = require('../controllers/accountController');
// const { authMiddleware, authorizeRoles } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/get', getAllAccounts);
router.get('/get/:id', getAccountById);
router.post('/create', createAccount);
router.put('/update/:id', updateAccount);
router.delete('/delete/:id', deleteAccount);

router.put('/update-avatar-fullname/:userId', updateAvatarFullname);
router.put('/update-username-password/:userId', updateUsernamePassword);
router.put('/change-password/:userId', changePassword);
// router.get('/get', authMiddleware, authorizeRoles(['admin']), getAllAccounts);
// router.get('/get/:id', authMiddleware, authorizeRoles(['admin']), getAccountById);
// router.post('/create', authMiddleware, authorizeRoles(['admin']), createAccount);
// router.put('/update/:id', authMiddleware, authorizeRoles(['admin']), updateAccount);
// router.delete('/delete/:id', authMiddleware, authorizeRoles(['admin']), deleteAccount);

module.exports = router;