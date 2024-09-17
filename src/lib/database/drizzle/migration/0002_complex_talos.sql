ALTER TABLE `Members` DROP INDEX `Members_refreshToken_unique`;--> statement-breakpoint
ALTER TABLE `Members` ADD `status` enum('verified','banned') DEFAULT 'verified' NOT NULL;--> statement-breakpoint
ALTER TABLE `Members` DROP COLUMN `refreshToken`;