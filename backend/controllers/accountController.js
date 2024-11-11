const User = require('../models/User');

exports.getAllAccounts = async (req, res) => {
    try {
        const accounts = await User.find().select(['-password', '-createdAt', '-updatedAt', '-__v']).sort({ _id: -1 });
        if (!accounts) return res.status(404).json({ message: 'No accounts found' });
        res.json(accounts);
    } catch (error) {
        res.status(500).json({ message: 'Error getting accounts', error });
    }
}

exports.getAccountById = async (req, res) => {
    try {
        const account = await User.findById(req.params.id).select(['-password', '-createdAt', '-updatedAt', '-__v']);
        if (!account) return res.status(404).json({ message: 'No account found' });
        res.json(account);
    } catch (error) {
        res.status(400).json({ message: 'Error getting account', error });
    }
}

exports.createAccount = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const account = new User({ username, email, password, role });
        await account.save();
        res.status(201).json(account);
    } catch (error) {
        res.status(400).json({ message: 'Error creating account', error });
    }
}

exports.updateAccount = async (req, res) => {
    const { username, email, role } = req.body;
    try {
        const account = await User.findByIdAndUpdate(req.params.id, { username, email, role }, { new: true });
        if (!account) return res.status(404).json({ message: 'No account found' });
        res.json(account);
    } catch(error) {
        res.status(400).json({ message: 'Error updating account', error });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const account = await User.findByIdAndDelete(req.params.id);
        if (!account) return res.status(404).json({ message: 'No account found' });
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting account', error });
    }
}

