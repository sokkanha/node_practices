//?⚠️ Routes are registered in your route definition files (e.g., users.route.js), not inside controller functions.
const Users = require('../models/users.model');
const jwt = require('jsonwebtoken');

/**
 * todo: Register
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.registerLogin = async (req , res) => {
    try {

        const {email, password, username , role} = req.body;
        const existEmail = await Users.findOne({email});
        const existUsername = await Users.findOne({username})

        /**
         * check if email or username is exits 
         * user can't register with the same username or email
         */
        if(existEmail || existUsername) { 
            return res.status(400).json({message: 'User already exists'})
        };

        const user = await Users.create({email, password, username, role});
        await user.save();
        res.json({ user, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.createUser = async (req, res) => {
    try {
        const { email, password, username, confirmPassword, role } = req.body;

        // Check password match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // ✅ Actually query the database
        const existEmail = await Users.findOne({ email });
        const existUsername = await Users.findOne({ username });

        if (existEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        if (existUsername) {
            return res.status(400).json({ message: 'Username already taken' });
        }

        // Default role if not provided
        const userRole = role || 'user';

        // Create user
        const user = await Users.create({
            email,
            password,  // make sure you hash this in a pre-save hook!
            username,
            role: userRole
        });
        // No need to call user.save() again if using create()

        res.status(201).json({ user, message: 'User created successfully' });

    } catch (error) {
        console.error(error); // helpful for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

/**
 * todo: Login
 */
exports.userLogin = async (req , res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing fields' });
        }
        /**
         * Documents returned with .lean() will not have Mongoose-specific features or methods available.
        */ 
        // !   const user = await Users
        // !   .findOne({email})
        // !   .select('_id password').lean(); 

        /**
         * ! also make sure password is selected if it's excluded by default
         */
        const user = await Users.findOne({ email }).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please contact the administrator.' });
        }
        if (!user.email) {
            return res.status(400).json({ message: 'Invalid email (e.g., @gmail.com).' });
        }

        const passwordValidate = await user.validatePassword(password);
        if (!passwordValidate) {
            return res.status(400).json({ message: 'Invalid password!' });
        }

        const token = jwt.sign(
            { userId: user._id, userName: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, message: 'Login success!', user });
        } catch (error) {
            console.error('Login Error:', error);  // improved
            res.status(500).json({ message: 'Server error' });
        }
        }

//* List all users (only admin can access)
exports.getUsers = async (req, res) => {
    try {
        let { username } = req.query; // filter search by query username

        // Normalize weird quoting or whitespace
        if (typeof username === "string") {
            username = username.trim();
            username = username.replace(/^["']+|["']+$/g, ""); // remove quote marks
        }

        const filter = {};

        if (username) {
            filter.username = { $regex: username, $options: "i" };
        }

        const users = await Users.find(filter, "-password -__v");
        res.send(users);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



/**
 * todo: Delete User
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const exist = await Users.findOne({_id: id});
        if(!exist) {
            return res.status(404).json( {message: 'User not found'});
        }
        const users = await Users.findByIdAndDelete(id);
        res.json({message: `User name '${users.username}' has been deleted!`})
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

/**
 * todo: Update user by id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updateUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const exist = await Users.findOne({_id: id});
        if(!exist) {
            return res.status(404).json( {message: 'User not found'});
        }
        const user = await Users.findByIdAndUpdate(id, req.body,
            {   new: true, // !  in update methods to return updated doc
                runValidators: true //! to enforce schema validation during updates.
            }).select('-password');
        res.json({message: 'User updated successfully !', user})
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

/**
 * todo: get user by id
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const exist = await Users.findOne({_id: id});
        if(!exist) {
            return res.status(404).json( {message: 'User not found'});
        }
        const users = await Users.findById(id);
        res.json({users, message: `Welcome ${users.username}`})
    } catch (error) {
        res.status(500).json({message: 'Server error'});
    }
}

exports.ValidateToken = async(req, res) => {
    const {token} = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.json({valid: false, message: 'Invalid Token'})
    }
}