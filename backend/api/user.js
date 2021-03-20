module.exports = (app) => {
  const { existsOrError, notExistsOrError } = app.api.validation;

  // Function PUT and POST
  const save = async (req, res) => {
    const user = { ...req.body };

    if (req.params.id) {
      user.id = req.params.id;
    }

    try {
      existsOrError(user.name, "User was not informed");
      existsOrError(user.email, "Email was not informed");
      existsOrError(user.password, "Password was not informed");

      const userFromDB = await app
        .db("users")
        .where({ email: user.email })
        .first();

      if (!user.id) {
        notExistsOrError(userFromDB, "User has already been registered");
      }
    } catch (msg) {
      return res.status(400).send(msg);
    }

    if (user.id) {
      app
        .db("users")
        .update(user)
        .where({ id: user.id })
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    } else {
      app
        .db("users")
        .insert(user)
        .then((_) => res.status(204).send())
        .catch((err) => res.status(500).send(err));
    }
  };

  const get = (req, res) => {
    app
      .db("users")
      .select("id", "name", "email", "admin")
      .then((users) => res.json(users))
      .catch((err) => res.status(500).send(err));
  };

  return {
    save,
    get,
  };
};
