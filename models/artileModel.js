const mongoose = require('mongoose')
const marked = require('marked')
const slugify = require('slugify')
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const { Buffer } = require('buffer')
const { Binary } = require('bson')
const dompurify = createDomPurify(new JSDOM().window)
const artilceSchema = new mongoose.Schema({
     images: {
        type:String
    },
    title: {
        type: String,
        required: true,
        trim:true
    },
    description: {
        type: String,
        required: true,
        trim:true
    },
    markdown: {
        type: String,
        required:true
    },
    createdAt: {
        type: Date,
        default:Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique:true
    },
    sanitizeHtml: {
        type: String,
        required:true
    },
    cloudinary_id: {
        type:String
    }
   
})
artilceSchema.pre('validate', function (next) {
    if (this.title) {
        this.slug =slugify(this.title, {lower:true,strict:true})
    }
    if (this.markdown) {
        this.sanitizeHtml =dompurify.sanitize(marked(this.markdown))
    }
    next()
})
module.exports=mongoose.model('Articles',artilceSchema)