CREATE TABLE `categorias` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`es_necesidad` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categorias_nombre_unique` ON `categorias` (`nombre`);--> statement-breakpoint
CREATE TABLE `cuentas` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre` text NOT NULL,
	`tipo` text NOT NULL,
	`saldo_actual` real DEFAULT 0 NOT NULL,
	`limite_credito` real,
	`fecha_corte` integer,
	`fecha_pago` integer
);
--> statement-breakpoint
CREATE TABLE `deudas_amigos` (
	`id` text PRIMARY KEY NOT NULL,
	`transaccion_id` text NOT NULL,
	`nombre_amigo` text NOT NULL,
	`monto_debe` real NOT NULL,
	`esta_pagado` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`transaccion_id`) REFERENCES `transacciones`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `metas_ahorro` (
	`id` text PRIMARY KEY NOT NULL,
	`nombre_meta` text NOT NULL,
	`monto_obj_gta` real NOT NULL,
	`monto_actual` real DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transacciones` (
	`id` text PRIMARY KEY NOT NULL,
	`cuenta_origen_id` text NOT NULL,
	`cuenta_destino_id` text,
	`categoria_id` text NOT NULL,
	`monto` real NOT NULL,
	`comision` real DEFAULT 0 NOT NULL,
	`tipo` text NOT NULL,
	`descripcion` text,
	`es_pendiente` integer DEFAULT false NOT NULL,
	`requiere_revision` integer DEFAULT false NOT NULL,
	`fecha_creacion` text NOT NULL,
	FOREIGN KEY (`cuenta_origen_id`) REFERENCES `cuentas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`cuenta_destino_id`) REFERENCES `cuentas`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON UPDATE no action ON DELETE no action
);
