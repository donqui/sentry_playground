const queries = require('./db/queries');

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const Sentry = require('@sentry/node')


const app = express();


// SENTRY
Sentry.init({
  environment: process.env.NODE_ENV || 'development',
  integrations: [
    new Sentry.Integrations.Http({ tracing: true })
  ],
  sampleRate: 1.0,
  tracesSampleRate: 0.0
});

app.use(Sentry.Handlers.requestHandler());


app.use(bodyParser.json({ limit: '5mb' }));


// pre exec middleware
let COUNTER = 0
app.use(async (req, res, next) => {
  console.log('FAKE ROUTER MIDDLEWARE')

  COUNTER++
  if (COUNTER % 2 === 0) {
    const users = await queries.getUser(1)
    console.log(users)
    next(new Error('DUMMY ERR'))
  }

  next()
})


// routes
app.get('/user', async (req, res) => {
  console.log('GET USER')

  const user = await queries.getUser(1)
  console.log(user)

  res.status(200).json({ 'status': user })
})


// handling nonexistent routes
app.use(function (req, res) {
  console.log('BAD ROUTE')
  res.set('Connection', 'close');
  res.status(400).send();
});


// error handling
app.use(function (err, req, res, next) {
  console.log('CUSTOM HANDLER', err)

  if (! res.headersSent) {
    res.status(500).send('SYSTEM ERROR')
  }
});


// Start the server
app.listen(9000, () => {
  console.log('APP STARTED');
});
