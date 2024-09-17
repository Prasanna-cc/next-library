CREATE TABLE `MemberSessions` (
	`id` int NOT NULL,
	`address` varchar(255) NOT NULL,
	CONSTRAINT `MemberSessions_address_unique` UNIQUE(`address`)
);
--> statement-breakpoint
ALTER TABLE `MemberSessions` ADD CONSTRAINT `MemberSessions_id_Members_id_fk` FOREIGN KEY (`id`) REFERENCES `Members`(`id`) ON DELETE no action ON UPDATE no action;