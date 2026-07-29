import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    profileStatus: {
      type: String,
      enum: ['incomplete', 'pending', 'approved', 'rejected'],
      default: 'incomplete',
    },
    age: Number,
    city: String,
    occupation: String,
    bio: String,
    photos: [String],
  },
  { timestamps: true }
);

// module.exports = mongoose.models.User || mongoose.model('User', userSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;