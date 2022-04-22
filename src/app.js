"use strict";
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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var app_data_source_1 = __importDefault(require("../app-data-source"));
var product_entity_1 = require("./product/entity/product.entity");
var amqp = __importStar(require("amqplib"));
// establish database connection
app_data_source_1.default
    .initialize()
    .then(function () {
    // connect to message queue
    amqp.connect("amqps://aaedhswt:w-WQ7z04hr0Ondj_aGIGjNoR499YtUGT@rattlesnake.rmq.cloudamqp.com/aaedhswt").then(function (connection) { return __awaiter(void 0, void 0, void 0, function () {
        var channel, app, port, productRepository;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connection.createChannel()
                    // initialize express server
                ];
                case 1:
                    channel = _a.sent();
                    app = (0, express_1.default)();
                    port = process.env.PORT || 8000;
                    productRepository = app_data_source_1.default.getRepository(product_entity_1.Product);
                    app.use((0, cors_1.default)({
                        origin: ['http://localhost:3000']
                    }));
                    app.use(express_1.default.json());
                    app.get("/api/products", function (_req, _res) { return __awaiter(void 0, void 0, void 0, function () {
                        var products;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, productRepository.find()];
                                case 1:
                                    products = _a.sent();
                                    return [2 /*return*/, _res.json(products)];
                            }
                        });
                    }); });
                    app.post("/api/products", function (_req, _res) { return __awaiter(void 0, void 0, void 0, function () {
                        var product, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, productRepository.create(_req.body)];
                                case 1:
                                    product = _a.sent();
                                    return [4 /*yield*/, productRepository.save(product)];
                                case 2:
                                    result = _a.sent();
                                    channel.sendToQueue("product_created", Buffer.from(JSON.stringify(result)));
                                    return [2 /*return*/, _res.send(result)];
                            }
                        });
                    }); });
                    app.get("/api/products/:id", function (_req, _res) { return __awaiter(void 0, void 0, void 0, function () {
                        var product;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, productRepository.findOne({
                                        where: {
                                            id: Number(_req.params.id)
                                        }
                                    })];
                                case 1:
                                    product = _a.sent();
                                    return [2 /*return*/, _res.send(product)];
                            }
                        });
                    }); });
                    app.put("/api/products/:id", function (_req, _res) { return __awaiter(void 0, void 0, void 0, function () {
                        var product, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, productRepository.findOne({
                                        where: {
                                            id: Number(_req.params.id)
                                        }
                                    })];
                                case 1:
                                    product = _a.sent();
                                    productRepository.merge(product, _req.body);
                                    return [4 /*yield*/, productRepository.save(product)];
                                case 2:
                                    result = _a.sent();
                                    return [2 /*return*/, _res.send(result)];
                            }
                        });
                    }); });
                    app.delete("/api/products/:id", function (_req, _res) { return __awaiter(void 0, void 0, void 0, function () {
                        var result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, productRepository.delete(_req.params.id)];
                                case 1:
                                    result = _a.sent();
                                    return [2 /*return*/, _res.send(result)];
                            }
                        });
                    }); });
                    app.post("/api/products/:id/like", function (_req, _res) { return __awaiter(void 0, void 0, void 0, function () {
                        var product, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, productRepository.findOne({
                                        where: {
                                            id: Number(_req.params.id)
                                        }
                                    })];
                                case 1:
                                    product = _a.sent();
                                    product.likes++;
                                    return [4 /*yield*/, productRepository.save(product)];
                                case 2:
                                    result = _a.sent();
                                    return [2 /*return*/, _res.send(result)];
                            }
                        });
                    }); });
                    app.listen(port, function () {
                        console.log("Connected to message queue successfully");
                        console.log("Data Source has been initialized!");
                        console.log("admin running successfully on port ".concat(port));
                    });
                    process.on("beforeExit", function () {
                        console.log("closing");
                        connection.close();
                    });
                    return [2 /*return*/];
            }
        });
    }); }).catch(function (error) { return console.log(error); });
})
    .catch(function (err) {
    console.error("Error during Data Source initialization:", err);
});
