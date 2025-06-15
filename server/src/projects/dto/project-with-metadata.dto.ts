import { Expose } from "class-transformer";
import { ProjectRootMetadata } from "src/common/utils/project-root-metadata.helper";
import { Technology } from "src/technologies/technology.entity";
import { Topic } from "src/topics/topic.entity";

export class ProjectWithMetadataDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  absPath: string;

  @Expose()
  description?: string | null;

  @Expose()
  topics: Topic[];

  @Expose()
  technologies: Technology[];

  @Expose()
  metadata?: ProjectRootMetadata | null;
}
