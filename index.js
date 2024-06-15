const express = require("express");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const axios = require("axios");
const qs = require("querystring");
const crypto = require("crypto");
const mongoose = require("mongoose");
const User = require("./model/users");
const urlRouter = require("./routers/url");
const bodyParser = require("body-parser");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const DB_URL = process.env.DATABASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SECRECT = process.env.SECRECT;
const REDIRECT_URI = "http://localhost:8000/auth/callback";

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(
  session({
    secret: SECRECT,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: DB_URL }),
  })
);
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Generate code verifier and challenge
function generateCodeVerifier() {
  return crypto
    .randomBytes(32)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function generateCodeChallenge(codeVerifier) {
  return crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

app.get("/auth", (req, res) => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  req.session.codeVerifier = codeVerifier;

  const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&response_type=code&scope=identify email guilds&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    console.error("No code returned from Discord");
    res.status(400).send("No code returned from Discord");
    return;
  }

  const codeVerifier = req.session.codeVerifier;

  if (!codeVerifier) {
    console.error("No code verifier found in session");
    res.status(400).send("No code verifier found in session");
    return;
  }

  try {
    const tokenResponse = await axios.post(
      "https://discord.com/api/oauth2/token",
      qs.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        code_verifier: codeVerifier,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (tokenResponse.status !== 200) {
      console.error(
        "Error getting token:",
        tokenResponse.status,
        tokenResponse.statusText
      );
      res.status(500).send("Error getting token");
      return;
    }

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (userResponse.status !== 200) {
      console.error(
        "Error getting user info:",
        userResponse.status,
        userResponse.statusText
      );
      res.status(500).send("Error getting user info");
      return;
    }

    const { id, username, discriminator } = userResponse.data;

    let user = await User.findOne({ discordId: id });

    if (!user) {
      user = new User({
        discordId: id,
        username,
        discriminator,
      });

      await user.save();
    }

    req.session.user = user;

    return res.render("success"); // Redirect to main page after successful authentication
  } catch (error) {
    console.error("Error during Discord OAuth2 process:", error.message);
    res
      .status(500)
      .send("An error occurred during the authentication process.");
  }
});

app.use("/", urlRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
