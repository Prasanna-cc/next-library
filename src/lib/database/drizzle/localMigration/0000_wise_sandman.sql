CREATE TABLE `Books` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`author` varchar(255) NOT NULL,
	`publisher` varchar(255) NOT NULL,
	`genre` varchar(255) NOT NULL,
	`isbnNo` varchar(255) NOT NULL,
	`numOfPages` int NOT NULL,
	`totalNumOfCopies` int NOT NULL,
	`availableNumOfCopies` int NOT NULL,
	`price` int NOT NULL,
	`imageUrl` varchar(255),
	CONSTRAINT `Books_id` PRIMARY KEY(`id`),
	CONSTRAINT `Books_isbnNo_unique` UNIQUE(`isbnNo`)
);
--> statement-breakpoint
CREATE TABLE `Members` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`age` int NOT NULL,
	`email` varchar(255) NOT NULL,
	`phoneNumber` varchar(255) NOT NULL,
	`address` varchar(255) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`status` enum('verified','banned') NOT NULL DEFAULT 'verified',
	CONSTRAINT `Members_id` PRIMARY KEY(`id`),
	CONSTRAINT `Members_email_unique` UNIQUE(`email`),
	CONSTRAINT `Members_phoneNumber_unique` UNIQUE(`phoneNumber`),
	CONSTRAINT `Members_password_unique` UNIQUE(`password`)
);
--> statement-breakpoint
CREATE TABLE `Transactions` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`bookStatus` enum('pending','issued','returned') DEFAULT 'pending',
	`requestStatus` enum('requested','approved','rejected') DEFAULT 'requested',
	`dateOfIssue` varchar(255) NOT NULL,
	`dueDate` varchar(255) NOT NULL,
	`memberId` int NOT NULL,
	`bookId` int NOT NULL,
	CONSTRAINT `Transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_memberId_Members_id_fk` FOREIGN KEY (`memberId`) REFERENCES `Members`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_bookId_Books_id_fk` FOREIGN KEY (`bookId`) REFERENCES `Books`(`id`) ON DELETE no action ON UPDATE no action;