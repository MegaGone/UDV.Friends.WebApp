/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/config/index.ts":
/*!*****************************!*\
  !*** ./src/config/index.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./postgres.configuration */ "./src/config/postgres.configuration.ts"), exports);


/***/ }),

/***/ "./src/config/postgres.configuration.ts":
/*!**********************************************!*\
  !*** ./src/config/postgres.configuration.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DB_DATABASE = exports.DB_PASSWORD = exports.DB_HOST = exports.DB_PORT = exports.DB_USER = exports.PORT = void 0;
__webpack_require__(/*! dotenv/config */ "dotenv/config");
const PORT = process.env.PORT || "3000";
exports.PORT = PORT;
const DB_USER = process.env.DB_USER || "";
exports.DB_USER = DB_USER;
const DB_PORT = process.env.DB_PORT || 5432;
exports.DB_PORT = DB_PORT;
const DB_PASSWORD = process.env.DB_PASSWORD || "";
exports.DB_PASSWORD = DB_PASSWORD;
const DB_DATABASE = process.env.DB_DATABASE || "";
exports.DB_DATABASE = DB_DATABASE;
const DB_HOST = process.env.DB_HOST || "localhost";
exports.DB_HOST = DB_HOST;


/***/ }),

/***/ "./src/database/index.ts":
/*!*******************************!*\
  !*** ./src/database/index.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__exportStar(__webpack_require__(/*! ./postgres.listener */ "./src/database/postgres.listener.ts"), exports);


/***/ }),

/***/ "./src/database/postgres.listener.ts":
/*!*******************************************!*\
  !*** ./src/database/postgres.listener.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PostgresListener = void 0;
const pg_1 = __webpack_require__(/*! pg */ "pg");
const config_1 = __webpack_require__(/*! src/config */ "./src/config/index.ts");
class PostgresListener {
    _client;
    constructor() {
        this._client = new pg_1.Client({
            host: config_1.DB_HOST,
            user: config_1.DB_USER,
            port: +config_1.DB_PORT,
            database: config_1.DB_DATABASE,
            password: config_1.DB_PASSWORD,
        });
    }
    async listen(channel, callback) {
        await this._client.connect();
        await this._client.query(`LISTEN ${channel}`);
        this._client.on("notification", (msg) => {
            if (!msg || !msg?.payload || msg?.channel !== channel)
                return;
            const payload = JSON.parse(msg.payload);
            callback(payload);
        });
        console.log(`[INFO][PG-LISTENER] Listening on channel "${channel}"`);
    }
}
exports.PostgresListener = PostgresListener;


/***/ }),

/***/ "./src/server.ts":
/*!***********************!*\
  !*** ./src/server.ts ***!
  \***********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Server = void 0;
const config_1 = __webpack_require__(/*! ./config */ "./src/config/index.ts");
const database_1 = __webpack_require__(/*! ./database */ "./src/database/index.ts");
const express_1 = __importDefault(__webpack_require__(/*! express */ "express"));
const socket_io_1 = __webpack_require__(/*! socket.io */ "socket.io");
const http_1 = __webpack_require__(/*! http */ "http");
class Server {
    _port;
    _channel;
    _app;
    _listener;
    _server;
    _io;
    constructor() {
        this._port = +config_1.PORT;
        this._app = (0, express_1.default)();
        this._channel = "friend_update";
        this._server = (0, http_1.createServer)(this._app);
        this._listener = new database_1.PostgresListener();
        this._io = new socket_io_1.Server(this._server, {
            cors: {
                origin: "*",
            },
        });
    }
    onListen() {
        this._listener.listen(this._channel, (payload) => {
            console.log("[INFO][LISTENER][CHANGE]:", payload);
            this._io.emit(this._channel, payload);
        });
    }
    start() {
        this._server.listen(this._port, () => {
            console.log(`[INFO][SERVER][RUNNING] http://localhost:${this._port}`);
        });
    }
}
exports.Server = Server;


/***/ }),

