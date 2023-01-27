export type CommandContext = {
  author: {
    id: string;
    username: string;
  };
  reply: (message: string) => void;
  post: (message: string) => void;
};
