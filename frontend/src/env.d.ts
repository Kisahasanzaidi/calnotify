interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare var process: {
  env: {
    REACT_APP_API_URL: string;
    [key: string]: string | undefined;
  };
};
