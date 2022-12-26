export interface AppConfigProps {
  app: {
    client: ClientConfigProps;
    database: DatabaseConfigProps;
    resources: {
      messari: MessariConfigProps;
      github: GithubConfigProps;
    };
  }
}

export interface ClientConfigProps {
  avatarUrl: string;
  guildId: string;
  ownerId: string;
  token: string;
}

export interface DatabaseConfigProps {
  mongoose: {
    url: string;
  }
}

export interface GithubConfigProps {
  api: {
    userAgent: string;
    url: string;
  }
}

export interface MessariConfigProps {
  api: {
    key: string;
    url: string;
  }
}

export default {
  app: {
    client: {
      avatarUrl: process.env.CLIENT_AVATAR_URL,
      guildId: process.env.GUILD_ID,
      ownerId: process.env.OWNER_ID,
      token: process.env.CLIENT_TOKEN,
    },
    database: {
      mongoose: {
        url: process.env.MONGO_URL
      }
    },
    resources: {
      messari: {
        api: {
          key: process.env.MESSARI_API_KEY,
          url: process.env.MESSARI_API_URL
        }
      },
      github: {
        api: {
          url: process.env.GITHUB_API_URL,
          userAgent: process.env.GITHUB_USER_AGENT
        }
      },
    }
  }
} as AppConfigProps;