import type { CreateProjectDto } from "~/models/project/dto/create-project";

export declare global {
  interface Window {
    db: {
      Project: {
        getAll: () => Promise<unknown>;
        unpin: (uuid: string) => Promise<unknown>;
        pin: (uuid: string) => Promise<unknown>;
        create: (dto: CreateProjectDto) => Promise<unknown>;
      };
      Technology: {
        getAll: () => Promise<unknown>;
      };
      Topic: {
        getAll: () => Promise<unknown>;
      };
    };
  }
}
