import { ArrayUnique, IsArray, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  root: string;

  @IsString()
  description: string;

  @IsArray()
  @ArrayUnique()
  topics: string[];

  @IsArray()
  @ArrayUnique()
  technologies: string[];
}
