CREATE TABLE IF NOT EXISTS "books" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"author" text NOT NULL,
	"publisher" text NOT NULL,
	"genre" text NOT NULL,
	"isbnNo" text NOT NULL,
	"numOfPages" integer NOT NULL,
	"totalNumOfCopies" integer NOT NULL,
	"availableNumOfCopies" integer NOT NULL,
	"price" integer NOT NULL,
	CONSTRAINT "books_isbnNo_unique" UNIQUE("isbnNo")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"age" integer NOT NULL,
	"email" text NOT NULL,
	"phoneNumber" text NOT NULL,
	"address" text NOT NULL,
	"password" text NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"status" "status" DEFAULT 'verified' NOT NULL,
	CONSTRAINT "members_email_unique" UNIQUE("email"),
	CONSTRAINT "members_phoneNumber_unique" UNIQUE("phoneNumber"),
	CONSTRAINT "members_password_unique" UNIQUE("password")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"bookStatus" "bookStatus" DEFAULT 'pending',
	"requestStatus" "requestStatus" DEFAULT 'requested',
	"dateOfIssue" text NOT NULL,
	"dueDate" text NOT NULL,
	"memberId" integer NOT NULL,
	"bookId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_memberId_members_id_fk" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transactions" ADD CONSTRAINT "transactions_bookId_books_id_fk" FOREIGN KEY ("bookId") REFERENCES "public"."books"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
