export default {
  token: process.env.DISCORD_CLIENT_TOKEN as string,
  avatarURL: process.env.DISCORD_CLIENT_AVATAR_URL as string,
  guildId: process.env.DISCORD_GUILD_ID as string,
  ownerId: process.env.DISCORD_DEV_ID as string,
  mongoURI: process.env.MONGO_URI as string
}