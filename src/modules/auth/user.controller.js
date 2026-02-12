import { User } from './user.model.js';

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

    // Create user in pending status
    // Note: In a real app, we'd send an email here with a join link
    const user = await User.create({
      tenantId,
      email,
      role,
      status: 'pending',
      // Provide a dummy password for now since it's required in the model
      // In a real app, we'd make password optional or handle it via Invitation model
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
