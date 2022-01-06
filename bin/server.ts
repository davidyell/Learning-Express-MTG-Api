import http from 'http';
import app from '../src/app';

const port = 3000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
