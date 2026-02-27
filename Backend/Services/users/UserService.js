const User = require("../../Model/users/UserModel");
const jwt = require("jsonwebtoken");

class UserService {
  // Generate JWT Token
  generateToken(userId, role) {
    const token = jwt.sign(
      { id: userId, role: role || 'Patient' },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    return token;
  }

  // User Registration
  async registerUser(data) {
    const { name, email, phone, password, confirmPassword, agreeToTerms, role, address, doctorCredentials } = data;

    // Validation
    if (!name || !email || !phone || !password || !agreeToTerms) {
      throw new Error("All fields are required");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    // Validate role if provided
    if (role && !['Patient', 'Doctor', 'Admin', 'Official'].includes(role)) {
      throw new Error("Invalid role. Must be Patient, Doctor, Admin, or Official");
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      agreeToTerms,
      role: role || 'Patient',
      address: address || {},
      doctorCredentials: (role === 'Doctor' && doctorCredentials) ? doctorCredentials : {},
      accountStatus: 'Active'
    });

    await user.save();

    // Generate JWT Token
    const token = this.generateToken(user._id, user.role);

    return {
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        accountStatus: user.accountStatus,
        ...(user.role === 'Doctor' && { doctorCredentials: user.doctorCredentials })
      }
    };
  }

  // User Login
  async loginUser(data) {
    const { email, password, rememberMe } = data;

    // Validation
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Update rememberMe if provided
    if (rememberMe !== undefined) {
      user.rememberMe = rememberMe;
      await user.save();
    }

    // Generate JWT Token
    const token = this.generateToken(user._id, user.role);

    return {
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address,
        accountStatus: user.accountStatus,
        rememberMe: user.rememberMe,
        ...(user.role === 'Doctor' && { doctorCredentials: user.doctorCredentials })
      }
    };
  }

  // Get all users
  async getAllUsers() {
    const users = await User.find().select("-password");
    
    if (!users || users.length === 0) {
      throw new Error("No users found");
    }

    return {
      success: true,
      count: users.length,
      users
    };
  }

  // Get user by ID
  async getUserById(id) {
    const user = await User.findById(id).select("-password");
    
    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      user
    };
  }

  // Update user by ID (Admin/SuperUser only)
  async updateUser(id, data) {
    const { name, email, phone, role, address, doctorCredentials, accountStatus } = data;
    
    // Validate role if provided
    if (role && !['Patient', 'Doctor', 'Admin', 'Official'].includes(role)) {
      throw new Error("Invalid role. Must be Patient, Doctor, Admin, or Official");
    }

    // Validate accountStatus if provided
    if (accountStatus && !['Active', 'Suspended', 'Pending'].includes(accountStatus)) {
      throw new Error("Invalid account status. Must be Active, Suspended, or Pending");
    }
    
    const updateData = { name, email, phone };
    if (role) updateData.role = role;
    if (address) updateData.address = address;
    if (accountStatus) updateData.accountStatus = accountStatus;
    if (role === 'Doctor' && doctorCredentials) updateData.doctorCredentials = doctorCredentials;
    
    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      message: "User updated successfully",
      user
    };
  }

  // Update own profile using JWT
  async updateOwnProfile(userId, data) {
    const { name, email, phone, address, doctorCredentials } = data;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    
    // Only allow doctors to update their credentials
    const user = await User.findById(userId);
    if (user.role === 'Doctor' && doctorCredentials) {
      updateData.doctorCredentials = doctorCredentials;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return {
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    };
  }

  // Delete user by ID
  async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      message: "User deleted successfully"
    };
  }
}

module.exports = new UserService();
