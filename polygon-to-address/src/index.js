import express from "express";
import cookieParser from "cookie-parser";
import addressRouter from "./routes/address.route.js";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";
import "reflect-metadata";
import { AppDataSource } from "./database.typeorm.config.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Address MapBox Express API with Swagger",
      version: "0.1.0",
      description:
        "Latitude and Longitude to Address by MapBox API with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Luca Imbalzano",
        url: "https://loudsrl.com",
        email: "luca.imbalzano@loudsrl.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/doc",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    customCssUrl:
      "https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css",
  })
);
console.log(
  "[SwaggerUi] swagger documentation available at http://localhost:3000/doc/"
);

app.use("/api/get-addresses", addressRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

AppDataSource.initialize()
  .then(() => {
    app.listen(3000, () => {
      console.log("[connection] server listen on 3K");
    });
  })
  .catch((error) =>
    console.log("Error during Data Source initialization:", error)
  );

export default app;
