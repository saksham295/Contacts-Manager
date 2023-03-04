import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: null },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  contacts: [
    {
      contactName: { type: String, default: null },
      contactPhone: { type: String, required: true },
      contactEmail: { type: String, default: null },
      contactAddress: { type: String, default: null },
    },
  ],
});

const User = mongoose.model("user", userSchema);
export default User;
