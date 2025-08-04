const Users = require('../models/users.model');
const jwt = require('jsonwebtoken');

//* Register
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

//* Login
exports.userLogin = async (req , res) => {
    try {
       const { email, password } = req.body;
       if (!email || !password) 
        return res.status(400).json({ message: 'Missing fields' });
       
        /**
         * Documents returned with .lean() will not have Mongoose-specific features or methods available.
        */ 
        // !   const user = await Users
        // !   .findOne({email})
        // !   .select('_id password').lean(); 
        

        /**
         * !also make sure password is selected if it's excluded by default
         */
        const user = await Users.findOne({ email }).select('+password'); 
        const passwordValidate = await user.validatePassword(password);

        if (!user) {
            return res.status(400).json({ message: 'Invalid email!' });
        }
        if (!passwordValidate) {
            return res.status(400).json({ message: 'Invalid password!' });
        }


        const token = jwt.sign({  userId: user._id,  userName: user.username, role: user.role }, 
        process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
       res.json({token, message: 'Login success!'})
 
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

//* List all users (only admin can access)
exports.getUsers = async (req, res) => {
  try {
    //? 'users' array will contain user objects without the 'password' and '__v' fields 
    const users = await Users.find({}, '-password -__v');
    res.send(users)// exclude sensitive fields 
  } catch (error) {
     res.status(500).json({ message: 'Server error' });
  }
}
