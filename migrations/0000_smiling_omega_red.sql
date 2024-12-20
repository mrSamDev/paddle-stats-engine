CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`github_username` text NOT NULL,
	`avatar_url` text NOT NULL,
	`url` text NOT NULL,
	`html_url` text NOT NULL,
	`name` text NOT NULL,
	`score` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_username_unique` ON `users` (`github_username`);