/***/ "dotenv/config":
/*!********************************!*\
  !*** external "dotenv/config" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("dotenv/config");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "pg":
/*!*********************!*\
  !*** external "pg" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("pg");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
const server_1 = __webpack_require__(/*! src/server */ "./src/server.ts");
(() => {
    bootstrap();
})();
async function bootstrap() {
    const server = new server_1.Server();
    server.onListen();
    server.start();
}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsb0NBQW9DO0FBQ25EO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLHdFQUEwQjs7Ozs7Ozs7Ozs7QUNoQmxDO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELG1CQUFtQixHQUFHLG1CQUFtQixHQUFHLGVBQWUsR0FBRyxlQUFlLEdBQUcsZUFBZSxHQUFHLFlBQVk7QUFDOUcsbUJBQU8sQ0FBQyxvQ0FBZTtBQUN2QjtBQUNBLFlBQVk7QUFDWjtBQUNBLGVBQWU7QUFDZjtBQUNBLGVBQWU7QUFDZjtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLGVBQWU7Ozs7Ozs7Ozs7O0FDZkY7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsb0NBQW9DO0FBQ25EO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsYUFBYSxtQkFBTyxDQUFDLGdFQUFxQjs7Ozs7Ozs7Ozs7QUNoQjdCO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELHdCQUF3QjtBQUN4QixhQUFhLG1CQUFPLENBQUMsY0FBSTtBQUN6QixpQkFBaUIsbUJBQU8sQ0FBQyx5Q0FBWTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLFFBQVE7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxpRUFBaUUsUUFBUTtBQUN6RTtBQUNBO0FBQ0Esd0JBQXdCOzs7Ozs7Ozs7OztBQzVCWDtBQUNiO0FBQ0EsNkNBQTZDO0FBQzdDO0FBQ0EsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGNBQWM7QUFDZCxpQkFBaUIsbUJBQU8sQ0FBQyx1Q0FBVTtBQUNuQyxtQkFBbUIsbUJBQU8sQ0FBQywyQ0FBWTtBQUN2QyxrQ0FBa0MsbUJBQU8sQ0FBQyx3QkFBUztBQUNuRCxvQkFBb0IsbUJBQU8sQ0FBQyw0QkFBVztBQUN2QyxlQUFlLG1CQUFPLENBQUMsa0JBQU07QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0Esb0VBQW9FLFdBQVc7QUFDL0UsU0FBUztBQUNUO0FBQ0E7QUFDQSxjQUFjOzs7Ozs7Ozs7OztBQzFDZDs7Ozs7Ozs7OztBQ0FBOzs7Ozs7Ozs7O0FDQUE7Ozs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7OztBQ0FBOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7Ozs7Ozs7O0FDdEJhO0FBQ2IsOENBQTZDLEVBQUUsYUFBYSxFQUFDO0FBQzdELGlCQUFpQixtQkFBTyxDQUFDLG1DQUFZO0FBQ3JDO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Vkdi5mcmllbmRzLmJhY2tlbmQvLi9zcmMvY29uZmlnL2luZGV4LnRzIiwid2VicGFjazovL3Vkdi5mcmllbmRzLmJhY2tlbmQvLi9zcmMvY29uZmlnL3Bvc3RncmVzLmNvbmZpZ3VyYXRpb24udHMiLCJ3ZWJwYWNrOi8vdWR2LmZyaWVuZHMuYmFja2VuZC8uL3NyYy9kYXRhYmFzZS9pbmRleC50cyIsIndlYnBhY2s6Ly91ZHYuZnJpZW5kcy5iYWNrZW5kLy4vc3JjL2RhdGFiYXNlL3Bvc3RncmVzLmxpc3RlbmVyLnRzIiwid2VicGFjazovL3Vkdi5mcmllbmRzLmJhY2tlbmQvLi9zcmMvc2VydmVyLnRzIiwid2VicGFjazovL3Vkdi5mcmllbmRzLmJhY2tlbmQvZXh0ZXJuYWwgY29tbW9uanMgXCJkb3RlbnYvY29uZmlnXCIiLCJ3ZWJwYWNrOi8vdWR2LmZyaWVuZHMuYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcImV4cHJlc3NcIiIsIndlYnBhY2s6Ly91ZHYuZnJpZW5kcy5iYWNrZW5kL2V4dGVybmFsIG5vZGUtY29tbW9uanMgXCJodHRwXCIiLCJ3ZWJwYWNrOi8vdWR2LmZyaWVuZHMuYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcInBnXCIiLCJ3ZWJwYWNrOi8vdWR2LmZyaWVuZHMuYmFja2VuZC9leHRlcm5hbCBjb21tb25qcyBcInNvY2tldC5pb1wiIiwid2VicGFjazovL3Vkdi5mcmllbmRzLmJhY2tlbmQvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdWR2LmZyaWVuZHMuYmFja2VuZC8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2NyZWF0ZUJpbmRpbmcgPSAodGhpcyAmJiB0aGlzLl9fY3JlYXRlQmluZGluZykgfHwgKE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xuICAgIHZhciBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihtLCBrKTtcbiAgICBpZiAoIWRlc2MgfHwgKFwiZ2V0XCIgaW4gZGVzYyA/ICFtLl9fZXNNb2R1bGUgOiBkZXNjLndyaXRhYmxlIHx8IGRlc2MuY29uZmlndXJhYmxlKSkge1xuICAgICAgZGVzYyA9IHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCBkZXNjKTtcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICBvW2syXSA9IG1ba107XG59KSk7XG52YXIgX19leHBvcnRTdGFyID0gKHRoaXMgJiYgdGhpcy5fX2V4cG9ydFN0YXIpIHx8IGZ1bmN0aW9uKG0sIGV4cG9ydHMpIHtcbiAgICBmb3IgKHZhciBwIGluIG0pIGlmIChwICE9PSBcImRlZmF1bHRcIiAmJiAhT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGV4cG9ydHMsIHApKSBfX2NyZWF0ZUJpbmRpbmcoZXhwb3J0cywgbSwgcCk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuX19leHBvcnRTdGFyKHJlcXVpcmUoXCIuL3Bvc3RncmVzLmNvbmZpZ3VyYXRpb25cIiksIGV4cG9ydHMpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkRCX0RBVEFCQVNFID0gZXhwb3J0cy5EQl9QQVNTV09SRCA9IGV4cG9ydHMuREJfSE9TVCA9IGV4cG9ydHMuREJfUE9SVCA9IGV4cG9ydHMuREJfVVNFUiA9IGV4cG9ydHMuUE9SVCA9IHZvaWQgMDtcbnJlcXVpcmUoXCJkb3RlbnYvY29uZmlnXCIpO1xuY29uc3QgUE9SVCA9IHByb2Nlc3MuZW52LlBPUlQgfHwgXCIzMDAwXCI7XG5leHBvcnRzLlBPUlQgPSBQT1JUO1xuY29uc3QgREJfVVNFUiA9IHByb2Nlc3MuZW52LkRCX1VTRVIgfHwgXCJcIjtcbmV4cG9ydHMuREJfVVNFUiA9IERCX1VTRVI7XG5jb25zdCBEQl9QT1JUID0gcHJvY2Vzcy5lbnYuREJfUE9SVCB8fCA1NDMyO1xuZXhwb3J0cy5EQl9QT1JUID0gREJfUE9SVDtcbmNvbnN0IERCX1BBU1NXT1JEID0gcHJvY2Vzcy5lbnYuREJfUEFTU1dPUkQgfHwgXCJcIjtcbmV4cG9ydHMuREJfUEFTU1dPUkQgPSBEQl9QQVNTV09SRDtcbmNvbnN0IERCX0RBVEFCQVNFID0gcHJvY2Vzcy5lbnYuREJfREFUQUJBU0UgfHwgXCJcIjtcbmV4cG9ydHMuREJfREFUQUJBU0UgPSBEQl9EQVRBQkFTRTtcbmNvbnN0IERCX0hPU1QgPSBwcm9jZXNzLmVudi5EQl9IT1NUIHx8IFwibG9jYWxob3N0XCI7XG5leHBvcnRzLkRCX0hPU1QgPSBEQl9IT1NUO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19jcmVhdGVCaW5kaW5nID0gKHRoaXMgJiYgdGhpcy5fX2NyZWF0ZUJpbmRpbmcpIHx8IChPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcbiAgICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IobSwgayk7XG4gICAgaWYgKCFkZXNjIHx8IChcImdldFwiIGluIGRlc2MgPyAhbS5fX2VzTW9kdWxlIDogZGVzYy53cml0YWJsZSB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIGRlc2MgPSB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH07XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvLCBrMiwgZGVzYyk7XG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XG4gICAgb1trMl0gPSBtW2tdO1xufSkpO1xudmFyIF9fZXhwb3J0U3RhciA9ICh0aGlzICYmIHRoaXMuX19leHBvcnRTdGFyKSB8fCBmdW5jdGlvbihtLCBleHBvcnRzKSB7XG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChleHBvcnRzLCBwKSkgX19jcmVhdGVCaW5kaW5nKGV4cG9ydHMsIG0sIHApO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbl9fZXhwb3J0U3RhcihyZXF1aXJlKFwiLi9wb3N0Z3Jlcy5saXN0ZW5lclwiKSwgZXhwb3J0cyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUG9zdGdyZXNMaXN0ZW5lciA9IHZvaWQgMDtcbmNvbnN0IHBnXzEgPSByZXF1aXJlKFwicGdcIik7XG5jb25zdCBjb25maWdfMSA9IHJlcXVpcmUoXCJzcmMvY29uZmlnXCIpO1xuY2xhc3MgUG9zdGdyZXNMaXN0ZW5lciB7XG4gICAgX2NsaWVudDtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fY2xpZW50ID0gbmV3IHBnXzEuQ2xpZW50KHtcbiAgICAgICAgICAgIGhvc3Q6IGNvbmZpZ18xLkRCX0hPU1QsXG4gICAgICAgICAgICB1c2VyOiBjb25maWdfMS5EQl9VU0VSLFxuICAgICAgICAgICAgcG9ydDogK2NvbmZpZ18xLkRCX1BPUlQsXG4gICAgICAgICAgICBkYXRhYmFzZTogY29uZmlnXzEuREJfREFUQUJBU0UsXG4gICAgICAgICAgICBwYXNzd29yZDogY29uZmlnXzEuREJfUEFTU1dPUkQsXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhc3luYyBsaXN0ZW4oY2hhbm5lbCwgY2FsbGJhY2spIHtcbiAgICAgICAgYXdhaXQgdGhpcy5fY2xpZW50LmNvbm5lY3QoKTtcbiAgICAgICAgYXdhaXQgdGhpcy5fY2xpZW50LnF1ZXJ5KGBMSVNURU4gJHtjaGFubmVsfWApO1xuICAgICAgICB0aGlzLl9jbGllbnQub24oXCJub3RpZmljYXRpb25cIiwgKG1zZykgPT4ge1xuICAgICAgICAgICAgaWYgKCFtc2cgfHwgIW1zZz8ucGF5bG9hZCB8fCBtc2c/LmNoYW5uZWwgIT09IGNoYW5uZWwpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgcGF5bG9hZCA9IEpTT04ucGFyc2UobXNnLnBheWxvYWQpO1xuICAgICAgICAgICAgY2FsbGJhY2socGF5bG9hZCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmxvZyhgW0lORk9dW1BHLUxJU1RFTkVSXSBMaXN0ZW5pbmcgb24gY2hhbm5lbCBcIiR7Y2hhbm5lbH1cImApO1xuICAgIH1cbn1cbmV4cG9ydHMuUG9zdGdyZXNMaXN0ZW5lciA9IFBvc3RncmVzTGlzdGVuZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2ltcG9ydERlZmF1bHQgPSAodGhpcyAmJiB0aGlzLl9faW1wb3J0RGVmYXVsdCkgfHwgZnVuY3Rpb24gKG1vZCkge1xuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgXCJkZWZhdWx0XCI6IG1vZCB9O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2VydmVyID0gdm9pZCAwO1xuY29uc3QgY29uZmlnXzEgPSByZXF1aXJlKFwiLi9jb25maWdcIik7XG5jb25zdCBkYXRhYmFzZV8xID0gcmVxdWlyZShcIi4vZGF0YWJhc2VcIik7XG5jb25zdCBleHByZXNzXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcImV4cHJlc3NcIikpO1xuY29uc3Qgc29ja2V0X2lvXzEgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpO1xuY29uc3QgaHR0cF8xID0gcmVxdWlyZShcImh0dHBcIik7XG5jbGFzcyBTZXJ2ZXIge1xuICAgIF9wb3J0O1xuICAgIF9jaGFubmVsO1xuICAgIF9hcHA7XG4gICAgX2xpc3RlbmVyO1xuICAgIF9zZXJ2ZXI7XG4gICAgX2lvO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLl9wb3J0ID0gK2NvbmZpZ18xLlBPUlQ7XG4gICAgICAgIHRoaXMuX2FwcCA9ICgwLCBleHByZXNzXzEuZGVmYXVsdCkoKTtcbiAgICAgICAgdGhpcy5fY2hhbm5lbCA9IFwiZnJpZW5kX3VwZGF0ZVwiO1xuICAgICAgICB0aGlzLl9zZXJ2ZXIgPSAoMCwgaHR0cF8xLmNyZWF0ZVNlcnZlcikodGhpcy5fYXBwKTtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSBuZXcgZGF0YWJhc2VfMS5Qb3N0Z3Jlc0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuX2lvID0gbmV3IHNvY2tldF9pb18xLlNlcnZlcih0aGlzLl9zZXJ2ZXIsIHtcbiAgICAgICAgICAgIGNvcnM6IHtcbiAgICAgICAgICAgICAgICBvcmlnaW46IFwiKlwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uTGlzdGVuKCkge1xuICAgICAgICB0aGlzLl9saXN0ZW5lci5saXN0ZW4odGhpcy5fY2hhbm5lbCwgKHBheWxvYWQpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiW0lORk9dW0xJU1RFTkVSXVtDSEFOR0VdOlwiLCBwYXlsb2FkKTtcbiAgICAgICAgICAgIHRoaXMuX2lvLmVtaXQodGhpcy5fY2hhbm5lbCwgcGF5bG9hZCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzdGFydCgpIHtcbiAgICAgICAgdGhpcy5fc2VydmVyLmxpc3Rlbih0aGlzLl9wb3J0LCAoKSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgW0lORk9dW1NFUlZFUl1bUlVOTklOR10gaHR0cDovL2xvY2FsaG9zdDoke3RoaXMuX3BvcnR9YCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuU2VydmVyID0gU2VydmVyO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZG90ZW52L2NvbmZpZ1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJleHByZXNzXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImh0dHBcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGdcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwic29ja2V0LmlvXCIpOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IHNlcnZlcl8xID0gcmVxdWlyZShcInNyYy9zZXJ2ZXJcIik7XG4oKCkgPT4ge1xuICAgIGJvb3RzdHJhcCgpO1xufSkoKTtcbmFzeW5jIGZ1bmN0aW9uIGJvb3RzdHJhcCgpIHtcbiAgICBjb25zdCBzZXJ2ZXIgPSBuZXcgc2VydmVyXzEuU2VydmVyKCk7XG4gICAgc2VydmVyLm9uTGlzdGVuKCk7XG4gICAgc2VydmVyLnN0YXJ0KCk7XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=