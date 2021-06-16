const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("Enter user and password");
    }

    const user = await app.db("users").where({ email: req.body.email }).first();
    console.log(user);

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMath = bcrypt.compareSync(req.body.password, user.password);
    if (!isMath) {
      return res.status(400).send("Incorrect username or password");
    }

    return res.send("Tudo ok!");
  };

  return {
    signin,
  };
};
