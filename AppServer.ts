import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as mongodb from 'mongodb';
import * as url from 'url';
import * as bodyParser from 'body-parser';
import {App} from './App';

//let port: number = 8080;

let server: any = new App().expressApp;
//server.listen(port, () => console.log("server listening on port: " + port));
console.log("before listening on port 80")
server.listen(process.env.PORT || 8080);