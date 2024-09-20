const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/v1/users');
const app = express();
const PORT = 5500;

const corsOptions = {
  origin: 'http://greenmats.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
} // You must always implement CORS on your server when you're working with a server that's going to be working with a front-end
app.use(cors(corsOptions));
app.use(express.json());
app.use('/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
})
