import express, { Application } from 'express';
import callComment from './comment.ctrl';

const app: Application = express();
const port = 3000;

//TODO http://localhost:3000/ <----

app.get('/', callComment);

app.listen(port, () => console.log('Ready'));

