ALTER TABLE `MemberSessions` RENAME COLUMN `address` TO `refreshToken`;--> statement-breakpoint
ALTER TABLE `MemberSessions` DROP INDEX `MemberSessions_address_unique`;--> statement-breakpoint
ALTER TABLE `MemberSessions` ADD CONSTRAINT `MemberSessions_refreshToken_unique` UNIQUE(`refreshToken`);