import express from "express";
import cors from "cors";
import db from "../app-data-source";
import { Product } from "./product/entity/product.entity";
import * as amqp from "amqplib";

// establish database connection
db
	.initialize()
	.then(() => {
		// connect to message queue
		amqp.connect("amqps://aaedhswt:w-WQ7z04hr0Ondj_aGIGjNoR499YtUGT@rattlesnake.rmq.cloudamqp.com/aaedhswt").then(async (connection) => {
			const channel = await connection.createChannel()
			// initialize express server
			const app = express();
			const port = process.env.PORT! || 8000;
			const productRepository = db.getRepository(Product)


			app.use(cors({
				origin: ['http://localhost:3000']
			}))

			app.use(express.json());

			app.get("/api/products", async (_req, _res) => {
				const products = await productRepository.find();
				return _res.json(products)
			})

			app.post("/api/products", async (_req, _res) => {
				const product = await productRepository.create(_req.body);
				const result = await productRepository.save(product)
				channel.sendToQueue("product_created", Buffer.from(JSON.stringify(result)))
				return _res.send(result)
			})

			app.get("/api/products/:id", async (_req, _res) => {
				const product = await productRepository.findOne({
					where: {
						id: Number(_req.params.id)
					}
				});
				return _res.send(product)
			})

			app.put("/api/products/:id", async (_req, _res) => {
				const product = await productRepository.findOne({
					where: {
						id: Number(_req.params.id)
					}
				})
				productRepository.merge(product!, _req.body);
				const result = await productRepository.save(product!);
				channel.sendToQueue("product_updated", Buffer.from(JSON.stringify(result)))
				return _res.send(result);
			})

			app.delete("/api/products/:id", async (_req, _res) => {
				const result = await productRepository.delete(_req.params.id)
				channel.sendToQueue("product_deleted", Buffer.from(JSON.stringify(_req.params.id)))
				return _res.send(result);
			})

			app.post("/api/products/:id/like", async (_req, _res) => {
				const product = await productRepository.findOne({
					where: {
						id: Number(_req.params.id)
					}
				})
				product!.likes++;
				const result = await productRepository.save(product!);
				return _res.send(result);
			})


			app.listen(port, () => {
				console.log("Connected to message queue successfully")
				console.log("Data Source has been initialized!")
				console.log(`admin running successfully on port ${port}`)
			})

			process.on("beforeExit", () => {
				console.log("closing");
				connection.close()
			})
		}).catch(error => console.log(error))

	})
	.catch((err) => {
		console.error("Error during Data Source initialization:", err)
	})
