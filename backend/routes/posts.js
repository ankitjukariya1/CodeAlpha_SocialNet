const express = require('express');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {
  createPost,
  getFeedPosts,
  getPost,
  likePost,
  deletePost,
  getAllPosts,
  editPost
} = require('../controllers/postController');

const router = express.Router();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter
});


router.post('/', auth, upload.single('image'), createPost);


router.get('/feed', auth, getFeedPosts);


router.post('/:id/like', auth, likePost);


router.delete('/:id', auth, deletePost);

router.put('/:id', auth, upload.single('image'), editPost);


router.get('/all', getAllPosts);
router.get('/:id', auth, getPost);

module.exports = router;