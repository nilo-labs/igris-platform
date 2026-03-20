CREATE TABLE "anomalies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"server_id" uuid NOT NULL,
	"cpu_usage" real NOT NULL,
	"type" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "servers" ADD COLUMN "last_ping_at" timestamp;--> statement-breakpoint
ALTER TABLE "anomalies" ADD CONSTRAINT "anomalies_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;