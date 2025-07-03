import { IsHexColor, IsOptional, IsString } from "class-validator";

export class CreateTopicDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  @IsHexColor()
  color?: string;
}
