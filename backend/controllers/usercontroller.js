const User = require("../models/user");
const Recipe = require("../models/recipe");

// Get logged-in user profile with created and saved recipes
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user)
      .select("-password")
      .populate("savedRecipes");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const createdRecipes = await Recipe.find({ createdBy: user._id });

    res.status(200).json({
      user,
      createdRecipes,
      savedRecipes: user.savedRecipes || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatar } = req.body;
    const user = await User.findById(req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (fullName !== undefined) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getProfile, updateProfile };
