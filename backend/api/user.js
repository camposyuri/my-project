const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const { existsOrError, notExistsOrError, equalOrError } = app.api.validation;

  // Function encryptPassword
  const encryptPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

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
      equalOrError(
        user.password,
        user.confirmPassword,
        "Passwords don't match"
      );

      // Catch e-mail been registered
      const userFromDB = await app
        .db("users")
        .where({ email: user.email })
        .first();

      if (!user.id) {
        notExistsOrError(userFromDB, "User has already been registered");
      }
    } catch (msg) {
      console.log(`Error: [api][user][save] >> error insert/put user]: ${msg}`);
      return res.status(400).send(msg);
    }

    user.password = encryptPassword(user.password);
    delete user.confirmPassword;

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
    try {
      app
        .db("users")
        .select("id", "name", "email", "admin")
        .whereNull("deletedAt")
        .orderBy("id")
        .then((users) => res.json(users));
    } catch (error) {
      console.log(`[api][user][get] >> error get user]: ${error}`);
      return res.status(500).send(error);
    }
  };

  const getById = (req, res) => {
    try {
      app
        .db("users")
        .select("id", "name", "email", "admin")
        .where({ id: req.params.id })
        .whereNull("deletedAt")
        .first()
        .then((user) => res.json(user));
    } catch (error) {
      console.log(
        `Error: [api][user][getById] >> error getById user]: ${error}`
      );
      return res.status(500).send(error);
    }
  };

  const remove = async (req, res) => {
    try {
      const rowUpdated = await app
        .db("users")
        .update({ deletedAt: new Date() })
        .where({ id: req.params.id });

      existsOrError(rowUpdated, "User not found");

      return res.status(204).send();
    } catch (msg) {
      console.log(`Error: [api][user][remove] >> error remove user]: ${msg}`);
      return res.status(500).send(msg);
    }
  };

  return {
    save,
    get,
    getById,
    remove,
  };
};
