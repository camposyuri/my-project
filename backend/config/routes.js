module.exports = (app) => {
  app.post("/signin", app.api.auth.signin);
  app.route("/users").get(app.api.user.get).post(app.api.user.save);
  app
    .route("/users/:id")
    .get(app.api.user.getById)
    .put(app.api.user.save)
    .delete(app.api.user.remove);
};
