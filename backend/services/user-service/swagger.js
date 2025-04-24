const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "User Service API",
            version: "1.0.0",
            description: "API per la gestione utenti"
        },
        servers: [{ url: "https://localhost:3000" }] // Modifica con la porta di user-service
    },
    apis: ["./routes/authRoutes.js"] // Percorso ai file delle API
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
