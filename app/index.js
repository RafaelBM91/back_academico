const express = require('express')
const graphqlHTTP = require('express-graphql')
const MyGraphQLSchema = require('./graphql-data')

const app = express()

// app.use('/', graphqlHTTP({
//   schema: MyGraphQLSchema,
//   graphiql: true
// }))

app.use('/session', (req, res) => {
  // console.log(reg)
  res.end('hola')
})

app.listen(4000, () => {
	console.log('escucha puerto :4000','...start...')
})
