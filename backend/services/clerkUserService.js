const User = require("../models/User");

const syncClerkUser = async (clerkId, profile = {}) => {
  if (!clerkId) {
    throw new Error("Clerk user id is required");
  }

  const primaryEmail = profile.email;

  if (!primaryEmail) {
    throw new Error("Authenticated Clerk user email is missing");
  }

  const fullName =
    profile.name ||
    [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
    profile.username ||
    primaryEmail.split("@")[0];

  const user = await User.findOneAndUpdate(
    {
      $or: [{ clerkId }, { email: primaryEmail }]
    },
    {
      clerkId,
      email: primaryEmail,
      name: fullName,
      avatar: profile.avatar || profile.imageUrl
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return user;
};

module.exports = { syncClerkUser };
