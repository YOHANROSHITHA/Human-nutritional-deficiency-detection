import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    // Remove password from response
    user.password = undefined;

    res.status(201).json({
      message: 'User registered successfully',
      user
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Remove password from response
    user.password = undefined;

    res.json({
      message: 'Login successful',
      user
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};
