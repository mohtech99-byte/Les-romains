CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"role" text NOT NULL,
	"action" text DEFAULT 'login' NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"excerpt" text NOT NULL,
	"excerpt_ar" text NOT NULL,
	"content" text NOT NULL,
	"content_ar" text NOT NULL,
	"category" text NOT NULL,
	"category_ar" text NOT NULL,
	"author" text NOT NULL,
	"author_ar" text NOT NULL,
	"date" text NOT NULL,
	"read_time" text NOT NULL,
	"read_time_ar" text NOT NULL,
	"image" text NOT NULL,
	"tags" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_quotation_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"quotation_id" integer NOT NULL,
	"description" text NOT NULL,
	"quantity" text DEFAULT '1' NOT NULL,
	"unit_price" text DEFAULT '0' NOT NULL,
	"total" text DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customer_quotations" (
	"id" serial PRIMARY KEY NOT NULL,
	"quotation_number" text NOT NULL,
	"customer_name" text NOT NULL,
	"customer_phone" text NOT NULL,
	"customer_email" text,
	"customer_address" text,
	"issue_date" text NOT NULL,
	"valid_until" text NOT NULL,
	"subtotal" text DEFAULT '0' NOT NULL,
	"discount" text DEFAULT '0' NOT NULL,
	"total" text DEFAULT '0' NOT NULL,
	"notes" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "customer_quotations_quotation_number_unique" UNIQUE("quotation_number")
);
--> statement-breakpoint
CREATE TABLE "estimations" (
	"id" text PRIMARY KEY NOT NULL,
	"module" text NOT NULL,
	"client" text NOT NULL,
	"project_name" text NOT NULL,
	"notes" text DEFAULT '',
	"inputs" text NOT NULL,
	"manufacturing_cost" text NOT NULL,
	"selling_price" text NOT NULL,
	"profit" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"size" text NOT NULL,
	"mime_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"date" text NOT NULL,
	"status" text DEFAULT 'unread' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text DEFAULT '',
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "pricing_factors" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"value" text NOT NULL,
	"unit" text DEFAULT '' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"description_ar" text NOT NULL,
	"materials" text NOT NULL,
	"materials_ar" text NOT NULL,
	"sizes" text NOT NULL,
	"customization_options" text NOT NULL,
	"customization_options_ar" text NOT NULL,
	"images" text NOT NULL,
	"specifications" text NOT NULL,
	"specifications_ar" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"description_ar" text NOT NULL,
	"client" text NOT NULL,
	"location" text NOT NULL,
	"location_ar" text NOT NULL,
	"completion_date" text NOT NULL,
	"materials" text NOT NULL,
	"materials_ar" text NOT NULL,
	"challenge" text NOT NULL,
	"challenge_ar" text NOT NULL,
	"solution" text NOT NULL,
	"solution_ar" text NOT NULL,
	"images" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quotes" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"project_type" text NOT NULL,
	"service_id" text,
	"dimensions" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'created' NOT NULL,
	"status_history" text,
	"quote_items" text,
	"budget" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"response_message" text
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"title_ar" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"description_ar" text NOT NULL,
	"full_description" text NOT NULL,
	"full_description_ar" text NOT NULL,
	"icon" text NOT NULL,
	"image" text NOT NULL,
	"features" text NOT NULL,
	"features_ar" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"seo_title" text NOT NULL,
	"seo_description" text NOT NULL,
	"whatsapp_number" text,
	"contact_phone" text,
	"contact_email" text NOT NULL,
	"address" text,
	"address_ar" text,
	"business_hours" text,
	"business_hours_ar" text,
	"facebook_url" text,
	"instagram_url" text,
	"tiktok_url" text,
	"youtube_url" text,
	"linkedin_url" text,
	"logo_text" text,
	"logo_text_ar" text,
	"hero_title" text NOT NULL,
	"hero_title_ar" text NOT NULL,
	"hero_subtitle" text NOT NULL,
	"hero_subtitle_ar" text NOT NULL,
	"hero_badge" text NOT NULL,
	"hero_badge_ar" text NOT NULL,
	"hero_bg_image" text NOT NULL,
	"home_stat_1_value" text NOT NULL,
	"home_stat_1_label" text NOT NULL,
	"home_stat_1_label_ar" text NOT NULL,
	"home_stat_2_value" text NOT NULL,
	"home_stat_2_label" text NOT NULL,
	"home_stat_2_label_ar" text NOT NULL,
	"home_stat_3_value" text NOT NULL,
	"home_stat_3_label" text NOT NULL,
	"home_stat_3_label_ar" text NOT NULL,
	"seo_keywords" text NOT NULL,
	"og_title" text,
	"og_description" text,
	"robots_txt" text,
	"sitemap_xml" text,
	"redirect_rules" text,
	"google_maps_url" text,
	"footer_text" text,
	"footer_text_ar" text,
	"quote_validity_days" integer DEFAULT 15,
	"terms_and_conditions" text,
	"terms_and_conditions_ar" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"name_ar" text NOT NULL,
	"role" text NOT NULL,
	"role_ar" text NOT NULL,
	"company" text NOT NULL,
	"company_ar" text NOT NULL,
	"content" text NOT NULL,
	"content_ar" text NOT NULL,
	"rating" integer NOT NULL,
	"avatar" text NOT NULL,
	"is_featured" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'editor' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "workshop_pricing" (
	"id" text PRIMARY KEY NOT NULL,
	"group" text NOT NULL,
	"key" text NOT NULL,
	"label" text NOT NULL,
	"label_ar" text NOT NULL,
	"value" text NOT NULL,
	"unit" text DEFAULT '' NOT NULL,
	"meta" text DEFAULT '',
	"is_active" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customer_quotation_items" ADD CONSTRAINT "customer_quotation_items_quotation_id_customer_quotations_id_fk" FOREIGN KEY ("quotation_id") REFERENCES "public"."customer_quotations"("id") ON DELETE cascade ON UPDATE no action;