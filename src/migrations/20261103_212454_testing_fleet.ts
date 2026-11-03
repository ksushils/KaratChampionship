import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_test_cars_ownership" AS ENUM('owned', 'operated', 'partner');
  CREATE TABLE "test_cars_availability" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"from" timestamp(3) with time zone NOT NULL,
  	"to" timestamp(3) with time zone NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE "test_cars" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"ownership" "enum_test_cars_ownership" NOT NULL,
  	"operator" varchar,
  	"category" varchar,
  	"generation" varchar,
  	"specification_chassis" varchar,
  	"specification_engine" varchar,
  	"specification_gearbox" varchar,
  	"specification_tyres" varchar,
  	"base_location" varchar,
  	"restrictions" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "test_cars_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "test_cars_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"circuits_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "test_cars_id" integer;
  ALTER TABLE "test_cars_availability" ADD CONSTRAINT "test_cars_availability_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."test_cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "test_cars_texts" ADD CONSTRAINT "test_cars_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."test_cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "test_cars_rels" ADD CONSTRAINT "test_cars_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."test_cars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "test_cars_rels" ADD CONSTRAINT "test_cars_rels_circuits_fk" FOREIGN KEY ("circuits_id") REFERENCES "public"."circuits"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "test_cars_availability_order_idx" ON "test_cars_availability" USING btree ("_order");
  CREATE INDEX "test_cars_availability_parent_id_idx" ON "test_cars_availability" USING btree ("_parent_id");
  CREATE INDEX "test_cars_updated_at_idx" ON "test_cars" USING btree ("updated_at");
  CREATE INDEX "test_cars_created_at_idx" ON "test_cars" USING btree ("created_at");
  CREATE INDEX "test_cars_texts_order_parent" ON "test_cars_texts" USING btree ("order","parent_id");
  CREATE INDEX "test_cars_rels_order_idx" ON "test_cars_rels" USING btree ("order");
  CREATE INDEX "test_cars_rels_parent_idx" ON "test_cars_rels" USING btree ("parent_id");
  CREATE INDEX "test_cars_rels_path_idx" ON "test_cars_rels" USING btree ("path");
  CREATE INDEX "test_cars_rels_circuits_id_idx" ON "test_cars_rels" USING btree ("circuits_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_test_cars_fk" FOREIGN KEY ("test_cars_id") REFERENCES "public"."test_cars"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_test_cars_id_idx" ON "payload_locked_documents_rels" USING btree ("test_cars_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "test_cars_availability" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "test_cars" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "test_cars_texts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "test_cars_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "test_cars_availability" CASCADE;
  DROP TABLE "test_cars" CASCADE;
  DROP TABLE "test_cars_texts" CASCADE;
  DROP TABLE "test_cars_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_test_cars_fk";
  
  DROP INDEX "payload_locked_documents_rels_test_cars_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "test_cars_id";
  DROP TYPE "public"."enum_test_cars_ownership";`)
}
