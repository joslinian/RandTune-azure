"use strict";
exports.__esModule = true;
var App_1 = require("./App");
//let port: number = 8080;
var server = new App_1.App().expressApp;
//server.listen(port, () => console.log("server listening on port: " + port));
console.log("before listening on port 80");
server.listen(process.env.PORT || 8080);
