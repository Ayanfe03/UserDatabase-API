const express = require('express');
const userRouter = require('./routes/v1/users');
const app = express();
const PORT = 5500;

app.use(express.json());
app.use('/v1/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
})
