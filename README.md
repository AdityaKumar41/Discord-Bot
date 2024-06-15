# Short URL Discord Bot

![Short URL Discord Bot](./public/coverimage.png)

## Description

This Discord bot provides a URL shortening service similar to bit.ly, allowing users to generate short URLs for any provided long URLs. It emphasizes data security and authentication, enabling users to track traffic statistics for the generated short URLs directly within Discord. This bot serves as a comprehensive alternative to platforms like bit.ly for URL shortening needs within a Discord server environment.

````markdown
## Features

- **URL Shortening:** Generates short URLs from user-provided long URLs.
- **Traffic Analytics:** Provides detailed traffic statistics for each generated short URL.
- **Authentication:** Ensures data security and user authentication for accessing URL statistics.
- **Discord Integration:** Seamlessly operates within Discord channels, allowing users to interact directly with the bot.

## Getting Started

To run the bot locally, use the following commands:

```sh
npm run dev
npm start
```
````

Ensure you have created a `.env` file with the following variables:

```
PORT=8000
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_discord_client_id_here
CLIENT_SECRET=your_discord_client_secret_here
SECRET=your_secret_here
DATABASE_URL=mongodb://localhost:27017/discorde
```

Replace `your_discord_bot_token_here`, `your_discord_client_id_here`, `your_discord_client_secret_here`, `your_secret_here` with your actual Discord bot token, client ID, client secret, and any secret key you are using respectively. Ensure that you have MongoDB running locally or provide the appropriate URL for your MongoDB instance.

## Usage

1. **Invite the bot to your Discord server.**
2. **Authenticate with the bot:**
   - Type `/url` in any channel where the bot is present.
   - If it's your first time using the bot, it will prompt you to authenticate with Discord.
3. **Shorten URLs:**
   - After authentication, type `/url <longURL>` to shorten the provided long URL.
4. **View Traffic Statistics:**
   - Use `/stats <shortURL>` to display traffic statistics for a specific short URL.

## Example Commands

- `/url https://example.com` - Shortens the provided long URL.
- `/stats abc123` - Displays traffic statistics for the short URL `abc123`.

## Contributing

Contributions are welcome! Please fork the repository and submit pull requests to contribute to the project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
