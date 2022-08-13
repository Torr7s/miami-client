export default {
  token: process.env.DISCORD_CLIENT_TOKEN as string,
  colors: {
    BLACK: 2303786,
    LIGHT_BLACK: 2895667,
    GREY: 9807270,
    LIGHT_GREY: 12370112,
    DARK_GREY: 9936031,
    DARKER_GREY: 8359053
  },
  guildId: process.env.DISCORD_GUILD_ID as string,
  devId: process.env.DISCORD_DEV_ID as string
}