export interface GithubConfigProps {
  apiURL: string;
  userAgent: string;
}

export interface MessariConfigProps {
  apiKey: string;
  apiURL: string;
}

export interface MongooseConfigProps {
  mongoURL: string;
}

export interface ClientConfigProps {
  avatarURL: string;
  guildId: string;
  ownerId: string;
  token: string;
}

export interface AppConfigProps {
  app: {
    client: ClientConfigProps;
    database: MongooseConfigProps;
    resources: {
      messari: MessariConfigProps;
      github: GithubConfigProps;
    };
  }
}

export default {
  app: {
    client: {
      avatarURL: process.env.CLIENT_AVATAR_URL,
      guildId: process.env.GUILD_ID,
      ownerId: process.env.DEV_ID,
      token: process.env.CLIENT_TOKEN,
    },
    database: {
      mongoURL: process.env.MONGO_URL,
    },
    resources: {
      messari: {
        apiKey: process.env.MESSARI_API_KEY,
        apiURL: process.env.MESSARI_API_URL
      },
      github: {
        apiURL: process.env.GITHUB_API_URL,
        userAgent: process.env.GITHUB_USER_AGENT
      }
    }
  }
} as AppConfigProps;