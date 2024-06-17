const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./model/users");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const { REST, Routes } = require("discord.js");
const commands = [
  {
    name: "url",
    description: "Replies with ShortURL!",
    options: [
      {
        name: "url",
        type: 3, // String type
        description: "The URL to shorten",
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, user } = interaction;

  const dbUser = await User.findOne({ discordId: user.id });

  if (!dbUser) {
    await interaction.reply({
      content: `You need to authenticate first. Please visit https://discord-bot-gepg.onrender.com/auth`,
      ephemeral: true,
    });
    return;
  }

  const isValidURL = (string) => {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    try {
      new URL(string);
      return regex.test(string);
    } catch (e) {
      return false;
    }
  };

  if (commandName === "url") {
    const url = options.getString("url");

    if (!isValidURL(url)) {
      await interaction.reply({
        content: `Please provide a valid URL.`,
      });
      return;
    }

    try {
      const response = await fetch("https://discord-bot-gepg.onrender.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) throw new Error("Failed to shorten URL");

      const data = await response.json();
      const shortUrl = data.shortUrl.urlEncoded;

      await interaction.reply({
        content: `Your short URL is: https://discord-bot-gepg.onrender.com/${shortUrl}`,
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: `Error: ${error.message}`,
        ephemeral: true,
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
