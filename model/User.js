import mongoose from "mongoose";

// 1. Define Counter Schema to track the last assigned numeric ID
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 100 }, // Starts at 100 so the first user gets 101
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema)

// 2. Define User Schema with numeric _id
const userSchema = new mongoose.Schema(
  {
    _id: {
      type: Number, // Overrides default ObjectId with numeric sequence
    },
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
      enum: ["male", "female"],
      required: true,
    },
    profileStatus: {
      type: String,
      enum: ["incomplete", "pending", "approved", "rejected"],
      default: "incomplete",
    },
    age: Number,
    city: String,
    occupation: String,
    bio: String,
    photos: [String],
  },
  { timestamps: true }
);

// 3. Pre-save hook to fetch and increment sequence automatically
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "userId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this._id = counter.seq;
  }
  next();
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;