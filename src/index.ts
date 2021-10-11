import app from './App';
require('dotenv').config();
const PORT = process.env.PORT || 4000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error starting server: ${err}`);
    process.abort();
  }
  console.log(`Hi! Listening to port ${PORT} `);
  return;
});
