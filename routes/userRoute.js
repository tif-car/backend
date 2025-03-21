import userController from "../controllers/userController.js";

const routes = {
    "/api/getUserRole": userController.getUserRole,
};

export default routes;
