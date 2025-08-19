import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1755637912619 implements MigrationInterface {
    name = 'Auto1755637912619'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_repository_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "url" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "project_tag_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "pinned" boolean NOT NULL DEFAULT (0), "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), CONSTRAINT "UQ_39859da1b1e8725680e470e0ef3" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "project_workspace_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "lastOpened" date, "name" text NOT NULL, "root" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_acb6e11545ac24ad203887a374" ON "project_workspace_entity" ("lastOpened") `);
        await queryRunner.query(`CREATE TABLE "project_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "lastVisited" date, "name" text NOT NULL, "pinned" boolean NOT NULL DEFAULT (0), "description" text)`);
        await queryRunner.query(`CREATE INDEX "IDX_272eaae5c4f8c867f7e4ac3bcc" ON "project_entity" ("lastVisited") `);
        await queryRunner.query(`CREATE INDEX "IDX_141a6a7a22f17ddce0b954640e" ON "project_entity" ("name") `);
        await queryRunner.query(`CREATE TABLE "project_task_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "projectUuid" varchar)`);
        await queryRunner.query(`CREATE TABLE "project_tree_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "path" text NOT NULL, "readme" text, CONSTRAINT "UQ_d6bf847028bb5aeb1c21b1e6563" UNIQUE ("path"))`);
        await queryRunner.query(`CREATE TABLE "project_entity_tags_project_tag_entity" ("projectEntityUuid" varchar NOT NULL, "projectTagEntityUuid" varchar NOT NULL, PRIMARY KEY ("projectEntityUuid", "projectTagEntityUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8c5669180de6595e66d52bf327" ON "project_entity_tags_project_tag_entity" ("projectEntityUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_33bc9116e37189c414c38ecb48" ON "project_entity_tags_project_tag_entity" ("projectTagEntityUuid") `);
        await queryRunner.query(`CREATE TABLE "temporary_project_repository_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "url" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL, CONSTRAINT "FK_61ac9e889c878d987ae1511b53b" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_repository_entity"("uuid", "createdAt", "name", "url", "description", "projectUuid") SELECT "uuid", "createdAt", "name", "url", "description", "projectUuid" FROM "project_repository_entity"`);
        await queryRunner.query(`DROP TABLE "project_repository_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_repository_entity" RENAME TO "project_repository_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_acb6e11545ac24ad203887a374"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_workspace_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "lastOpened" date, "name" text NOT NULL, "root" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL, CONSTRAINT "FK_ba12358183335ab2fc852539f39" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_workspace_entity"("uuid", "createdAt", "lastOpened", "name", "root", "description", "projectUuid") SELECT "uuid", "createdAt", "lastOpened", "name", "root", "description", "projectUuid" FROM "project_workspace_entity"`);
        await queryRunner.query(`DROP TABLE "project_workspace_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_workspace_entity" RENAME TO "project_workspace_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_acb6e11545ac24ad203887a374" ON "project_workspace_entity" ("lastOpened") `);
        await queryRunner.query(`CREATE TABLE "temporary_project_task_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "projectUuid" varchar, CONSTRAINT "FK_b14518e635e83195cf38e59dd6c" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_task_entity"("uuid", "name", "description", "createdAt", "projectUuid") SELECT "uuid", "name", "description", "createdAt", "projectUuid" FROM "project_task_entity"`);
        await queryRunner.query(`DROP TABLE "project_task_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_task_entity" RENAME TO "project_task_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_8c5669180de6595e66d52bf327"`);
        await queryRunner.query(`DROP INDEX "IDX_33bc9116e37189c414c38ecb48"`);
        await queryRunner.query(`CREATE TABLE "temporary_project_entity_tags_project_tag_entity" ("projectEntityUuid" varchar NOT NULL, "projectTagEntityUuid" varchar NOT NULL, CONSTRAINT "FK_8c5669180de6595e66d52bf327f" FOREIGN KEY ("projectEntityUuid") REFERENCES "project_entity" ("uuid") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_33bc9116e37189c414c38ecb489" FOREIGN KEY ("projectTagEntityUuid") REFERENCES "project_tag_entity" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("projectEntityUuid", "projectTagEntityUuid"))`);
        await queryRunner.query(`INSERT INTO "temporary_project_entity_tags_project_tag_entity"("projectEntityUuid", "projectTagEntityUuid") SELECT "projectEntityUuid", "projectTagEntityUuid" FROM "project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`DROP TABLE "project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_entity_tags_project_tag_entity" RENAME TO "project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_8c5669180de6595e66d52bf327" ON "project_entity_tags_project_tag_entity" ("projectEntityUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_33bc9116e37189c414c38ecb48" ON "project_entity_tags_project_tag_entity" ("projectTagEntityUuid") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_33bc9116e37189c414c38ecb48"`);
        await queryRunner.query(`DROP INDEX "IDX_8c5669180de6595e66d52bf327"`);
        await queryRunner.query(`ALTER TABLE "project_entity_tags_project_tag_entity" RENAME TO "temporary_project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`CREATE TABLE "project_entity_tags_project_tag_entity" ("projectEntityUuid" varchar NOT NULL, "projectTagEntityUuid" varchar NOT NULL, PRIMARY KEY ("projectEntityUuid", "projectTagEntityUuid"))`);
        await queryRunner.query(`INSERT INTO "project_entity_tags_project_tag_entity"("projectEntityUuid", "projectTagEntityUuid") SELECT "projectEntityUuid", "projectTagEntityUuid" FROM "temporary_project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_33bc9116e37189c414c38ecb48" ON "project_entity_tags_project_tag_entity" ("projectTagEntityUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_8c5669180de6595e66d52bf327" ON "project_entity_tags_project_tag_entity" ("projectEntityUuid") `);
        await queryRunner.query(`ALTER TABLE "project_task_entity" RENAME TO "temporary_project_task_entity"`);
        await queryRunner.query(`CREATE TABLE "project_task_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "projectUuid" varchar)`);
        await queryRunner.query(`INSERT INTO "project_task_entity"("uuid", "name", "description", "createdAt", "projectUuid") SELECT "uuid", "name", "description", "createdAt", "projectUuid" FROM "temporary_project_task_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_task_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_acb6e11545ac24ad203887a374"`);
        await queryRunner.query(`ALTER TABLE "project_workspace_entity" RENAME TO "temporary_project_workspace_entity"`);
        await queryRunner.query(`CREATE TABLE "project_workspace_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "lastOpened" date, "name" text NOT NULL, "root" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "project_workspace_entity"("uuid", "createdAt", "lastOpened", "name", "root", "description", "projectUuid") SELECT "uuid", "createdAt", "lastOpened", "name", "root", "description", "projectUuid" FROM "temporary_project_workspace_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_workspace_entity"`);
        await queryRunner.query(`CREATE INDEX "IDX_acb6e11545ac24ad203887a374" ON "project_workspace_entity" ("lastOpened") `);
        await queryRunner.query(`ALTER TABLE "project_repository_entity" RENAME TO "temporary_project_repository_entity"`);
        await queryRunner.query(`CREATE TABLE "project_repository_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "name" text NOT NULL, "url" text NOT NULL, "description" text, "projectUuid" varchar NOT NULL)`);
        await queryRunner.query(`INSERT INTO "project_repository_entity"("uuid", "createdAt", "name", "url", "description", "projectUuid") SELECT "uuid", "createdAt", "name", "url", "description", "projectUuid" FROM "temporary_project_repository_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_repository_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_33bc9116e37189c414c38ecb48"`);
        await queryRunner.query(`DROP INDEX "IDX_8c5669180de6595e66d52bf327"`);
        await queryRunner.query(`DROP TABLE "project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`DROP TABLE "project_tree_entity"`);
        await queryRunner.query(`DROP TABLE "project_task_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_141a6a7a22f17ddce0b954640e"`);
        await queryRunner.query(`DROP INDEX "IDX_272eaae5c4f8c867f7e4ac3bcc"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_acb6e11545ac24ad203887a374"`);
        await queryRunner.query(`DROP TABLE "project_workspace_entity"`);
        await queryRunner.query(`DROP TABLE "project_tag_entity"`);
        await queryRunner.query(`DROP TABLE "project_repository_entity"`);
    }

}
