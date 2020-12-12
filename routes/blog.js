const express = require('express')
const multer = require('multer')
const router = express.Router()
const Article = require('../models/artileModel')
const cloudinary = require('cloudinary')
router.get('/new', (req, res) => {
    res.render('articles/new', {article:new Article()})
})
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit', { article: article })
})
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if(article == null) res.redirect('/')
    res.render('articles/show', {article:article})
})
var storage = multer.diskStorage({
	filename: function (req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function (req, file, cb) {
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: imageFilter })
cloudinary.config({
    cloud_name: 'do1ztuacw',
    api_key: '149988255623473',
    api_secret:'dG8X7emndqfcqgWpGNLs2s4Iikg'
})
router.post('/', upload.single('images'), async (req, res) => {

    const result = await cloudinary.uploader.upload(req.file.path)
    let article = new Article({
        images:result.secure_url,
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown,
    })
    try {
        article = await article.save()
        res.redirect(`articles/${article.slug}`)
    } catch (e) {
        console.log(e)
        res.render('articles/new', {article:article})
    }
})


router.put('/:id', upload.single('images'), async (req, res) => {

    try {
    const results = await cloudinary.uploader.upload(req.file.path)
        const data = {
       images:results.secure_url,
       title: req.body.title,
       description: req.body.description,
       markdown:req.body.markdown
        }
         await Article.findByIdAndUpdate(req.params.id, data)
        res.render('articles/show')
    } catch (e) {
            res.redirect('article/edit')
         }       
})

router.delete('/:id', async (req, res) => {
         await Article.findByIdAndDelete(req.params.id)
    res.redirect('/')
    
})

module.exports = router