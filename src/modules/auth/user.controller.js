import { User } from './user.model.js';

export const listUsers = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const users = await User.find(
      { tenantId },
      { password: 0 }
    );

    res.json({ users });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch users'
    });
  }
};
