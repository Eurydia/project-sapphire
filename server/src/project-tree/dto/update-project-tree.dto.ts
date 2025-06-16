import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectTreeDto } from './create-project-tree.dto';

export class UpdateProjectTreeDto extends PartialType(CreateProjectTreeDto) {}
