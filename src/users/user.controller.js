import User from "./user.model.js";

export const updateUser = async (req, res) => {
    const userId = req.user.uid;
    const { email, username, password } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { email, username, password }, { new: true });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.status(200).json({
            msg: "Your account has been update",
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error'});
    }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user || req.user.uid !== id) {
      return res.status(403).json({ msg: 'You are not authorized to delete this user' });
    }

    const user = await User.findByIdAndDelete(id, { state: false});
    res.status(200).json({ msg: 'The user is successfully deleted', user });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Contact the administrator' });
  }
}