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
const mongoose = require('./mongodb')

const app = express()
const Server = http.createServer(app)
//const io = require('socket.io')(Server)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/static', express.static( path.resolve('static') ))

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
  const { grado, correo, clave} = req.body

  Query(`
      query {
        alumno_auth (
          correo:"${correo}"
          clave:"${clave}"
        ) {
          _id
          cedula
          nombre
          apellido
          correo
        }
      } 
  `).then(resp => {
    const auth = resp.data.alumno_auth
    if (auth) {
      // test para grado
      auth.grado = 4
      req.session.auth = auth
      res.json({ auth })
    } else {
      res.json({ faild: true })
    }
  })

  /*if (Number(grado) === 1 && correo === 'rafa' && clave === '123') {
    req.session.open = { correo, grado }
    res.json({ session: req.session.open, ok: true })
  } else {
    res.json({ ok: false })
  }*/
  // res.json({ ok: true })
})

app.post('/statuSession', (req, res) => {
  res.json({ auth: req.session.auth })
})

app.post('/closeSession', (req, res) => {
  req.session.auth = null
  res.json({ auth: undefined })
})

app.use('*', (req, res) => {
  //res.end('<h1>Error 404</h1>')
  res.sendFile( path.resolve('api/index.html') )
})

/*** SOCKET.IO ***/

/*const dentro = io.of('/')

io.on('connection', function (socket) {
  socket.on('req', (data) => {
    console.log( data )
    dentro.emit('res', data + ' zion baby')
  })
  socket.on('reauth', (data) => {
    const SessionSchema = new mongoose.Schema({}, { collection: 'session' })
    const SessionDB = mongoose.model('session', SessionSchema)
    // console.log( data )
    // console.log( SessionDB )
    SessionDB.find({ auth: data }, (err, data) => {
      console.log( data )
    })
  })
  console.log( socket.request.headers )
})*/

/*** SOCKET.IO ***/

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
