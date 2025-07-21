import asyncHandler from 'express-async-handler';
import Post from '../models/post.model.js';
import User from '../models/user.model.js';
import cloudinary from '../config/cloudinary.js';
import { getAuth } from '@clerk/express';
import Notification from '../models/notification.model.js';


export const getPosts = asyncHandler(async (req, res) =>
{
  const posts = await Post.find()
  .sort({ createdAt: -1 })
    .populate('user', 'username firstName lastName profilePicture')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username firstName lastName profilePicture'
      }
    })
 

  res.status(200).json({ posts });
})

export const getPost = asyncHandler(async (req, res) =>
{
  const { postId } = req.params;

  const post = await Post.findById(postId)
  .populate('user', 'username firstName lastName profilePicture')
  .populate({
    path: 'comments',
    populate: {
      path: 'user',
      select: 'username firstName lastName profilePicture'
    }
  })

  if (!post) {
    return res.status(404).json({ message: 'Post not found' });
  }

  res.status(200).json({ post });
})

export const getUserPosts = asyncHandler(async (req, res) =>
{
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const posts = await Post.find({ user: user._id })
  .sort({ createdAt: -1 })
    .populate('user', 'username firstName lastName profilePicture')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: 'username firstName lastName profilePicture'
      }
    })
  
  res.status(200).json({ posts });
})


export const createPost = asyncHandler(async (req, res) =>
{
  const { userId } = getAuth(req);
  const { content } = req.body;
  const imageFile = req.file;

     console.log('HERE', req.body, userId)

  if (!imageFile && !content)
  {
    console.log('HERE 1', {imageFile, content})
    return res.status(400).json({ message: 'Post content or image is required' });
  }

     console.log('HERE', {content, imageFile})
  const user = await User.findOne({ clerkId: userId });
   console.log('HERE', {user})
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let imageUrl = '';

  if (imageFile)
  {
    try
    {
      const base64Image = `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;

      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: 'social-media_posts',
        resource_type: 'image',
        transformation: [
          { width: 800, height: 600, crop: 'limit' },
          { quality: 'auto' },
          { format: "webp" }
        ]
      });

      imageUrl = uploadResponse.secure_url;
    } catch (uploadError) {
      console.log('Cloudinary upload error:', uploadError)
      return res.status(500).json({ message: 'Failed to upload image' });
    }
  }



  const newPost = await Post.create({ 
    user: user._id,
    content,
    image: imageUrl,
  });

  res.status(201).json({ post: newPost });

  
})

export const likePost = asyncHandler(async (req, res) =>
{
  const { postId } = req.params;
  const { userId } = getAuth(req);

  const post = await Post.findById(postId);
  const user = await User.findOne({ clerkId: userId });

  if (!post || !user) {
    return res.status(404).json({ message: 'Post or user not found' });
  }
 
  const isLiked = post.likes.includes(user._id);

  if (isLiked) {
    // unlike
    await Post.findByIdAndUpdate(postId, { $pull: { likes: user._id } });
  } else {
    // like
    await Post.findByIdAndUpdate(postId, { $push: { likes: user._id } });

    await Notification.create({
      to: post.user,
      type: 'like',
      from: user._id,
      post: postId,
    });
  }

  res.status(200).json({ message: isLiked ? 'Post unliked successfully' : 'Post liked successfully' });
  
})

export const deletePost = asyncHandler(async (req, res) =>
{
  const { postId } = req.params;
  const { userId } = getAuth(req);

  const post = await Post.findById(postId);
  const user = await User.findOne({ clerkId: userId });

  if (!post || !post)
  {
    return res.status(404).json({ message: 'Post or user not found' });
  }

  if (post.user.toString() !== user._id.toString())
  {
    return res.status(403).json({ message: 'You are not authorized to delete this post' });
  }

  await Post.findByIdAndDelete(postId);

  res.status(200).json({ message: 'Post deleted successfully' });
  
})