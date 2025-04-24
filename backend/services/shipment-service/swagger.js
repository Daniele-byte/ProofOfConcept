const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Shipment Service API",
            version: "1.0.0",
            description: "API per la gestione spedizioni"
        },
        servers: [{ url: "https://localhost:3004" }] 
    },
    apis: ["./routes/shipmentRoutes.js"] 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
