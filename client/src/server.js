import express from 'express'
import config from './config.js'
import ejs from 'ejs'
import path from 'path'

const app = express()

app.set('view engine', 'html')
app.engine('html', ejs.renderFile)
app.use(express.static( path.join(process.cwd(), 'src', 'public') ))
app.set('views', path.join(process.cwd(), 'src', 'views'))

app.get('/', (req, res) => res.render('index'))
app.get('/login', (req, res) => res.render('login'))
app.get('/register', (req, res) => res.render('register'))

app.listen( config.PORT, () => console.log('Client server is running on http://localhost:' + config.PORT) )