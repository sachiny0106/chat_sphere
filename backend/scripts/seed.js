import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/database.js";
import { User } from "../models/userModel.js";
import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";

dotenv.config();

const demoUsers = [
  {
    fullName: "Demo Recruiter",
    username: "demo@chat.com",
    password: "Demo123!",
    gender: "male",
  },
  {
    fullName: "Alex Applicant",
    username: "alex@chat.com",
    password: "Demo123!",
    gender: "female",
  }
];

const seed = async () => {
  try {
    await connectDB();

    const userIds = {};
    for (const user of demoUsers) {
      const existing = await User.findOne({ username: user.username });
      if (existing) {
        userIds[user.username] = existing._id;
        continue;
      }
      const hashed = await bcrypt.hash(user.password, 10);
      const profilePhoto = user.gender === "male"
        ? `https://avatar.iran.liara.run/public/boy?username=${user.username}`
        : `https://avatar.iran.liara.run/public/girl?username=${user.username}`;
      const created = await User.create({
        fullName: user.fullName,
        username: user.username,
        password: hashed,
        profilePhoto,
        gender: user.gender,
      });
      userIds[user.username] = created._id;
    }

    const demoId = userIds["demo@chat.com"];
    const alexId = userIds["alex@chat.com"];

    let conversation = await Conversation.findOne({
      participants: { $all: [demoId, alexId] }
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [demoId, alexId],
        messages: [],
      });
    }

    const existingMessages = await Message.find({
      senderId: { $in: [demoId, alexId] },
      receiverId: { $in: [demoId, alexId] },
    }).countDocuments();

    if (existingMessages === 0) {
      const seedMessages = [
        { senderId: demoId, receiverId: alexId, message: "Hey Alex, welcome to Chat Sphere!" },
        { senderId: alexId, receiverId: demoId, message: "Thanks! Loving the new theme toggles." },
        { senderId: demoId, receiverId: alexId, message: "Try the demo login button anytime." },
      ];

      const createdMsgs = await Message.insertMany(seedMessages);
      conversation.messages.push(...createdMsgs.map(m => m._id));
      await conversation.save();
    }

    console.log("✅ Seeded demo users and sample conversation.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seed();
