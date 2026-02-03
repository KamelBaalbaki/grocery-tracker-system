const userService = require("../services/user.service");

const getMe = async (req, res) => {
    try {
        const user = await userService.getUserById(req.user.userId);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getUserById = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);

        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is required" });
        }
        const user = await userService.updateUser(req.params.id, req.body);
        if (!user) return res.status(404).json({ message: "User not found"});
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found"})
        res.json(user)
    }
        catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logout = async (req, res) => {
    try {
        // For stateless JWT, just return message
        const result = await userService.logoutUser();
        res.json(result);

        // OPTIONAL: If using cookies:
        // res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
        // res.json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMe,
    getUserById,
    updateUser,
    deleteUser,
    logout
};
