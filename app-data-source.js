"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var product_entity_1 = require("./src/product/entity/product.entity");
var myDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "node-micro-admin-user",
    password: "node-micro-admin-user",
    database: "node-micro-admin",
    entities: [product_entity_1.Product],
    // logging: true,
    synchronize: true,
});
exports.default = myDataSource;
