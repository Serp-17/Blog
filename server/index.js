import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { registerValidator, loginValidator } from './validations/auth.js';
import { postCreateValidator } from './validations/post.js';
import { checkAuth, handleValidationErrors } from './utils/index.js';
import { PostControllers, UserControllers } from './constrollers/index.js';

const app = express();
app.use('/api/uploads', express.static('uploads'))
const storege = multer.diskStorage({
    destination:  (_,__, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({storege});

mongoose.connect('mongodb+srv://root:root@blog.kgrwrqn.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log("Connect DB"))
    .catch((err) => console.log(err));

app.use(express.json());

app.post('/api/uploads', checkAuth, upload.single('image'), (req,res) => {
    console.log(req.file)
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
});

app.post('/auth/register', registerValidator, handleValidationErrors, UserControllers.register);
app.post('/auth/login', loginValidator, handleValidationErrors, UserControllers.login);
app.get('/auth/check', checkAuth, UserControllers.checkAuth);

app.post('/posts',
    checkAuth,
    postCreateValidator, 
    handleValidationErrors,
    PostControllers.create
);
app.get('/posts', PostControllers.getAll);
app.get('/posts/:id', PostControllers.getPost);
app.delete('/posts/:id', checkAuth, PostControllers.removePost);
app.patch('/posts/:id', 
    checkAuth, 
    postCreateValidator,
    handleValidationErrors,
    PostControllers.editPost
);

app.listen(3000);
