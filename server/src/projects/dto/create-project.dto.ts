import { IsOptional, IsString } from "class-validator";

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  absPath: string;

  @IsOptional()
  @IsString()
  description?: string | null;
}
