import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1755465830861 implements MigrationInterface {
    name = 'Auto1755465830861'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_task_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "projectUuid" varchar)`);
        await queryRunner.query(`CREATE TABLE "temporary_project_task_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "projectUuid" varchar, CONSTRAINT "FK_b14518e635e83195cf38e59dd6c" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_task_entity"("uuid", "name", "description", "createdAt", "projectUuid") SELECT "uuid", "name", "description", "createdAt", "projectUuid" FROM "project_task_entity"`);
        await queryRunner.query(`DROP TABLE "project_task_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_task_entity" RENAME TO "project_task_entity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_task_entity" RENAME TO "temporary_project_task_entity"`);
        await queryRunner.query(`CREATE TABLE "project_task_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "projectUuid" varchar)`);
        await queryRunner.query(`INSERT INTO "project_task_entity"("uuid", "name", "description", "createdAt", "projectUuid") SELECT "uuid", "name", "description", "createdAt", "projectUuid" FROM "temporary_project_task_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_task_entity"`);
        await queryRunner.query(`DROP TABLE "project_task_entity"`);
    }

}
