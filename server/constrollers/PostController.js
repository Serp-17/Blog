import PostModel from '../models/Post.js';

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        res.status(500).json({
            message: "Posts server error"
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();

        res.json(posts);
    } catch (err) {
        res.status(500).json({
            message: "Get posts server error"
        });
    }
};

export const getPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: { viewsCount: 1 }
            }
        );
        res.json(post);
    } catch (err) {
        res.status(500).json({
            message: "Get post server error"
        });
    }
};

export const removePost = async (req, res) => {
    try {
        const postId = req.params.id;
        await PostModel.findOneAndDelete(
            {
                _id: postId
            }
        );
        res.json({
            succes: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Get post server error"
        });
    }
};

export const editPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await PostModel.updateOne(
            {
                _id: postId
            },
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
                user: req.userId
            }
        );

        res.json({
            succes: true
        })
    } catch (err) {
        res.status(500).json({
            message: "Edit post server error"
        });
    }
};