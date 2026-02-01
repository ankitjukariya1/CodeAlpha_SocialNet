const Post = require('../models/Post');
const User = require('../models/User');
const Tag = require('../models/Tag');
const validator = require('validator');

const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    let image = '';
    if (req.file) {
      image = '/uploads/' + req.file.filename;
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content is required' });
    }

    // Sanitize content to prevent XSS
    const sanitizedContent = validator.escape(content.trim());

   
    const post = new Post({
      content: sanitizedContent,
      author: req.user.id,
      image,
      tags: Array.isArray(tags) ? tags : []
    });

    await post.save();
    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: 1 } });
    await post.populate('author', 'username fullName avatar');
    await post.populate('tags', 'name'); 

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const currentUser = await User.findById(req.user.id);
    const followingIds = currentUser.following; 

    const totalPosts = await Post.countDocuments();
    
    // Show all posts (including user's own posts) sorted by most recent
    const posts = await Post.find()
      .populate('author', 'username fullName avatar')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean for better performance

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      hasMore: skip + posts.length < totalPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username fullName avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'username fullName avatar'
        }
      });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const hasLiked = post.likes.includes(req.user.id);

    if (hasLiked) {
      // Unlike - use atomic operation to prevent race conditions
      await Post.findByIdAndUpdate(
        req.params.id,
        { 
          $pull: { likes: req.user.id },
          $inc: { likesCount: -1 }
        }
      );
      return res.json({
        liked: false,
        likesCount: Math.max(0, post.likesCount - 1)
      });
    } else {
      // Like - use atomic operation to prevent race conditions
      await Post.findByIdAndUpdate(
        req.params.id,
        { 
          $addToSet: { likes: req.user.id },
          $inc: { likesCount: 1 }
        }
      );
      return res.json({
        liked: true,
        likesCount: post.likesCount + 1
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.author.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

   
    await User.findByIdAndUpdate(req.user.id, { $inc: { postsCount: -1 } });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments();
    const posts = await Post.find()
      .populate('author', 'username fullName avatar')
      .populate('tags', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(); // Use lean for better performance

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      hasMore: skip + posts.length < totalPosts
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (!post.author.equals(req.user.id)) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { content } = req.body;
    if (content) {
      post.content = validator.escape(content.trim());
    }

   
    if (req.file) {
      post.image = '/uploads/' + req.file.filename;
    }

    await post.save();
    await post.populate('author', 'username fullName avatar');
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPost,
  getFeedPosts,
  getPost,
  likePost,
  deletePost,
  getAllPosts,
  editPost
};