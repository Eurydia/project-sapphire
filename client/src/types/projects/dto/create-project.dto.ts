export type CreateProjectDto = {
  name: string;
  absPath: string;
  description?: string;
  topics: string[];
  technologies: string[];
};
