import { DataSource } from "typeorm"
import { Product } from "./src/product/entity/product.entity"

const myDataSource = new DataSource({
	type: "postgres",
	host: "localhost",
	port: 5432,
	username: "node-micro-admin-user",
	password: "node-micro-admin-user",
	database: "node-micro-admin",
	entities: [Product],
	// logging: true,
	synchronize: true,
})

export default myDataSource;