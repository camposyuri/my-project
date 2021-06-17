const { authSecret } = require("./../.env");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("jwt-simple");

module.exports = (app) => {
  const signin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(400).send("Enter user and password");
    }

    const user = await app.db("users").where({ email: req.body.email }).first();

    if (!user) {
      return res.status(400).send("User not found");
    }

    const isMath = bcrypt.compareSync(req.body.password, user.password);
    if (!isMath) {
      return res.status(400).send("Incorrect username or password");
    }

    const now = Math.floor(Date.now() / 1000);

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      admin: user.admin,
      iat: now,
      exp: now + 60 * 60 * 24 * 3,
    };

    return res.json({
      ...payload,
      token: jwt.encode(payload, authSecret),
    });
  };

  const validateToken = async (req, res) => {
    const userData = req.body || null;

    try {
      if (userData) {
        const token = await jwt.decode(userData.token, authSecret);
        if (new Date(token.exp * 1000) > new Date()) {
          return res.status(200).send("Token is valid");
        }
      }
    } catch (error) {
      console.log(
        `Error: [api][auth][validateToken] >> error with token validate]: ${error}`
      );
      return res.status(500).send("Token is not valid");
    }
    return res.status(500).send(false);
  };

  return {
    signin,
    validateToken,
  };
};
