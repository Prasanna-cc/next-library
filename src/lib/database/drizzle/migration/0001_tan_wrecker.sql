ALTER TABLE `Transactions` MODIFY COLUMN `dateOfIssue` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Transactions` MODIFY COLUMN `dueDate` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Members` ADD CONSTRAINT `Members_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `Members` ADD CONSTRAINT `Members_password_unique` UNIQUE(`password`);--> statement-breakpoint
ALTER TABLE `Members` ADD CONSTRAINT `Members_refreshToken_unique` UNIQUE(`refreshToken`);--> statement-breakpoint
ALTER TABLE `Members` ADD `email` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Members` ADD `password` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `Members` ADD `role` enum('user','admin') DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `Members` ADD `refreshToken` varchar(255);