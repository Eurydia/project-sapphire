import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1755764590230 implements MigrationInterface {
    name = 'Auto1755764590230'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_acb6e11545ac24ad203887a374"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_repository_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "url" text NOT NULL, "projectUuid" varchar NOT NULL, CONSTRAINT "FK_61ac9e889c878d987ae1511b53b" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_repository_entity"("uuid", "createdAt", "name", "url", "projectUuid") SELECT "uuid", "createdAt", "name", "url", "projectUuid" FROM "project_repository_entity"`);
        await queryRunner.query(`DROP TABLE "project_repository_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_repository_entity" RENAME TO "project_repository_entity"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_workspace_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "root" text NOT NULL, "projectUuid" varchar NOT NULL, CONSTRAINT "FK_ba12358183335ab2fc852539f39" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_workspace_entity"("uuid", "createdAt", "name", "root", "projectUuid") SELECT "uuid", "createdAt", "name", "root", "projectUuid" FROM "project_workspace_entity"`);
        await queryRunner.query(`DROP TABLE "project_workspace_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_workspace_entity" RENAME TO "project_workspace_entity"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_workspace_entity" RENAME TO "temporary_project_workspace_entity"`);
        await queryRunner.query(`CREATE TABLE "project_workspace_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "lastOpened" date, "name" text NOT NULL, "root" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL, CONSTRAINT "FK_ba12358183335ab2fc852539f39" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "project_workspace_entity"("uuid", "createdAt", "name", "root", "projectUuid") SELECT "uuid", "createdAt", "name", "root", "projectUuid" FROM "temporary_project_workspace_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_workspace_entity"`);
        await queryRunner.query(`ALTER TABLE "project_repository_entity" RENAME TO "temporary_project_repository_entity"`);
        await queryRunner.query(`CREATE TABLE "project_repository_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "url" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL, CONSTRAINT "FK_61ac9e889c878d987ae1511b53b" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "project_repository_entity"("uuid", "createdAt", "name", "url", "projectUuid") SELECT "uuid", "createdAt", "name", "url", "projectUuid" FROM "temporary_project_repository_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_repository_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_acb6e11545ac24ad203887a374" ON "project_workspace_entity" ("lastOpened") `);
    }

}
