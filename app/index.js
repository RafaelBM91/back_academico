const http = require('http')
const express = require('express')
const path = require('path')
const graphqlHTTP = require('express-graphql')
const MyGraphQLSchema = require('./graphql-data')
const { graphql } = require('graphql')
const bodyParser = require('body-parser')
const Session = require('express-session')
const mongoDBStore = require('connect-mongodb-session')(Session)
const uuid = require('uuid')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')

const app = express()
const Server = http.createServer(app)

/**
 * IMPLEMENTO PARA UPLOAD IMAGES
 */
const FileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'avatars/')
  },
  filename: function (req, file, cb) {
    if (req.session.auth) {
      const file = path.resolve('avatars/' + req.session.auth.cedula + '.png')
      if( fs.existsSync( file ) ) {
        fs.unlinkSync( file )
      }
      cb(null, req.session.auth.cedula)
    }
  }
})
const FileUpload = multer({ storage: FileStorage })
/**
 * IMPLEMENTO PARA UPLOAD IMAGES
 */

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static( path.resolve('static') ))
app.use('/avatar', express.static( path.resolve('avatars') ))

const store = new mongoDBStore({
  uri: 'mongodb://localhost:27017/test-graphql',
  collection: 'session'
})

app.use(Session({
  name: 'sistema',
  secret: uuid(),
  saveUninitialized: true,
  resave: true,
  store: store,
  cookie: {
    secure: false,
    maxAge: 3600000
  }
}))

app.use('/graphiql', graphqlHTTP({
  schema: MyGraphQLSchema,
  graphiql: true
}))

app.post('/login', (req, res) => {
  let { grado, correo, clave} = req.body
  
  grado = Number( grado) 
  
  const tgrado =
    (grado === 1) ? 'administrador_auth' :
    (grado === 2) ? 'coordinador_auth' :
    (grado === 3) ? 'profesor_auth' :
    (grado === 4) ? 'alumno_auth' : null

  if (!tgrado) {
    return res.json({ faild: true })
  } 

  Query(`
      query {
        ${tgrado} (
          correo:"${correo}"
          clave:"${clave}"
        ) {
          _id
          cedula
          correo
          nombre
          apellido
          sexo
          direccion
          telefono
          image
        }
      } 
  `).then(resp => {
    const auth = resp.data.alumno_auth
    if (auth) {
      auth.grado = grado
      req.session.auth = auth
      res.json({ auth })
    } else {
      res.json({ faild: true })
    }
  })
})

app.post('/statuSession', (req, res) => {
  res.json({ auth: req.session.auth })
})

app.post('/closeSession', (req, res) => {
  req.session.auth = null
  res.json({ auth: undefined })
})

/*** QUERY FRONT TO GRAPHQL ***/
app.post('/query', (req, res) => {
  if (req.session.auth) {
    const { query } = req.body
    Query(query).then(resp => {
      const { data } = resp
      res.json({ data })
    })
  } else {
    res.json({ faild: true })
  }
})
/*** QUERY FRONT TO GRAPHQL ***/

/**
 * IMPLEMENTO PARA UPLOAD IMAGES
 */
app.post('/avatar', FileUpload.single('avatar'), async (req, res) => {
  res.redirect('/')
})
/**
 * IMPLEMENTO PARA UPLOAD IMAGES
 */

app.use('*', (req, res) => {
  //res.end('<h1>Error 404</h1>')
  res.sendFile( path.resolve('api/index.html') )
})

/*** QUERY-GRAPHQL ***/
const Query = (query) =>
  graphql({
     schema: MyGraphQLSchema,
    source: query
  })
/*** QUERY-GRAPHQL ***/

Server.listen(4000, function () {
  console.log('escucha puerto :4000','...start...')
})
