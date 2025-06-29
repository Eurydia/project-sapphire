import { ArrayUnique, IsArray, IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  absPath: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  topics?: string[];

  @IsArray()
  @ArrayUnique()
  @IsOptional()
  technologies?: string[];
}
