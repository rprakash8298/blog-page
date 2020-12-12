const path = require('path')
const express = require('express')
const app = express()
const hbs = require('hbs')
const blogRouter = require('./routes/blog')
const Article = require('./models/artileModel')
const methodOverride = require('method-override')

require('./db/mongoose')
const port = process.env.PORT || 9000
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, './views/partials'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))


app.get('/',async (req, res) => {
    const articles = await Article.find().sort({createdAt:'desc'})
    
    res.render('articles/index' ,{articles:articles})
})
app.use('/articles', blogRouter)

app.listen(port, () => {
    console.log('app running successfully ' + port)
})