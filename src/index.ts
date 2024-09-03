import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/router';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
