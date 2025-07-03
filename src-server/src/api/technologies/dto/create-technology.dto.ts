import { IsHexColor, IsOptional, IsString } from "class-validator";

export class CreateTechnologyDto {
  @IsString()
  name: string;

  @IsHexColor()
  @IsString()
  @IsOptional()
  color?: string;
}
