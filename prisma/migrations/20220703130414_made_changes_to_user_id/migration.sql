-- AlterTable
CREATE SEQUENCE "users_user_id_seq";
ALTER TABLE "users" ALTER COLUMN "user_id" SET DEFAULT nextval('users_user_id_seq');
ALTER SEQUENCE "users_user_id_seq" OWNED BY "users"."user_id";
