import { User } from './user.model.js';
import bcrypt from 'bcryptjs';

export const listUsers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const users = await User.find(
      { tenantId },
      { password: 0 }
    ).sort({ createdAt: -1 });

    res.json({ users });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users'
    });
  }
};

export const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    const tenantId = req.user.tenantId;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ tenantId, email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already in team' });
    }

    const user = await User.create({
      tenantId,
      email,
      role,
      status: 'pending',
      password: 'PENDING_INVITATION'
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json(userObj);
  } catch (error) {
    res.status(500).json({
      message: error.message || 'Failed to invite user'
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { displayName, avatarUrl } = req.body;
    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(
      userId,
      { displayName, avatarUrl },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update profile' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new password are required' });
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid current password' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update password' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    await User.findByIdAndDelete(userId);

    res.json({ message: 'Account terminated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to terminate account' });
  }
};
