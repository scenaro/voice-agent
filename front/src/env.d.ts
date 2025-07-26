interface ImportMetaEnv {
  NODE_ENV: 'development' | 'production';
  LIVEKIT_URL: string;
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}