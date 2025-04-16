const express = require("express");
const proxy = require("express-http-proxy");
const cors = require("cors");

const app = express();

const corsOption = {
    origin: ["http://a70714adea18c40339e551c24252cf47-34542496.ap-southeast-1.elb.amazonaws.com:3000"],
    methods: "GET, HEAD, PUT, PATCH, POST, DELETE",
    credentials: true,
};

app.use(cors(corsOption));
app.use(express.json());

// Set up CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://a70714adea18c40339e551c24252cf47-34542496.ap-southeast-1.elb.amazonaws.com:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// Proxy services with Kubernetes DNS names
app.use("/UserManagementService", proxy("http://user-management-service.default.svc.cluster.local:3001", {
    proxyReqPathResolver: req => req.url
}));
app.use("/CourseManagementService", proxy("http://course-management-service.default.svc.cluster.local:3002", {
    proxyReqPathResolver: req => req.url
}));
app.use("/PaymentManagementService", proxy("http://payment-management-service.default.svc.cluster.local:3003", {
    proxyReqPathResolver: req => req.url
}));
app.use("/EnrollmentManagementService", proxy("http://enrollment-management-service.default.svc.cluster.local:3004", {
    proxyReqPathResolver: req => req.url
}));

// Start the API Gateway
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Gateway is Listening on Port ${PORT}`);
});
