const { Router } = require("express");

const usersController = require("../controllers/usersController");

const usersRouter = Router();

usersRouter.get("/", usersController.serveHomepage);

usersRouter.get("/genres", usersController.serveGenres);
usersRouter.get("/:id/genre", usersController.serveGenre);
usersRouter.get("/:id/updategenre", usersController.updateGenreGet);
usersRouter.post("/:id/updategenre", usersController.updateGenrePost);

usersRouter.get("/creategenre", usersController.newGenreGet);
usersRouter.post("/creategenre", usersController.newGenrePost);

usersRouter.get("/:id/updatecard", usersController.updateCardGet);
usersRouter.post("/:id/updatecard", usersController.updateCardPost);

usersRouter.get("/editions", usersController.serveEditions);
usersRouter.get("/:id/edition", usersController.serveEdition);
usersRouter.get("/:id/updateedition", usersController.updateEditionGet);
usersRouter.post("/:id/updateedition", usersController.updateEditionPost);

usersRouter.get("/createedition", usersController.newEditionGet);
usersRouter.post("/createedition", usersController.newEditionPost);

usersRouter.post("/:id/deletecard", usersController.deleteCardPost);
usersRouter.post("/:id/deletegenre", usersController.deleteGenrePost);
usersRouter.post("/:id/deleteedition", usersController.deleteEditionPost);

usersRouter.get("/createcard", usersController.newCardGet);
usersRouter.post("/createcard", usersController.newCardPost);

module.exports = usersRouter;
