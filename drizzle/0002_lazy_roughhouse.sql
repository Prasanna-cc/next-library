CREATE TABLE IF NOT EXISTS "Professors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"department" text NOT NULL,
	"shortBio" text,
	"eventLink" text,
	CONSTRAINT "Professors_email_unique" UNIQUE("email")
);
