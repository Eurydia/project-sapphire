import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1755378264474 implements MigrationInterface {
    name = 'Auto1755378264474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_tag_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "pinned" boolean NOT NULL DEFAULT (0), "name" text NOT NULL, "description" text NOT NULL DEFAULT (''), CONSTRAINT "UQ_39859da1b1e8725680e470e0ef3" UNIQUE ("name"))`);
        await queryRunner.query(`CREATE TABLE "project_tree_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "path" text NOT NULL, "readme" text, "projectUuid" varchar, CONSTRAINT "UQ_d6bf847028bb5aeb1c21b1e6563" UNIQUE ("path"))`);
        await queryRunner.query(`CREATE TABLE "project_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "created" datetime NOT NULL DEFAULT (datetime('now')), "lastVisited" date, "name" text NOT NULL, "pinned" boolean NOT NULL DEFAULT (0), "description" text NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_272eaae5c4f8c867f7e4ac3bcc" ON "project_entity" ("lastVisited") `);
        await queryRunner.query(`CREATE INDEX "IDX_141a6a7a22f17ddce0b954640e" ON "project_entity" ("name") `);
        await queryRunner.query(`CREATE TABLE "project_entity_tags_project_tag_entity" ("projectEntityUuid" varchar NOT NULL, "projectTagEntityUuid" varchar NOT NULL, PRIMARY KEY ("projectEntityUuid", "projectTagEntityUuid"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8c5669180de6595e66d52bf327" ON "project_entity_tags_project_tag_entity" ("projectEntityUuid") `);
        await queryRunner.query(`CREATE INDEX "IDX_33bc9116e37189c414c38ecb48" ON "project_entity_tags_project_tag_entity" ("projectTagEntityUuid") `);
        await queryRunner.query(`CREATE TABLE "temporary_project_tree_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "path" text NOT NULL, "readme" text, "projectUuid" varchar, CONSTRAINT "UQ_d6bf847028bb5aeb1c21b1e6563" UNIQUE ("path"), CONSTRAINT "FK_6cd32656b0c2b8d61a89f2d04d5" FOREIGN KEY ("projectUuid") REFERENCES "project_entity" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_project_tree_entity"("uuid", "path", "readme", "projectUuid") SELECT "uuid", "path", "readme", "projectUuid" FROM "project_tree_entity"`);
        await queryRunner.query(`DROP TABLE "project_tree_entity"`);
        await queryRunner.query(`ALTER TABLE "temporary_project_tree_entity" RENAME TO "project_tree_entity"`);
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
        await queryRunner.query(`ALTER TABLE "project_tree_entity" RENAME TO "temporary_project_tree_entity"`);
        await queryRunner.query(`CREATE TABLE "project_tree_entity" ("uuid" varchar PRIMARY KEY NOT NULL, "path" text NOT NULL, "readme" text, "projectUuid" varchar, CONSTRAINT "UQ_d6bf847028bb5aeb1c21b1e6563" UNIQUE ("path"))`);
        await queryRunner.query(`INSERT INTO "project_tree_entity"("uuid", "path", "readme", "projectUuid") SELECT "uuid", "path", "readme", "projectUuid" FROM "temporary_project_tree_entity"`);
        await queryRunner.query(`DROP TABLE "temporary_project_tree_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_33bc9116e37189c414c38ecb48"`);
        await queryRunner.query(`DROP INDEX "IDX_8c5669180de6595e66d52bf327"`);
        await queryRunner.query(`DROP TABLE "project_entity_tags_project_tag_entity"`);
        await queryRunner.query(`DROP INDEX "IDX_141a6a7a22f17ddce0b954640e"`);
        await queryRunner.query(`DROP INDEX "IDX_272eaae5c4f8c867f7e4ac3bcc"`);
        await queryRunner.query(`DROP TABLE "project_entity"`);
        await queryRunner.query(`DROP TABLE "project_tree_entity"`);
        await queryRunner.query(`DROP TABLE "project_tag_entity"`);
    }

}
