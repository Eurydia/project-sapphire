import { IsString } from "class-validator";

export class CreateTechnologyDto {
  @IsString()
  name: string;
}
