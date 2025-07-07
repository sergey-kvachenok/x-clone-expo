import expressAsyncHandler from "express-async-handler";
import Comment from "../models/comment.model.js";
import Post from "../models/post.model.js";
import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import mongoose from "mongoose";

export const getComments = expressAsyncHandler(async (req, res) =>
{ 
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate('user', 'username profilePicture lastName firstName');

  res.status(200).json({ comments });
})

export const createComment = expressAsyncHandler(async (req, res) =>
{ 
  const { postId } = req.params;
  const { content } = req.body;
  const { userId } = getAuth(req);

  if (!postId || !content.trim() === '')
  {
    return res.status(400).json({ message: 'Post ID and content are required' });
  }

  const post = await Post.findById(postId);
  const user = await User.findOne({ clerkId: userId });

  if (!post || !user)
  {
    return res.status(404).json({ message: 'Post or user not found' });
  }

  const session = await mongoose.startSession();
  let comment;

  try {
    await session.withTransaction(async () => {
      const createdComments = await Comment.create([
        { post: postId, user: userId, content }
      ], { session });
      comment = createdComments[0];

      await post.updateOne({ $push: { comments: comment._id } }, { session });

      if (post.user.toString() !== userId.toString()) {
        await Notification.create([
          {
            from: userId,
            to: post.user,
            post: postId,
            comment: comment._id,
            type: 'comment',
          }
        ], { session });
      }
    });
    res.status(201).json({ comment });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
})

export const deleteComment = expressAsyncHandler(async (req, res) =>
{ 
  const { commentId } = req.params;
  const { userId } = getAuth(req);

  const comment = await Comment.findById(commentId);
  const user = await User.findOne({ clerkId: userId });

  if (!comment || !user)
  {
    return res.status(404).json({ message: 'Comment or user not found' });
  }

  if (comment.user.toString() !== userId)
  {
    return res.status(403).json({ message: 'You are not authorized to delete this comment' });
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await Comment.findByIdAndDelete(commentId, { session });

      await Post.updateOne({ $pull: { comments: commentId } }, { session });

      if (comment.user.toString() !== userId) {
        await Notification.deleteMany({ comment: commentId }, { session });
      }
    });
    
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
})