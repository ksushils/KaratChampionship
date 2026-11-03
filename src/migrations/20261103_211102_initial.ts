import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_divisions_key" AS ENUM('championship-team', 'testing', 'championship-organisation');
  CREATE TYPE "public"."enum_divisions_status" AS ENUM('planned', 'enquiries-open', 'launching-soon', 'operational');
  CREATE TYPE "public"."enum_programmes_status" AS ENUM('intended', 'subject-to-approval', 'confirmed', 'active', 'completed', 'archived', 'future');
  CREATE TYPE "public"."enum_programmes_relationship_type" AS ENUM('entrant', 'technical-operator', 'driver-support', 'commercial-partner', 'proposed-participant', 'other');
  CREATE TYPE "public"."enum_programmes_seat_availability" AS ENUM('not-published', 'available', 'limited', 'full');
  CREATE TYPE "public"."enum_programmes_pricing_mode" AS ENUM('discuss', 'published');
  CREATE TYPE "public"."enum_programmes_pricing_currency" AS ENUM('GBP', 'EUR', 'INR', 'USD');
  CREATE TYPE "public"."enum_programmes_pricing_tax_basis" AS ENUM('excl-vat', 'incl-vat', 'not-applicable');
  CREATE TYPE "public"."enum_programmes_substantiation_status" AS ENUM('unverified', 'evidence-supplied', 'verified', 'owner-approved');
  CREATE TYPE "public"."enum_programme_seasons_participation_status" AS ENUM('intended', 'subject-to-approval', 'confirmed', 'active', 'completed', 'archived', 'future');
  CREATE TYPE "public"."enum_programme_seasons_seat_availability" AS ENUM('not-published', 'available', 'limited', 'full');
  CREATE TYPE "public"."enum_championships_level" AS ENUM('entry-single-seater', 'f4', 'national-f3', 'regional', 'fia-f3', 'fia-f2', 'formula-libre', 'other');
  CREATE TYPE "public"."enum_championships_substantiation_status" AS ENUM('unverified', 'evidence-supplied', 'verified', 'owner-approved');
  CREATE TYPE "public"."enum_drivers_alumni" AS ENUM('none', 'karat', 'kic');
  CREATE TYPE "public"."enum_drivers_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__drivers_v_version_alumni" AS ENUM('none', 'karat', 'kic');
  CREATE TYPE "public"."enum__drivers_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_driver_engagements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__driver_engagements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_events_type" AS ENUM('race-weekend', 'official-test', 'launch', 'team-event');
  CREATE TYPE "public"."enum_events_event_status" AS ENUM('scheduled', 'provisional', 'postponed', 'cancelled', 'completed', 'revised');
  CREATE TYPE "public"."enum_events_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__events_v_version_type" AS ENUM('race-weekend', 'official-test', 'launch', 'team-event');
  CREATE TYPE "public"."enum__events_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sessions_type" AS ENUM('practice', 'test', 'qualifying', 'qualifying-race', 'heat', 'race', 'final', 'other');
  CREATE TYPE "public"."enum_sessions_certainty" AS ENUM('confirmed', 'provisional', 'tbc');
  CREATE TYPE "public"."enum_sessions_status" AS ENUM('scheduled', 'delayed', 'cancelled', 'completed');
  CREATE TYPE "public"."enum_result_sets_entries_status" AS ENUM('classified', 'DNS', 'DNF', 'DSQ', 'NC', 'DNQ', 'EXC', 'other');
  CREATE TYPE "public"."enum_result_sets_state" AS ENUM('provisional', 'final');
  CREATE TYPE "public"."enum_result_sets_verification" AS ENUM('unverified', 'verified');
  CREATE TYPE "public"."enum_result_sets_attribution" AS ENUM('karat', 'kic', 'other');
  CREATE TYPE "public"."enum_result_sets_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__result_sets_v_version_entries_status" AS ENUM('classified', 'DNS', 'DNF', 'DSQ', 'NC', 'DNQ', 'EXC', 'other');
  CREATE TYPE "public"."enum__result_sets_v_version_state" AS ENUM('provisional', 'final');
  CREATE TYPE "public"."enum__result_sets_v_version_verification" AS ENUM('unverified', 'verified');
  CREATE TYPE "public"."enum__result_sets_v_version_attribution" AS ENUM('karat', 'kic', 'other');
  CREATE TYPE "public"."enum__result_sets_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_standings_type" AS ENUM('driver', 'team');
  CREATE TYPE "public"."enum_standings_state" AS ENUM('provisional', 'final');
  CREATE TYPE "public"."enum_standings_verification" AS ENUM('unverified', 'verified');
  CREATE TYPE "public"."enum_standings_attribution" AS ENUM('karat', 'kic', 'other');
  CREATE TYPE "public"."enum_standings_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__standings_v_version_type" AS ENUM('driver', 'team');
  CREATE TYPE "public"."enum__standings_v_version_state" AS ENUM('provisional', 'final');
  CREATE TYPE "public"."enum__standings_v_version_verification" AS ENUM('unverified', 'verified');
  CREATE TYPE "public"."enum__standings_v_version_attribution" AS ENUM('karat', 'kic', 'other');
  CREATE TYPE "public"."enum__standings_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_articles_type" AS ENUM('announcement', 'preview', 'report', 'interview', 'feature', 'partnership', 'team-update');
  CREATE TYPE "public"."enum_articles_editorial_status" AS ENUM('draft', 'in-review', 'approved', 'archived');
  CREATE TYPE "public"."enum_articles_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__articles_v_version_type" AS ENUM('announcement', 'preview', 'report', 'interview', 'feature', 'partnership', 'team-update');
  CREATE TYPE "public"."enum__articles_v_version_editorial_status" AS ENUM('draft', 'in-review', 'approved', 'archived');
  CREATE TYPE "public"."enum__articles_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_faqs_category" AS ENUM('programmes', 'driver-enquiries', 'sponsorship', 'logistics', 'general', 'testing', 'championship-organisation', 'careers', 'media');
  CREATE TYPE "public"."enum_media_collections_videos_provider" AS ENUM('youtube', 'vimeo', 'link');
  CREATE TYPE "public"."enum_media_collections_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__media_collections_v_version_videos_provider" AS ENUM('youtube', 'vimeo', 'link');
  CREATE TYPE "public"."enum__media_collections_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_usage_scope" AS ENUM('web', 'web-and-social', 'press', 'all-media', 'internal-only');
  CREATE TYPE "public"."enum_partnerships_tier" AS ENUM('title', 'principal', 'official', 'technical', 'supplier', 'other');
  CREATE TYPE "public"."enum_partnerships_scope" AS ENUM('team', 'programme', 'driver');
  CREATE TYPE "public"."enum_people_department" AS ENUM('leadership', 'engineering', 'mechanics', 'coaching', 'operations', 'commercial');
  CREATE TYPE "public"."enum_facilities_ownership" AS ENUM('owned', 'operated', 'partner');
  CREATE TYPE "public"."enum_facilities_substantiation_status" AS ENUM('unverified', 'evidence-supplied', 'verified', 'owner-approved');
  CREATE TYPE "public"."enum_heritage_milestones_entity" AS ENUM('karat', 'kic', 'other');
  CREATE TYPE "public"."enum_heritage_milestones_substantiation_status" AS ENUM('unverified', 'evidence-supplied', 'verified', 'owner-approved');
  CREATE TYPE "public"."enum_vacancies_discipline" AS ENUM('engineering', 'mechanical', 'operations', 'commercial', 'media', 'coaching', 'other');
  CREATE TYPE "public"."enum_vacancies_contract_type" AS ENUM('full-time', 'part-time', 'contract', 'seasonal', 'internship');
  CREATE TYPE "public"."enum_vacancies_application_mode" AS ENUM('form', 'external');
  CREATE TYPE "public"."enum_vacancies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__vacancies_v_version_discipline" AS ENUM('engineering', 'mechanical', 'operations', 'commercial', 'media', 'coaching', 'other');
  CREATE TYPE "public"."enum__vacancies_v_version_contract_type" AS ENUM('full-time', 'part-time', 'contract', 'seasonal', 'internship');
  CREATE TYPE "public"."enum__vacancies_v_version_application_mode" AS ENUM('form', 'external');
  CREATE TYPE "public"."enum__vacancies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_applications_status" AS ENUM('new', 'reviewing', 'interview', 'offer', 'rejected', 'withdrawn');
  CREATE TYPE "public"."enum_cv_uploads_scan_status" AS ENUM('not-scanned', 'clean', 'infected', 'scanner-unavailable');
  CREATE TYPE "public"."enum_enquiries_division" AS ENUM('championship-team', 'testing', 'championship-organisation');
  CREATE TYPE "public"."enum_enquiries_category" AS ENUM('race-programme', 'partnership', 'hospitality', 'media', 'testing', 'championship-organisation', 'safeguarding', 'general');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'assigned', 'contacted', 'qualified', 'proposal', 'converted', 'closed');
  CREATE TYPE "public"."enum_notifications_kind" AS ENUM('team-alert', 'acknowledgement', 'application-alert');
  CREATE TYPE "public"."enum_notifications_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_sources_kind" AS ENUM('primary', 'secondary', 'owner-statement');
  CREATE TYPE "public"."enum_redirects_status_code" AS ENUM('301', '302', '308');
  CREATE TYPE "public"."enum_consent_records_purpose" AS ENUM('analytics', 'media-embeds', 'marketing-email', 'enquiry-processing');
  CREATE TYPE "public"."enum_consent_records_choice" AS ENUM('granted', 'denied', 'withdrawn');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'raceData', 'commercial', 'media', 'recruiter');
  CREATE TYPE "public"."enum_users_divisions" AS ENUM('championship-team', 'testing', 'championship-organisation');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_site_settings_social_platform" AS ENUM('instagram', 'x', 'youtube', 'linkedin', 'tiktok', 'facebook');
  CREATE TABLE "divisions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum_divisions_key" NOT NULL,
  	"name" varchar NOT NULL,
  	"pathway_label" varchar,
  	"tagline" varchar,
  	"description" varchar,
  	"status" "enum_divisions_status" DEFAULT 'planned',
  	"enabled" boolean DEFAULT true,
  	"image_id" integer,
  	"routing_email" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "programmes_team_support" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL,
  	"detail" varchar
  );
  
  CREATE TABLE "programmes_inclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "programmes_exclusions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "programmes_official_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "programmes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar,
  	"championship_id" integer NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"status" "enum_programmes_status" DEFAULT 'intended' NOT NULL,
  	"relationship_type" "enum_programmes_relationship_type" DEFAULT 'proposed-participant',
  	"order" numeric DEFAULT 0,
  	"short_description" varchar,
  	"overview" jsonb,
  	"hero_image_id" integer,
  	"comparison_geography" varchar,
  	"comparison_development_purpose" varchar,
  	"comparison_support" varchar,
  	"driver_fit" varchar,
  	"seat_availability" "enum_programmes_seat_availability" DEFAULT 'not-published',
  	"pricing_mode" "enum_programmes_pricing_mode" DEFAULT 'discuss',
  	"pricing_amount" numeric,
  	"pricing_currency" "enum_programmes_pricing_currency",
  	"pricing_tax_basis" "enum_programmes_pricing_tax_basis",
  	"pricing_conditions" varchar,
  	"brochure_id" integer,
  	"substantiation_status" "enum_programmes_substantiation_status" DEFAULT 'unverified',
  	"substantiation_verified_at" timestamp(3) with time zone,
  	"substantiation_approved_by_id" integer,
  	"substantiation_notes" varchar,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_canonical" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "programmes_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sources_id" integer
  );
  
  CREATE TABLE "programme_seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"programme_id" integer NOT NULL,
  	"year" numeric NOT NULL,
  	"championship_season_id" integer,
  	"participation_status" "enum_programme_seasons_participation_status" DEFAULT 'intended',
  	"seat_availability" "enum_programme_seasons_seat_availability" DEFAULT 'not-published',
  	"relationship_type" varchar,
  	"notes" varchar,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "championships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"short_name" varchar,
  	"official_url" varchar,
  	"organiser" varchar,
  	"geography" varchar,
  	"level" "enum_championships_level",
  	"explainer" jsonb,
  	"substantiation_status" "enum_championships_substantiation_status" DEFAULT 'unverified',
  	"substantiation_verified_at" timestamp(3) with time zone,
  	"substantiation_approved_by_id" integer,
  	"substantiation_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "championships_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "championships_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sources_id" integer
  );
  
  CREATE TABLE "championship_seasons_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"published_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "championship_seasons_format" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"element" varchar NOT NULL,
  	"detail" varchar
  );
  
  CREATE TABLE "championship_seasons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"championship_id" integer NOT NULL,
  	"year" numeric NOT NULL,
  	"commercial_name" varchar,
  	"machinery_chassis" varchar,
  	"machinery_engine" varchar,
  	"machinery_gearbox" varchar,
  	"machinery_tyres" varchar,
  	"machinery_safety" varchar,
  	"machinery_source_id" integer,
  	"machinery_verified_at" timestamp(3) with time zone,
  	"points_system_description" varchar,
  	"points_system_points" jsonb,
  	"points_system_source_id" integer,
  	"eligibility_summary" varchar,
  	"eligibility_source_id" integer,
  	"eligibility_reviewed_at" timestamp(3) with time zone,
  	"source_verified_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "championship_seasons_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "drivers_career_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"category" varchar,
  	"team" varchar,
  	"notes" varchar,
  	"source_id" integer
  );
  
  CREATE TABLE "drivers_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"scope" varchar,
  	"source_id" integer
  );
  
  CREATE TABLE "drivers_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "drivers_driver_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar
  );
  
  CREATE TABLE "drivers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"nationality" varchar,
  	"portrait_id" integer,
  	"short_bio" varchar,
  	"bio" jsonb,
  	"is_minor" boolean DEFAULT false,
  	"safeguarding_guardian_consent_recorded" boolean,
  	"safeguarding_media_consent_recorded" boolean,
  	"safeguarding_consent_reference" varchar,
  	"announce_at" timestamp(3) with time zone,
  	"alumni" "enum_drivers_alumni" DEFAULT 'none',
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_canonical" varchar,
  	"slug" varchar,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_drivers_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_drivers_v_version_career_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" numeric,
  	"category" varchar,
  	"team" varchar,
  	"notes" varchar,
  	"source_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_drivers_v_version_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar,
  	"scope" varchar,
  	"source_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_drivers_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_drivers_v_version_driver_partners" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_drivers_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_nationality" varchar,
  	"version_portrait_id" integer,
  	"version_short_bio" varchar,
  	"version_bio" jsonb,
  	"version_is_minor" boolean DEFAULT false,
  	"version_safeguarding_guardian_consent_recorded" boolean,
  	"version_safeguarding_media_consent_recorded" boolean,
  	"version_safeguarding_consent_reference" varchar,
  	"version_announce_at" timestamp(3) with time zone,
  	"version_alumni" "enum__drivers_v_version_alumni" DEFAULT 'none',
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_canonical" varchar,
  	"version_slug" varchar,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__drivers_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "driver_engagements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"driver_id" integer,
  	"programme_id" integer,
  	"season" numeric,
  	"number" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"announce_at" timestamp(3) with time zone,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_driver_engagements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_driver_engagements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_label" varchar,
  	"version_driver_id" integer,
  	"version_programme_id" integer,
  	"version_season" numeric,
  	"version_number" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_announce_at" timestamp(3) with time zone,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__driver_engagements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "circuits_layouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"length_km" numeric,
  	"diagram_id" integer
  );
  
  CREATE TABLE "circuits" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"country" varchar NOT NULL,
  	"locality" varchar,
  	"time_zone" varchar NOT NULL,
  	"description" varchar,
  	"official_url" varchar,
  	"source_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "events" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"type" "enum_events_type" DEFAULT 'race-weekend',
  	"status" "enum_events_event_status" DEFAULT 'scheduled',
  	"programme_id" integer,
  	"championship_season_id" integer,
  	"season" numeric,
  	"round" varchar,
  	"circuit_id" integer,
  	"layout" varchar,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"time_zone" varchar,
  	"change_note" varchar,
  	"revised_at" timestamp(3) with time zone,
  	"summary" varchar,
  	"official_links_live_timing" varchar,
  	"official_links_stream" varchar,
  	"official_links_results" varchar,
  	"official_links_noticeboard" varchar,
  	"official_links_tickets" varchar,
  	"preview_id" integer,
  	"report_id" integer,
  	"gallery_id" integer,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_events_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "events_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"drivers_id" integer
  );
  
  CREATE TABLE "_events_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__events_v_version_type" DEFAULT 'race-weekend',
  	"version_status" "enum_events_event_status" DEFAULT 'scheduled',
  	"version_programme_id" integer,
  	"version_championship_season_id" integer,
  	"version_season" numeric,
  	"version_round" varchar,
  	"version_circuit_id" integer,
  	"version_layout" varchar,
  	"version_start_date" timestamp(3) with time zone,
  	"version_end_date" timestamp(3) with time zone,
  	"version_time_zone" varchar,
  	"version_change_note" varchar,
  	"version_revised_at" timestamp(3) with time zone,
  	"version_summary" varchar,
  	"version_official_links_live_timing" varchar,
  	"version_official_links_stream" varchar,
  	"version_official_links_results" varchar,
  	"version_official_links_noticeboard" varchar,
  	"version_official_links_tickets" varchar,
  	"version_preview_id" integer,
  	"version_report_id" integer,
  	"version_gallery_id" integer,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__events_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_events_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"drivers_id" integer
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_sessions_type" DEFAULT 'race',
  	"group" varchar,
  	"local_start" varchar,
  	"local_end" varchar,
  	"time_zone" varchar,
  	"starts_at" timestamp(3) with time zone,
  	"ends_at" timestamp(3) with time zone,
  	"certainty" "enum_sessions_certainty" DEFAULT 'provisional',
  	"status" "enum_sessions_status" DEFAULT 'scheduled',
  	"replay_url" varchar,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "result_sets_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" numeric,
  	"car_number" varchar,
  	"status" "enum_result_sets_entries_status" DEFAULT 'classified',
  	"driver_name" varchar,
  	"driver_id" integer,
  	"entrant" varchar,
  	"laps" numeric,
  	"time" varchar,
  	"gap" varchar,
  	"points" numeric,
  	"is_karat" boolean DEFAULT false,
  	"note" varchar
  );
  
  CREATE TABLE "result_sets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"event_id" integer,
  	"session_id" integer,
  	"season" numeric,
  	"programme_id" integer,
  	"classification" varchar DEFAULT 'overall',
  	"state" "enum_result_sets_state" DEFAULT 'provisional',
  	"verification" "enum_result_sets_verification" DEFAULT 'unverified',
  	"attribution" "enum_result_sets_attribution" DEFAULT 'karat',
  	"source_url" varchar,
  	"source_document_id" integer,
  	"source_published_at" timestamp(3) with time zone,
  	"source_record_id" integer,
  	"penalty_notes" varchar,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_result_sets_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_result_sets_v_version_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"position" numeric,
  	"car_number" varchar,
  	"status" "enum__result_sets_v_version_entries_status" DEFAULT 'classified',
  	"driver_name" varchar,
  	"driver_id" integer,
  	"entrant" varchar,
  	"laps" numeric,
  	"time" varchar,
  	"gap" varchar,
  	"points" numeric,
  	"is_karat" boolean DEFAULT false,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_result_sets_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_label" varchar,
  	"version_event_id" integer,
  	"version_session_id" integer,
  	"version_season" numeric,
  	"version_programme_id" integer,
  	"version_classification" varchar DEFAULT 'overall',
  	"version_state" "enum__result_sets_v_version_state" DEFAULT 'provisional',
  	"version_verification" "enum__result_sets_v_version_verification" DEFAULT 'unverified',
  	"version_attribution" "enum__result_sets_v_version_attribution" DEFAULT 'karat',
  	"version_source_url" varchar,
  	"version_source_document_id" integer,
  	"version_source_published_at" timestamp(3) with time zone,
  	"version_source_record_id" integer,
  	"version_penalty_notes" varchar,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__result_sets_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "standings_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"position" numeric,
  	"name" varchar,
  	"driver_id" integer,
  	"points" numeric,
  	"is_karat" boolean
  );
  
  CREATE TABLE "standings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"programme_id" integer,
  	"season" numeric,
  	"type" "enum_standings_type" DEFAULT 'driver',
  	"classification" varchar DEFAULT 'overall',
  	"after_event_id" integer,
  	"state" "enum_standings_state" DEFAULT 'provisional',
  	"verification" "enum_standings_verification" DEFAULT 'unverified',
  	"attribution" "enum_standings_attribution" DEFAULT 'karat',
  	"source_url" varchar,
  	"source_published_at" timestamp(3) with time zone,
  	"source_record_id" integer,
  	"calculated" boolean DEFAULT false,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_standings_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_standings_v_version_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"position" numeric,
  	"name" varchar,
  	"driver_id" integer,
  	"points" numeric,
  	"is_karat" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_standings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_label" varchar,
  	"version_programme_id" integer,
  	"version_season" numeric,
  	"version_type" "enum__standings_v_version_type" DEFAULT 'driver',
  	"version_classification" varchar DEFAULT 'overall',
  	"version_after_event_id" integer,
  	"version_state" "enum__standings_v_version_state" DEFAULT 'provisional',
  	"version_verification" "enum__standings_v_version_verification" DEFAULT 'unverified',
  	"version_attribution" "enum__standings_v_version_attribution" DEFAULT 'karat',
  	"version_source_url" varchar,
  	"version_source_published_at" timestamp(3) with time zone,
  	"version_source_record_id" integer,
  	"version_calculated" boolean DEFAULT false,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__standings_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "live_updates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"event_id" integer NOT NULL,
  	"posted_at" timestamp(3) with time zone NOT NULL,
  	"text" varchar NOT NULL,
  	"author" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "articles_corrections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"note" varchar
  );
  
  CREATE TABLE "articles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"type" "enum_articles_type" DEFAULT 'team-update',
  	"author" varchar,
  	"standfirst" varchar,
  	"hero_image_id" integer,
  	"body" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"editorial_status" "enum_articles_editorial_status" DEFAULT 'draft',
  	"season" numeric,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_image_id" integer,
  	"seo_noindex" boolean DEFAULT false,
  	"seo_canonical" varchar,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_articles_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "articles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"programmes_id" integer,
  	"drivers_id" integer,
  	"events_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "_articles_v_version_corrections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_articles_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_type" "enum__articles_v_version_type" DEFAULT 'team-update',
  	"version_author" varchar,
  	"version_standfirst" varchar,
  	"version_hero_image_id" integer,
  	"version_body" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_editorial_status" "enum__articles_v_version_editorial_status" DEFAULT 'draft',
  	"version_season" numeric,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_image_id" integer,
  	"version_seo_noindex" boolean DEFAULT false,
  	"version_seo_canonical" varchar,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__articles_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_articles_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"programmes_id" integer,
  	"drivers_id" integer,
  	"events_id" integer,
  	"partners_id" integer
  );
  
  CREATE TABLE "faqs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL,
  	"category" "enum_faqs_category" NOT NULL,
  	"order" numeric DEFAULT 0,
  	"published" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "faqs_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"programmes_id" integer
  );
  
  CREATE TABLE "media_collections_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"provider" "enum_media_collections_videos_provider" DEFAULT 'youtube',
  	"captions_available" boolean
  );
  
  CREATE TABLE "media_collections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"season" numeric,
  	"programme_id" integer,
  	"event_id" integer,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_media_collections_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "media_collections_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"drivers_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "_media_collections_v_version_videos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"url" varchar,
  	"provider" "enum__media_collections_v_version_videos_provider" DEFAULT 'youtube',
  	"captions_available" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_media_collections_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_season" numeric,
  	"version_programme_id" integer,
  	"version_event_id" integer,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__media_collections_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_media_collections_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"drivers_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"copyright_owner" varchar,
  	"public_use_approved" boolean DEFAULT false,
  	"usage_scope" "enum_media_usage_scope" DEFAULT 'web',
  	"rights_expires_at" timestamp(3) with time zone,
  	"download_permitted" boolean DEFAULT false,
  	"restrictions" varchar,
  	"contains_minors" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "partners" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"logo_id" integer,
  	"description" varchar,
  	"website" varchar,
  	"publication_approved" boolean DEFAULT false,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partnerships" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"partner_id" integer NOT NULL,
  	"tier" "enum_partnerships_tier" DEFAULT 'official' NOT NULL,
  	"scope" "enum_partnerships_scope" DEFAULT 'team',
  	"programme_id" integer,
  	"driver_id" integer,
  	"season" numeric,
  	"start_date" timestamp(3) with time zone,
  	"end_date" timestamp(3) with time zone,
  	"publication_approved" boolean DEFAULT false,
  	"rights_notes" varchar,
  	"display_order" numeric DEFAULT 0,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"department" "enum_people_department" DEFAULT 'leadership',
  	"bio" varchar,
  	"portrait_id" integer,
  	"order" numeric DEFAULT 0,
  	"approved_for_publication" boolean DEFAULT false,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"location" varchar,
  	"ownership" "enum_facilities_ownership" NOT NULL,
  	"partner_name" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"approved_for_publication" boolean DEFAULT false,
  	"substantiation_status" "enum_facilities_substantiation_status" DEFAULT 'unverified',
  	"substantiation_verified_at" timestamp(3) with time zone,
  	"substantiation_approved_by_id" integer,
  	"substantiation_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "facilities_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "facilities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sources_id" integer
  );
  
  CREATE TABLE "heritage_milestones" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"date" timestamp(3) with time zone,
  	"season" varchar,
  	"entity" "enum_heritage_milestones_entity" NOT NULL,
  	"entity_name" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"approved_for_publication" boolean DEFAULT false,
  	"substantiation_status" "enum_heritage_milestones_substantiation_status" DEFAULT 'unverified',
  	"substantiation_verified_at" timestamp(3) with time zone,
  	"substantiation_approved_by_id" integer,
  	"substantiation_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "heritage_milestones_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sources_id" integer
  );
  
  CREATE TABLE "vacancies_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "vacancies_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar
  );
  
  CREATE TABLE "vacancies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"discipline" "enum_vacancies_discipline",
  	"location" varchar,
  	"contract_type" "enum_vacancies_contract_type",
  	"summary" varchar,
  	"closing_date" timestamp(3) with time zone,
  	"application_mode" "enum_vacancies_application_mode" DEFAULT 'form',
  	"external_url" varchar,
  	"internship_eligibility" varchar,
  	"closed" boolean DEFAULT false,
  	"is_demo" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_vacancies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_vacancies_v_version_responsibilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vacancies_v_version_requirements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"item" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_vacancies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_discipline" "enum__vacancies_v_version_discipline",
  	"version_location" varchar,
  	"version_contract_type" "enum__vacancies_v_version_contract_type",
  	"version_summary" varchar,
  	"version_closing_date" timestamp(3) with time zone,
  	"version_application_mode" "enum__vacancies_v_version_application_mode" DEFAULT 'form',
  	"version_external_url" varchar,
  	"version_internship_eligibility" varchar,
  	"version_closed" boolean DEFAULT false,
  	"version_is_demo" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__vacancies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "applications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"vacancy_id" integer,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country" varchar,
  	"cover_note" varchar,
  	"profile_link" varchar,
  	"cv_id" integer,
  	"status" "enum_applications_status" DEFAULT 'new',
  	"retention_until" timestamp(3) with time zone,
  	"idempotency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cv_uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"scan_status" "enum_cv_uploads_scan_status" DEFAULT 'not-scanned',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "enquiries_internal_notes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"at" timestamp(3) with time zone,
  	"note" varchar NOT NULL
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar NOT NULL,
  	"division" "enum_enquiries_division" NOT NULL,
  	"category" "enum_enquiries_category" NOT NULL,
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"assigned_to_id" integer,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country" varchar,
  	"organisation" varchar,
  	"role" varchar,
  	"programme" varchar,
  	"season" varchar,
  	"age_band" varchar,
  	"involves_minor" boolean DEFAULT false,
  	"message" varchar,
  	"details" jsonb,
  	"source_page" varchar,
  	"campaign" varchar,
  	"marketing_opt_in" boolean DEFAULT false,
  	"privacy_notice_version" varchar,
  	"retention_until" timestamp(3) with time zone,
  	"idempotency_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enquiry_id" integer,
  	"kind" "enum_notifications_kind",
  	"to" varchar NOT NULL,
  	"reply_to" varchar,
  	"subject" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"status" "enum_notifications_status" DEFAULT 'pending',
  	"attempts" numeric DEFAULT 0,
  	"next_attempt_at" timestamp(3) with time zone,
  	"sent_at" timestamp(3) with time zone,
  	"last_error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sources" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar,
  	"document_id" integer,
  	"publisher" varchar,
  	"accessed_at" timestamp(3) with time zone,
  	"verified_at" timestamp(3) with time zone,
  	"approver_id" integer,
  	"kind" "enum_sources_kind" DEFAULT 'primary',
  	"notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"status_code" "enum_redirects_status_code" DEFAULT '301',
  	"automatic" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "consent_records" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"subject" varchar,
  	"purpose" "enum_consent_records_purpose" NOT NULL,
  	"choice" "enum_consent_records_choice" NOT NULL,
  	"policy_version" varchar,
  	"withdrawn_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "audit_logs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"action" varchar,
  	"collection_slug" varchar,
  	"document_id" varchar,
  	"user_id" integer,
  	"user_email" varchar,
  	"summary" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_divisions" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_divisions",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"divisions_id" integer,
  	"programmes_id" integer,
  	"programme_seasons_id" integer,
  	"championships_id" integer,
  	"championship_seasons_id" integer,
  	"drivers_id" integer,
  	"driver_engagements_id" integer,
  	"circuits_id" integer,
  	"events_id" integer,
  	"sessions_id" integer,
  	"result_sets_id" integer,
  	"standings_id" integer,
  	"live_updates_id" integer,
  	"articles_id" integer,
  	"faqs_id" integer,
  	"media_collections_id" integer,
  	"media_id" integer,
  	"partners_id" integer,
  	"partnerships_id" integer,
  	"people_id" integer,
  	"facilities_id" integer,
  	"heritage_milestones_id" integer,
  	"vacancies_id" integer,
  	"applications_id" integer,
  	"cv_uploads_id" integer,
  	"enquiries_id" integer,
  	"notifications_id" integer,
  	"sources_id" integer,
  	"redirects_id" integer,
  	"consent_records_id" integer,
  	"audit_logs_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_platform",
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_name" varchar DEFAULT 'Karat Racing',
  	"legal_entity_name" varchar,
  	"registered_address" varchar,
  	"public_email" varchar,
  	"public_phone" varchar,
  	"privacy_notice_version" varchar DEFAULT '0.1-draft',
  	"routing_race_programs" varchar,
  	"routing_partnerships" varchar,
  	"routing_hospitality" varchar,
  	"routing_media" varchar,
  	"routing_careers" varchar,
  	"routing_testing" varchar,
  	"routing_organisation" varchar,
  	"routing_safeguarding" varchar,
  	"routing_general" varchar,
  	"response_time_statement" varchar,
  	"safeguarding_lead" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "feature_flags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"newsletter" boolean DEFAULT false,
  	"viewer_local_time" boolean DEFAULT true,
  	"calendar_feed" boolean DEFAULT true,
  	"rss" boolean DEFAULT true,
  	"live_text" boolean DEFAULT false,
  	"hospitality_enquiries" boolean DEFAULT true,
  	"cv_upload" boolean DEFAULT true,
  	"speculative_applications" boolean DEFAULT false,
  	"whatsapp" boolean DEFAULT false,
  	"whatsapp_number" varchar,
  	"driver_portal" boolean DEFAULT false,
  	"partner_portal" boolean DEFAULT false,
  	"shop" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "team_content_working_methods" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "team_content_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "team_content_audience_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"period" varchar NOT NULL,
  	"scope" varchar NOT NULL,
  	"source_id" integer NOT NULL
  );
  
  CREATE TABLE "team_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"story" jsonb,
  	"story_approved" boolean,
  	"values_approved" boolean,
  	"acquisition_statement" jsonb,
  	"acquisition_approved" boolean DEFAULT false,
  	"acquisition_approved_by_id" integer,
  	"heritage_rights_note" varchar,
  	"simulator_statement" varchar,
  	"coaching_statement" varchar,
  	"human_performance_statement" varchar,
  	"commercial_deck_id" integer,
  	"commercial_deck_version" varchar,
  	"team_profile_pdf_id" integer,
  	"team_profile_version" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "divisions" ADD CONSTRAINT "divisions_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programmes_team_support" ADD CONSTRAINT "programmes_team_support_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programmes_inclusions" ADD CONSTRAINT "programmes_inclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programmes_exclusions" ADD CONSTRAINT "programmes_exclusions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programmes_official_links" ADD CONSTRAINT "programmes_official_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programmes" ADD CONSTRAINT "programmes_championship_id_championships_id_fk" FOREIGN KEY ("championship_id") REFERENCES "public"."championships"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programmes" ADD CONSTRAINT "programmes_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programmes" ADD CONSTRAINT "programmes_brochure_id_media_id_fk" FOREIGN KEY ("brochure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programmes" ADD CONSTRAINT "programmes_substantiation_approved_by_id_users_id_fk" FOREIGN KEY ("substantiation_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programmes" ADD CONSTRAINT "programmes_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programmes_rels" ADD CONSTRAINT "programmes_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programmes_rels" ADD CONSTRAINT "programmes_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "programme_seasons" ADD CONSTRAINT "programme_seasons_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "programme_seasons" ADD CONSTRAINT "programme_seasons_championship_season_id_championship_seasons_id_fk" FOREIGN KEY ("championship_season_id") REFERENCES "public"."championship_seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "championships" ADD CONSTRAINT "championships_substantiation_approved_by_id_users_id_fk" FOREIGN KEY ("substantiation_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "championships_texts" ADD CONSTRAINT "championships_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."championships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "championships_rels" ADD CONSTRAINT "championships_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."championships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "championships_rels" ADD CONSTRAINT "championships_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "championship_seasons_documents" ADD CONSTRAINT "championship_seasons_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."championship_seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "championship_seasons_format" ADD CONSTRAINT "championship_seasons_format_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."championship_seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "championship_seasons" ADD CONSTRAINT "championship_seasons_championship_id_championships_id_fk" FOREIGN KEY ("championship_id") REFERENCES "public"."championships"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "championship_seasons" ADD CONSTRAINT "championship_seasons_machinery_source_id_sources_id_fk" FOREIGN KEY ("machinery_source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "championship_seasons" ADD CONSTRAINT "championship_seasons_points_system_source_id_sources_id_fk" FOREIGN KEY ("points_system_source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "championship_seasons" ADD CONSTRAINT "championship_seasons_eligibility_source_id_sources_id_fk" FOREIGN KEY ("eligibility_source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "championship_seasons_texts" ADD CONSTRAINT "championship_seasons_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."championship_seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drivers_career_timeline" ADD CONSTRAINT "drivers_career_timeline_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "drivers_career_timeline" ADD CONSTRAINT "drivers_career_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drivers_stats" ADD CONSTRAINT "drivers_stats_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "drivers_stats" ADD CONSTRAINT "drivers_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drivers_social_links" ADD CONSTRAINT "drivers_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drivers_driver_partners" ADD CONSTRAINT "drivers_driver_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "drivers" ADD CONSTRAINT "drivers_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "drivers" ADD CONSTRAINT "drivers_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_drivers_v_version_career_timeline" ADD CONSTRAINT "_drivers_v_version_career_timeline_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_drivers_v_version_career_timeline" ADD CONSTRAINT "_drivers_v_version_career_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_drivers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_drivers_v_version_stats" ADD CONSTRAINT "_drivers_v_version_stats_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_drivers_v_version_stats" ADD CONSTRAINT "_drivers_v_version_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_drivers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_drivers_v_version_social_links" ADD CONSTRAINT "_drivers_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_drivers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_drivers_v_version_driver_partners" ADD CONSTRAINT "_drivers_v_version_driver_partners_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_drivers_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_drivers_v" ADD CONSTRAINT "_drivers_v_parent_id_drivers_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_drivers_v" ADD CONSTRAINT "_drivers_v_version_portrait_id_media_id_fk" FOREIGN KEY ("version_portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_drivers_v" ADD CONSTRAINT "_drivers_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "driver_engagements" ADD CONSTRAINT "driver_engagements_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "driver_engagements" ADD CONSTRAINT "driver_engagements_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_driver_engagements_v" ADD CONSTRAINT "_driver_engagements_v_parent_id_driver_engagements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."driver_engagements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_driver_engagements_v" ADD CONSTRAINT "_driver_engagements_v_version_driver_id_drivers_id_fk" FOREIGN KEY ("version_driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_driver_engagements_v" ADD CONSTRAINT "_driver_engagements_v_version_programme_id_programmes_id_fk" FOREIGN KEY ("version_programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "circuits_layouts" ADD CONSTRAINT "circuits_layouts_diagram_id_media_id_fk" FOREIGN KEY ("diagram_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "circuits_layouts" ADD CONSTRAINT "circuits_layouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."circuits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "circuits" ADD CONSTRAINT "circuits_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_championship_season_id_championship_seasons_id_fk" FOREIGN KEY ("championship_season_id") REFERENCES "public"."championship_seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_circuit_id_circuits_id_fk" FOREIGN KEY ("circuit_id") REFERENCES "public"."circuits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_preview_id_articles_id_fk" FOREIGN KEY ("preview_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_report_id_articles_id_fk" FOREIGN KEY ("report_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events" ADD CONSTRAINT "events_gallery_id_media_collections_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."media_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "events_rels" ADD CONSTRAINT "events_rels_drivers_fk" FOREIGN KEY ("drivers_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_parent_id_events_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_programme_id_programmes_id_fk" FOREIGN KEY ("version_programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_championship_season_id_championship_seasons_id_fk" FOREIGN KEY ("version_championship_season_id") REFERENCES "public"."championship_seasons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_circuit_id_circuits_id_fk" FOREIGN KEY ("version_circuit_id") REFERENCES "public"."circuits"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_preview_id_articles_id_fk" FOREIGN KEY ("version_preview_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_report_id_articles_id_fk" FOREIGN KEY ("version_report_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v" ADD CONSTRAINT "_events_v_version_gallery_id_media_collections_id_fk" FOREIGN KEY ("version_gallery_id") REFERENCES "public"."media_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_events_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_events_v_rels" ADD CONSTRAINT "_events_v_rels_drivers_fk" FOREIGN KEY ("drivers_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "result_sets_entries" ADD CONSTRAINT "result_sets_entries_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "result_sets_entries" ADD CONSTRAINT "result_sets_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."result_sets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "result_sets" ADD CONSTRAINT "result_sets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "result_sets" ADD CONSTRAINT "result_sets_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "result_sets" ADD CONSTRAINT "result_sets_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "result_sets" ADD CONSTRAINT "result_sets_source_document_id_media_id_fk" FOREIGN KEY ("source_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "result_sets" ADD CONSTRAINT "result_sets_source_record_id_sources_id_fk" FOREIGN KEY ("source_record_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_result_sets_v_version_entries" ADD CONSTRAINT "_result_sets_v_version_entries_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_result_sets_v_version_entries" ADD CONSTRAINT "_result_sets_v_version_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_result_sets_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_result_sets_v" ADD CONSTRAINT "_result_sets_v_parent_id_result_sets_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."result_sets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_result_sets_v" ADD CONSTRAINT "_result_sets_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_result_sets_v" ADD CONSTRAINT "_result_sets_v_version_session_id_sessions_id_fk" FOREIGN KEY ("version_session_id") REFERENCES "public"."sessions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_result_sets_v" ADD CONSTRAINT "_result_sets_v_version_programme_id_programmes_id_fk" FOREIGN KEY ("version_programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_result_sets_v" ADD CONSTRAINT "_result_sets_v_version_source_document_id_media_id_fk" FOREIGN KEY ("version_source_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_result_sets_v" ADD CONSTRAINT "_result_sets_v_version_source_record_id_sources_id_fk" FOREIGN KEY ("version_source_record_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "standings_entries" ADD CONSTRAINT "standings_entries_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "standings_entries" ADD CONSTRAINT "standings_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."standings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "standings" ADD CONSTRAINT "standings_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "standings" ADD CONSTRAINT "standings_after_event_id_events_id_fk" FOREIGN KEY ("after_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "standings" ADD CONSTRAINT "standings_source_record_id_sources_id_fk" FOREIGN KEY ("source_record_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_standings_v_version_entries" ADD CONSTRAINT "_standings_v_version_entries_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_standings_v_version_entries" ADD CONSTRAINT "_standings_v_version_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_standings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_standings_v" ADD CONSTRAINT "_standings_v_parent_id_standings_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."standings"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_standings_v" ADD CONSTRAINT "_standings_v_version_programme_id_programmes_id_fk" FOREIGN KEY ("version_programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_standings_v" ADD CONSTRAINT "_standings_v_version_after_event_id_events_id_fk" FOREIGN KEY ("version_after_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_standings_v" ADD CONSTRAINT "_standings_v_version_source_record_id_sources_id_fk" FOREIGN KEY ("version_source_record_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "live_updates" ADD CONSTRAINT "live_updates_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_corrections" ADD CONSTRAINT "articles_corrections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles" ADD CONSTRAINT "articles_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_drivers_fk" FOREIGN KEY ("drivers_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "articles_rels" ADD CONSTRAINT "articles_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_version_corrections" ADD CONSTRAINT "_articles_v_version_corrections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_parent_id_articles_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."articles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v" ADD CONSTRAINT "_articles_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_articles_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_drivers_fk" FOREIGN KEY ("drivers_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_articles_v_rels" ADD CONSTRAINT "_articles_v_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "faqs_rels" ADD CONSTRAINT "faqs_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_collections_videos" ADD CONSTRAINT "media_collections_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_collections" ADD CONSTRAINT "media_collections_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_collections" ADD CONSTRAINT "media_collections_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_collections_rels" ADD CONSTRAINT "media_collections_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_collections_rels" ADD CONSTRAINT "media_collections_rels_drivers_fk" FOREIGN KEY ("drivers_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_collections_rels" ADD CONSTRAINT "media_collections_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_collections_v_version_videos" ADD CONSTRAINT "_media_collections_v_version_videos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_media_collections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_collections_v" ADD CONSTRAINT "_media_collections_v_parent_id_media_collections_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media_collections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_collections_v" ADD CONSTRAINT "_media_collections_v_version_programme_id_programmes_id_fk" FOREIGN KEY ("version_programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_collections_v" ADD CONSTRAINT "_media_collections_v_version_event_id_events_id_fk" FOREIGN KEY ("version_event_id") REFERENCES "public"."events"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_media_collections_v_rels" ADD CONSTRAINT "_media_collections_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_media_collections_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_collections_v_rels" ADD CONSTRAINT "_media_collections_v_rels_drivers_fk" FOREIGN KEY ("drivers_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_media_collections_v_rels" ADD CONSTRAINT "_media_collections_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_texts" ADD CONSTRAINT "media_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "partners" ADD CONSTRAINT "partners_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_partner_id_partners_id_fk" FOREIGN KEY ("partner_id") REFERENCES "public"."partners"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_programme_id_programmes_id_fk" FOREIGN KEY ("programme_id") REFERENCES "public"."programmes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partnerships" ADD CONSTRAINT "partnerships_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people_links" ADD CONSTRAINT "people_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_portrait_id_media_id_fk" FOREIGN KEY ("portrait_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities" ADD CONSTRAINT "facilities_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities" ADD CONSTRAINT "facilities_substantiation_approved_by_id_users_id_fk" FOREIGN KEY ("substantiation_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "facilities_texts" ADD CONSTRAINT "facilities_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "facilities_rels" ADD CONSTRAINT "facilities_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_milestones" ADD CONSTRAINT "heritage_milestones_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heritage_milestones" ADD CONSTRAINT "heritage_milestones_substantiation_approved_by_id_users_id_fk" FOREIGN KEY ("substantiation_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "heritage_milestones_rels" ADD CONSTRAINT "heritage_milestones_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."heritage_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "heritage_milestones_rels" ADD CONSTRAINT "heritage_milestones_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_responsibilities" ADD CONSTRAINT "vacancies_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vacancies_requirements" ADD CONSTRAINT "vacancies_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vacancies_v_version_responsibilities" ADD CONSTRAINT "_vacancies_v_version_responsibilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vacancies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vacancies_v_version_requirements" ADD CONSTRAINT "_vacancies_v_version_requirements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_vacancies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vacancies_v" ADD CONSTRAINT "_vacancies_v_parent_id_vacancies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vacancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_vacancy_id_vacancies_id_fk" FOREIGN KEY ("vacancy_id") REFERENCES "public"."vacancies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "applications" ADD CONSTRAINT "applications_cv_id_cv_uploads_id_fk" FOREIGN KEY ("cv_id") REFERENCES "public"."cv_uploads"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries_internal_notes" ADD CONSTRAINT "enquiries_internal_notes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sources" ADD CONSTRAINT "sources_document_id_media_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sources" ADD CONSTRAINT "sources_approver_id_users_id_fk" FOREIGN KEY ("approver_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_divisions" ADD CONSTRAINT "users_divisions_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_divisions_fk" FOREIGN KEY ("divisions_id") REFERENCES "public"."divisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programmes_fk" FOREIGN KEY ("programmes_id") REFERENCES "public"."programmes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_programme_seasons_fk" FOREIGN KEY ("programme_seasons_id") REFERENCES "public"."programme_seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_championships_fk" FOREIGN KEY ("championships_id") REFERENCES "public"."championships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_championship_seasons_fk" FOREIGN KEY ("championship_seasons_id") REFERENCES "public"."championship_seasons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_drivers_fk" FOREIGN KEY ("drivers_id") REFERENCES "public"."drivers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_driver_engagements_fk" FOREIGN KEY ("driver_engagements_id") REFERENCES "public"."driver_engagements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_circuits_fk" FOREIGN KEY ("circuits_id") REFERENCES "public"."circuits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_events_fk" FOREIGN KEY ("events_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_result_sets_fk" FOREIGN KEY ("result_sets_id") REFERENCES "public"."result_sets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_standings_fk" FOREIGN KEY ("standings_id") REFERENCES "public"."standings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_live_updates_fk" FOREIGN KEY ("live_updates_id") REFERENCES "public"."live_updates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_articles_fk" FOREIGN KEY ("articles_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_faqs_fk" FOREIGN KEY ("faqs_id") REFERENCES "public"."faqs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_collections_fk" FOREIGN KEY ("media_collections_id") REFERENCES "public"."media_collections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partners_fk" FOREIGN KEY ("partners_id") REFERENCES "public"."partners"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partnerships_fk" FOREIGN KEY ("partnerships_id") REFERENCES "public"."partnerships"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_facilities_fk" FOREIGN KEY ("facilities_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_heritage_milestones_fk" FOREIGN KEY ("heritage_milestones_id") REFERENCES "public"."heritage_milestones"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vacancies_fk" FOREIGN KEY ("vacancies_id") REFERENCES "public"."vacancies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_applications_fk" FOREIGN KEY ("applications_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cv_uploads_fk" FOREIGN KEY ("cv_uploads_id") REFERENCES "public"."cv_uploads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sources_fk" FOREIGN KEY ("sources_id") REFERENCES "public"."sources"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_consent_records_fk" FOREIGN KEY ("consent_records_id") REFERENCES "public"."consent_records"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_audit_logs_fk" FOREIGN KEY ("audit_logs_id") REFERENCES "public"."audit_logs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_content_working_methods" ADD CONSTRAINT "team_content_working_methods_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_content_values" ADD CONSTRAINT "team_content_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_content_audience_metrics" ADD CONSTRAINT "team_content_audience_metrics_source_id_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."sources"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_content_audience_metrics" ADD CONSTRAINT "team_content_audience_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."team_content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "team_content" ADD CONSTRAINT "team_content_acquisition_approved_by_id_users_id_fk" FOREIGN KEY ("acquisition_approved_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_content" ADD CONSTRAINT "team_content_commercial_deck_id_media_id_fk" FOREIGN KEY ("commercial_deck_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "team_content" ADD CONSTRAINT "team_content_team_profile_pdf_id_media_id_fk" FOREIGN KEY ("team_profile_pdf_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "divisions_key_idx" ON "divisions" USING btree ("key");
  CREATE INDEX "divisions_image_idx" ON "divisions" USING btree ("image_id");
  CREATE INDEX "divisions_updated_at_idx" ON "divisions" USING btree ("updated_at");
  CREATE INDEX "divisions_created_at_idx" ON "divisions" USING btree ("created_at");
  CREATE INDEX "programmes_team_support_order_idx" ON "programmes_team_support" USING btree ("_order");
  CREATE INDEX "programmes_team_support_parent_id_idx" ON "programmes_team_support" USING btree ("_parent_id");
  CREATE INDEX "programmes_inclusions_order_idx" ON "programmes_inclusions" USING btree ("_order");
  CREATE INDEX "programmes_inclusions_parent_id_idx" ON "programmes_inclusions" USING btree ("_parent_id");
  CREATE INDEX "programmes_exclusions_order_idx" ON "programmes_exclusions" USING btree ("_order");
  CREATE INDEX "programmes_exclusions_parent_id_idx" ON "programmes_exclusions" USING btree ("_parent_id");
  CREATE INDEX "programmes_official_links_order_idx" ON "programmes_official_links" USING btree ("_order");
  CREATE INDEX "programmes_official_links_parent_id_idx" ON "programmes_official_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "programmes_slug_idx" ON "programmes" USING btree ("slug");
  CREATE INDEX "programmes_championship_idx" ON "programmes" USING btree ("championship_id");
  CREATE INDEX "programmes_hero_image_idx" ON "programmes" USING btree ("hero_image_id");
  CREATE INDEX "programmes_brochure_idx" ON "programmes" USING btree ("brochure_id");
  CREATE INDEX "programmes_substantiation_substantiation_approved_by_idx" ON "programmes" USING btree ("substantiation_approved_by_id");
  CREATE INDEX "programmes_seo_seo_image_idx" ON "programmes" USING btree ("seo_image_id");
  CREATE INDEX "programmes_updated_at_idx" ON "programmes" USING btree ("updated_at");
  CREATE INDEX "programmes_created_at_idx" ON "programmes" USING btree ("created_at");
  CREATE INDEX "programmes_rels_order_idx" ON "programmes_rels" USING btree ("order");
  CREATE INDEX "programmes_rels_parent_idx" ON "programmes_rels" USING btree ("parent_id");
  CREATE INDEX "programmes_rels_path_idx" ON "programmes_rels" USING btree ("path");
  CREATE INDEX "programmes_rels_sources_id_idx" ON "programmes_rels" USING btree ("sources_id");
  CREATE INDEX "programme_seasons_programme_idx" ON "programme_seasons" USING btree ("programme_id");
  CREATE INDEX "programme_seasons_championship_season_idx" ON "programme_seasons" USING btree ("championship_season_id");
  CREATE INDEX "programme_seasons_is_demo_idx" ON "programme_seasons" USING btree ("is_demo");
  CREATE INDEX "programme_seasons_updated_at_idx" ON "programme_seasons" USING btree ("updated_at");
  CREATE INDEX "programme_seasons_created_at_idx" ON "programme_seasons" USING btree ("created_at");
  CREATE UNIQUE INDEX "programme_year_idx" ON "programme_seasons" USING btree ("programme_id","year");
  CREATE UNIQUE INDEX "championships_slug_idx" ON "championships" USING btree ("slug");
  CREATE INDEX "championships_substantiation_substantiation_approved_by_idx" ON "championships" USING btree ("substantiation_approved_by_id");
  CREATE INDEX "championships_updated_at_idx" ON "championships" USING btree ("updated_at");
  CREATE INDEX "championships_created_at_idx" ON "championships" USING btree ("created_at");
  CREATE INDEX "championships_texts_order_parent" ON "championships_texts" USING btree ("order","parent_id");
  CREATE INDEX "championships_rels_order_idx" ON "championships_rels" USING btree ("order");
  CREATE INDEX "championships_rels_parent_idx" ON "championships_rels" USING btree ("parent_id");
  CREATE INDEX "championships_rels_path_idx" ON "championships_rels" USING btree ("path");
  CREATE INDEX "championships_rels_sources_id_idx" ON "championships_rels" USING btree ("sources_id");
  CREATE INDEX "championship_seasons_documents_order_idx" ON "championship_seasons_documents" USING btree ("_order");
  CREATE INDEX "championship_seasons_documents_parent_id_idx" ON "championship_seasons_documents" USING btree ("_parent_id");
  CREATE INDEX "championship_seasons_format_order_idx" ON "championship_seasons_format" USING btree ("_order");
  CREATE INDEX "championship_seasons_format_parent_id_idx" ON "championship_seasons_format" USING btree ("_parent_id");
  CREATE INDEX "championship_seasons_championship_idx" ON "championship_seasons" USING btree ("championship_id");
  CREATE INDEX "championship_seasons_machinery_machinery_source_idx" ON "championship_seasons" USING btree ("machinery_source_id");
  CREATE INDEX "championship_seasons_points_system_points_system_source_idx" ON "championship_seasons" USING btree ("points_system_source_id");
  CREATE INDEX "championship_seasons_eligibility_eligibility_source_idx" ON "championship_seasons" USING btree ("eligibility_source_id");
  CREATE INDEX "championship_seasons_updated_at_idx" ON "championship_seasons" USING btree ("updated_at");
  CREATE INDEX "championship_seasons_created_at_idx" ON "championship_seasons" USING btree ("created_at");
  CREATE INDEX "championship_seasons_texts_order_parent" ON "championship_seasons_texts" USING btree ("order","parent_id");
  CREATE INDEX "drivers_career_timeline_order_idx" ON "drivers_career_timeline" USING btree ("_order");
  CREATE INDEX "drivers_career_timeline_parent_id_idx" ON "drivers_career_timeline" USING btree ("_parent_id");
  CREATE INDEX "drivers_career_timeline_source_idx" ON "drivers_career_timeline" USING btree ("source_id");
  CREATE INDEX "drivers_stats_order_idx" ON "drivers_stats" USING btree ("_order");
  CREATE INDEX "drivers_stats_parent_id_idx" ON "drivers_stats" USING btree ("_parent_id");
  CREATE INDEX "drivers_stats_source_idx" ON "drivers_stats" USING btree ("source_id");
  CREATE INDEX "drivers_social_links_order_idx" ON "drivers_social_links" USING btree ("_order");
  CREATE INDEX "drivers_social_links_parent_id_idx" ON "drivers_social_links" USING btree ("_parent_id");
  CREATE INDEX "drivers_driver_partners_order_idx" ON "drivers_driver_partners" USING btree ("_order");
  CREATE INDEX "drivers_driver_partners_parent_id_idx" ON "drivers_driver_partners" USING btree ("_parent_id");
  CREATE INDEX "drivers_portrait_idx" ON "drivers" USING btree ("portrait_id");
  CREATE INDEX "drivers_seo_seo_image_idx" ON "drivers" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "drivers_slug_idx" ON "drivers" USING btree ("slug");
  CREATE INDEX "drivers_is_demo_idx" ON "drivers" USING btree ("is_demo");
  CREATE INDEX "drivers_updated_at_idx" ON "drivers" USING btree ("updated_at");
  CREATE INDEX "drivers_created_at_idx" ON "drivers" USING btree ("created_at");
  CREATE INDEX "drivers__status_idx" ON "drivers" USING btree ("_status");
  CREATE INDEX "_drivers_v_version_career_timeline_order_idx" ON "_drivers_v_version_career_timeline" USING btree ("_order");
  CREATE INDEX "_drivers_v_version_career_timeline_parent_id_idx" ON "_drivers_v_version_career_timeline" USING btree ("_parent_id");
  CREATE INDEX "_drivers_v_version_career_timeline_source_idx" ON "_drivers_v_version_career_timeline" USING btree ("source_id");
  CREATE INDEX "_drivers_v_version_stats_order_idx" ON "_drivers_v_version_stats" USING btree ("_order");
  CREATE INDEX "_drivers_v_version_stats_parent_id_idx" ON "_drivers_v_version_stats" USING btree ("_parent_id");
  CREATE INDEX "_drivers_v_version_stats_source_idx" ON "_drivers_v_version_stats" USING btree ("source_id");
  CREATE INDEX "_drivers_v_version_social_links_order_idx" ON "_drivers_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_drivers_v_version_social_links_parent_id_idx" ON "_drivers_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_drivers_v_version_driver_partners_order_idx" ON "_drivers_v_version_driver_partners" USING btree ("_order");
  CREATE INDEX "_drivers_v_version_driver_partners_parent_id_idx" ON "_drivers_v_version_driver_partners" USING btree ("_parent_id");
  CREATE INDEX "_drivers_v_parent_idx" ON "_drivers_v" USING btree ("parent_id");
  CREATE INDEX "_drivers_v_version_version_portrait_idx" ON "_drivers_v" USING btree ("version_portrait_id");
  CREATE INDEX "_drivers_v_version_seo_version_seo_image_idx" ON "_drivers_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_drivers_v_version_version_slug_idx" ON "_drivers_v" USING btree ("version_slug");
  CREATE INDEX "_drivers_v_version_version_is_demo_idx" ON "_drivers_v" USING btree ("version_is_demo");
  CREATE INDEX "_drivers_v_version_version_updated_at_idx" ON "_drivers_v" USING btree ("version_updated_at");
  CREATE INDEX "_drivers_v_version_version_created_at_idx" ON "_drivers_v" USING btree ("version_created_at");
  CREATE INDEX "_drivers_v_version_version__status_idx" ON "_drivers_v" USING btree ("version__status");
  CREATE INDEX "_drivers_v_created_at_idx" ON "_drivers_v" USING btree ("created_at");
  CREATE INDEX "_drivers_v_updated_at_idx" ON "_drivers_v" USING btree ("updated_at");
  CREATE INDEX "_drivers_v_latest_idx" ON "_drivers_v" USING btree ("latest");
  CREATE INDEX "driver_engagements_driver_idx" ON "driver_engagements" USING btree ("driver_id");
  CREATE INDEX "driver_engagements_programme_idx" ON "driver_engagements" USING btree ("programme_id");
  CREATE INDEX "driver_engagements_season_idx" ON "driver_engagements" USING btree ("season");
  CREATE INDEX "driver_engagements_is_demo_idx" ON "driver_engagements" USING btree ("is_demo");
  CREATE INDEX "driver_engagements_updated_at_idx" ON "driver_engagements" USING btree ("updated_at");
  CREATE INDEX "driver_engagements_created_at_idx" ON "driver_engagements" USING btree ("created_at");
  CREATE INDEX "driver_engagements__status_idx" ON "driver_engagements" USING btree ("_status");
  CREATE INDEX "_driver_engagements_v_parent_idx" ON "_driver_engagements_v" USING btree ("parent_id");
  CREATE INDEX "_driver_engagements_v_version_version_driver_idx" ON "_driver_engagements_v" USING btree ("version_driver_id");
  CREATE INDEX "_driver_engagements_v_version_version_programme_idx" ON "_driver_engagements_v" USING btree ("version_programme_id");
  CREATE INDEX "_driver_engagements_v_version_version_season_idx" ON "_driver_engagements_v" USING btree ("version_season");
  CREATE INDEX "_driver_engagements_v_version_version_is_demo_idx" ON "_driver_engagements_v" USING btree ("version_is_demo");
  CREATE INDEX "_driver_engagements_v_version_version_updated_at_idx" ON "_driver_engagements_v" USING btree ("version_updated_at");
  CREATE INDEX "_driver_engagements_v_version_version_created_at_idx" ON "_driver_engagements_v" USING btree ("version_created_at");
  CREATE INDEX "_driver_engagements_v_version_version__status_idx" ON "_driver_engagements_v" USING btree ("version__status");
  CREATE INDEX "_driver_engagements_v_created_at_idx" ON "_driver_engagements_v" USING btree ("created_at");
  CREATE INDEX "_driver_engagements_v_updated_at_idx" ON "_driver_engagements_v" USING btree ("updated_at");
  CREATE INDEX "_driver_engagements_v_latest_idx" ON "_driver_engagements_v" USING btree ("latest");
  CREATE INDEX "circuits_layouts_order_idx" ON "circuits_layouts" USING btree ("_order");
  CREATE INDEX "circuits_layouts_parent_id_idx" ON "circuits_layouts" USING btree ("_parent_id");
  CREATE INDEX "circuits_layouts_diagram_idx" ON "circuits_layouts" USING btree ("diagram_id");
  CREATE UNIQUE INDEX "circuits_slug_idx" ON "circuits" USING btree ("slug");
  CREATE INDEX "circuits_source_idx" ON "circuits" USING btree ("source_id");
  CREATE INDEX "circuits_updated_at_idx" ON "circuits" USING btree ("updated_at");
  CREATE INDEX "circuits_created_at_idx" ON "circuits" USING btree ("created_at");
  CREATE UNIQUE INDEX "events_slug_idx" ON "events" USING btree ("slug");
  CREATE INDEX "events_programme_idx" ON "events" USING btree ("programme_id");
  CREATE INDEX "events_championship_season_idx" ON "events" USING btree ("championship_season_id");
  CREATE INDEX "events_season_idx" ON "events" USING btree ("season");
  CREATE INDEX "events_circuit_idx" ON "events" USING btree ("circuit_id");
  CREATE INDEX "events_preview_idx" ON "events" USING btree ("preview_id");
  CREATE INDEX "events_report_idx" ON "events" USING btree ("report_id");
  CREATE INDEX "events_gallery_idx" ON "events" USING btree ("gallery_id");
  CREATE INDEX "events_is_demo_idx" ON "events" USING btree ("is_demo");
  CREATE INDEX "events_updated_at_idx" ON "events" USING btree ("updated_at");
  CREATE INDEX "events_created_at_idx" ON "events" USING btree ("created_at");
  CREATE INDEX "events__status_idx" ON "events" USING btree ("_status");
  CREATE INDEX "events_rels_order_idx" ON "events_rels" USING btree ("order");
  CREATE INDEX "events_rels_parent_idx" ON "events_rels" USING btree ("parent_id");
  CREATE INDEX "events_rels_path_idx" ON "events_rels" USING btree ("path");
  CREATE INDEX "events_rels_drivers_id_idx" ON "events_rels" USING btree ("drivers_id");
  CREATE INDEX "_events_v_parent_idx" ON "_events_v" USING btree ("parent_id");
  CREATE INDEX "_events_v_version_version_slug_idx" ON "_events_v" USING btree ("version_slug");
  CREATE INDEX "_events_v_version_version_programme_idx" ON "_events_v" USING btree ("version_programme_id");
  CREATE INDEX "_events_v_version_version_championship_season_idx" ON "_events_v" USING btree ("version_championship_season_id");
  CREATE INDEX "_events_v_version_version_season_idx" ON "_events_v" USING btree ("version_season");
  CREATE INDEX "_events_v_version_version_circuit_idx" ON "_events_v" USING btree ("version_circuit_id");
  CREATE INDEX "_events_v_version_version_preview_idx" ON "_events_v" USING btree ("version_preview_id");
  CREATE INDEX "_events_v_version_version_report_idx" ON "_events_v" USING btree ("version_report_id");
  CREATE INDEX "_events_v_version_version_gallery_idx" ON "_events_v" USING btree ("version_gallery_id");
  CREATE INDEX "_events_v_version_version_is_demo_idx" ON "_events_v" USING btree ("version_is_demo");
  CREATE INDEX "_events_v_version_version_updated_at_idx" ON "_events_v" USING btree ("version_updated_at");
  CREATE INDEX "_events_v_version_version_created_at_idx" ON "_events_v" USING btree ("version_created_at");
  CREATE INDEX "_events_v_version_version__status_idx" ON "_events_v" USING btree ("version__status");
  CREATE INDEX "_events_v_created_at_idx" ON "_events_v" USING btree ("created_at");
  CREATE INDEX "_events_v_updated_at_idx" ON "_events_v" USING btree ("updated_at");
  CREATE INDEX "_events_v_latest_idx" ON "_events_v" USING btree ("latest");
  CREATE INDEX "_events_v_rels_order_idx" ON "_events_v_rels" USING btree ("order");
  CREATE INDEX "_events_v_rels_parent_idx" ON "_events_v_rels" USING btree ("parent_id");
  CREATE INDEX "_events_v_rels_path_idx" ON "_events_v_rels" USING btree ("path");
  CREATE INDEX "_events_v_rels_drivers_id_idx" ON "_events_v_rels" USING btree ("drivers_id");
  CREATE INDEX "sessions_event_idx" ON "sessions" USING btree ("event_id");
  CREATE INDEX "sessions_starts_at_idx" ON "sessions" USING btree ("starts_at");
  CREATE INDEX "sessions_is_demo_idx" ON "sessions" USING btree ("is_demo");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  CREATE INDEX "result_sets_entries_order_idx" ON "result_sets_entries" USING btree ("_order");
  CREATE INDEX "result_sets_entries_parent_id_idx" ON "result_sets_entries" USING btree ("_parent_id");
  CREATE INDEX "result_sets_entries_driver_idx" ON "result_sets_entries" USING btree ("driver_id");
  CREATE INDEX "result_sets_event_idx" ON "result_sets" USING btree ("event_id");
  CREATE INDEX "result_sets_session_idx" ON "result_sets" USING btree ("session_id");
  CREATE INDEX "result_sets_season_idx" ON "result_sets" USING btree ("season");
  CREATE INDEX "result_sets_programme_idx" ON "result_sets" USING btree ("programme_id");
  CREATE INDEX "result_sets_source_source_document_idx" ON "result_sets" USING btree ("source_document_id");
  CREATE INDEX "result_sets_source_source_record_idx" ON "result_sets" USING btree ("source_record_id");
  CREATE INDEX "result_sets_is_demo_idx" ON "result_sets" USING btree ("is_demo");
  CREATE INDEX "result_sets_updated_at_idx" ON "result_sets" USING btree ("updated_at");
  CREATE INDEX "result_sets_created_at_idx" ON "result_sets" USING btree ("created_at");
  CREATE INDEX "result_sets__status_idx" ON "result_sets" USING btree ("_status");
  CREATE INDEX "_result_sets_v_version_entries_order_idx" ON "_result_sets_v_version_entries" USING btree ("_order");
  CREATE INDEX "_result_sets_v_version_entries_parent_id_idx" ON "_result_sets_v_version_entries" USING btree ("_parent_id");
  CREATE INDEX "_result_sets_v_version_entries_driver_idx" ON "_result_sets_v_version_entries" USING btree ("driver_id");
  CREATE INDEX "_result_sets_v_parent_idx" ON "_result_sets_v" USING btree ("parent_id");
  CREATE INDEX "_result_sets_v_version_version_event_idx" ON "_result_sets_v" USING btree ("version_event_id");
  CREATE INDEX "_result_sets_v_version_version_session_idx" ON "_result_sets_v" USING btree ("version_session_id");
  CREATE INDEX "_result_sets_v_version_version_season_idx" ON "_result_sets_v" USING btree ("version_season");
  CREATE INDEX "_result_sets_v_version_version_programme_idx" ON "_result_sets_v" USING btree ("version_programme_id");
  CREATE INDEX "_result_sets_v_version_source_version_source_document_idx" ON "_result_sets_v" USING btree ("version_source_document_id");
  CREATE INDEX "_result_sets_v_version_source_version_source_record_idx" ON "_result_sets_v" USING btree ("version_source_record_id");
  CREATE INDEX "_result_sets_v_version_version_is_demo_idx" ON "_result_sets_v" USING btree ("version_is_demo");
  CREATE INDEX "_result_sets_v_version_version_updated_at_idx" ON "_result_sets_v" USING btree ("version_updated_at");
  CREATE INDEX "_result_sets_v_version_version_created_at_idx" ON "_result_sets_v" USING btree ("version_created_at");
  CREATE INDEX "_result_sets_v_version_version__status_idx" ON "_result_sets_v" USING btree ("version__status");
  CREATE INDEX "_result_sets_v_created_at_idx" ON "_result_sets_v" USING btree ("created_at");
  CREATE INDEX "_result_sets_v_updated_at_idx" ON "_result_sets_v" USING btree ("updated_at");
  CREATE INDEX "_result_sets_v_latest_idx" ON "_result_sets_v" USING btree ("latest");
  CREATE INDEX "standings_entries_order_idx" ON "standings_entries" USING btree ("_order");
  CREATE INDEX "standings_entries_parent_id_idx" ON "standings_entries" USING btree ("_parent_id");
  CREATE INDEX "standings_entries_driver_idx" ON "standings_entries" USING btree ("driver_id");
  CREATE INDEX "standings_programme_idx" ON "standings" USING btree ("programme_id");
  CREATE INDEX "standings_season_idx" ON "standings" USING btree ("season");
  CREATE INDEX "standings_after_event_idx" ON "standings" USING btree ("after_event_id");
  CREATE INDEX "standings_source_source_record_idx" ON "standings" USING btree ("source_record_id");
  CREATE INDEX "standings_is_demo_idx" ON "standings" USING btree ("is_demo");
  CREATE INDEX "standings_updated_at_idx" ON "standings" USING btree ("updated_at");
  CREATE INDEX "standings_created_at_idx" ON "standings" USING btree ("created_at");
  CREATE INDEX "standings__status_idx" ON "standings" USING btree ("_status");
  CREATE INDEX "_standings_v_version_entries_order_idx" ON "_standings_v_version_entries" USING btree ("_order");
  CREATE INDEX "_standings_v_version_entries_parent_id_idx" ON "_standings_v_version_entries" USING btree ("_parent_id");
  CREATE INDEX "_standings_v_version_entries_driver_idx" ON "_standings_v_version_entries" USING btree ("driver_id");
  CREATE INDEX "_standings_v_parent_idx" ON "_standings_v" USING btree ("parent_id");
  CREATE INDEX "_standings_v_version_version_programme_idx" ON "_standings_v" USING btree ("version_programme_id");
  CREATE INDEX "_standings_v_version_version_season_idx" ON "_standings_v" USING btree ("version_season");
  CREATE INDEX "_standings_v_version_version_after_event_idx" ON "_standings_v" USING btree ("version_after_event_id");
  CREATE INDEX "_standings_v_version_source_version_source_record_idx" ON "_standings_v" USING btree ("version_source_record_id");
  CREATE INDEX "_standings_v_version_version_is_demo_idx" ON "_standings_v" USING btree ("version_is_demo");
  CREATE INDEX "_standings_v_version_version_updated_at_idx" ON "_standings_v" USING btree ("version_updated_at");
  CREATE INDEX "_standings_v_version_version_created_at_idx" ON "_standings_v" USING btree ("version_created_at");
  CREATE INDEX "_standings_v_version_version__status_idx" ON "_standings_v" USING btree ("version__status");
  CREATE INDEX "_standings_v_created_at_idx" ON "_standings_v" USING btree ("created_at");
  CREATE INDEX "_standings_v_updated_at_idx" ON "_standings_v" USING btree ("updated_at");
  CREATE INDEX "_standings_v_latest_idx" ON "_standings_v" USING btree ("latest");
  CREATE INDEX "live_updates_event_idx" ON "live_updates" USING btree ("event_id");
  CREATE INDEX "live_updates_updated_at_idx" ON "live_updates" USING btree ("updated_at");
  CREATE INDEX "live_updates_created_at_idx" ON "live_updates" USING btree ("created_at");
  CREATE INDEX "articles_corrections_order_idx" ON "articles_corrections" USING btree ("_order");
  CREATE INDEX "articles_corrections_parent_id_idx" ON "articles_corrections" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "articles_slug_idx" ON "articles" USING btree ("slug");
  CREATE INDEX "articles_hero_image_idx" ON "articles" USING btree ("hero_image_id");
  CREATE INDEX "articles_published_at_idx" ON "articles" USING btree ("published_at");
  CREATE INDEX "articles_season_idx" ON "articles" USING btree ("season");
  CREATE INDEX "articles_seo_seo_image_idx" ON "articles" USING btree ("seo_image_id");
  CREATE INDEX "articles_is_demo_idx" ON "articles" USING btree ("is_demo");
  CREATE INDEX "articles_updated_at_idx" ON "articles" USING btree ("updated_at");
  CREATE INDEX "articles_created_at_idx" ON "articles" USING btree ("created_at");
  CREATE INDEX "articles__status_idx" ON "articles" USING btree ("_status");
  CREATE INDEX "articles_rels_order_idx" ON "articles_rels" USING btree ("order");
  CREATE INDEX "articles_rels_parent_idx" ON "articles_rels" USING btree ("parent_id");
  CREATE INDEX "articles_rels_path_idx" ON "articles_rels" USING btree ("path");
  CREATE INDEX "articles_rels_programmes_id_idx" ON "articles_rels" USING btree ("programmes_id");
  CREATE INDEX "articles_rels_drivers_id_idx" ON "articles_rels" USING btree ("drivers_id");
  CREATE INDEX "articles_rels_events_id_idx" ON "articles_rels" USING btree ("events_id");
  CREATE INDEX "articles_rels_partners_id_idx" ON "articles_rels" USING btree ("partners_id");
  CREATE INDEX "_articles_v_version_corrections_order_idx" ON "_articles_v_version_corrections" USING btree ("_order");
  CREATE INDEX "_articles_v_version_corrections_parent_id_idx" ON "_articles_v_version_corrections" USING btree ("_parent_id");
  CREATE INDEX "_articles_v_parent_idx" ON "_articles_v" USING btree ("parent_id");
  CREATE INDEX "_articles_v_version_version_slug_idx" ON "_articles_v" USING btree ("version_slug");
  CREATE INDEX "_articles_v_version_version_hero_image_idx" ON "_articles_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_articles_v_version_version_published_at_idx" ON "_articles_v" USING btree ("version_published_at");
  CREATE INDEX "_articles_v_version_version_season_idx" ON "_articles_v" USING btree ("version_season");
  CREATE INDEX "_articles_v_version_seo_version_seo_image_idx" ON "_articles_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_articles_v_version_version_is_demo_idx" ON "_articles_v" USING btree ("version_is_demo");
  CREATE INDEX "_articles_v_version_version_updated_at_idx" ON "_articles_v" USING btree ("version_updated_at");
  CREATE INDEX "_articles_v_version_version_created_at_idx" ON "_articles_v" USING btree ("version_created_at");
  CREATE INDEX "_articles_v_version_version__status_idx" ON "_articles_v" USING btree ("version__status");
  CREATE INDEX "_articles_v_created_at_idx" ON "_articles_v" USING btree ("created_at");
  CREATE INDEX "_articles_v_updated_at_idx" ON "_articles_v" USING btree ("updated_at");
  CREATE INDEX "_articles_v_latest_idx" ON "_articles_v" USING btree ("latest");
  CREATE INDEX "_articles_v_rels_order_idx" ON "_articles_v_rels" USING btree ("order");
  CREATE INDEX "_articles_v_rels_parent_idx" ON "_articles_v_rels" USING btree ("parent_id");
  CREATE INDEX "_articles_v_rels_path_idx" ON "_articles_v_rels" USING btree ("path");
  CREATE INDEX "_articles_v_rels_programmes_id_idx" ON "_articles_v_rels" USING btree ("programmes_id");
  CREATE INDEX "_articles_v_rels_drivers_id_idx" ON "_articles_v_rels" USING btree ("drivers_id");
  CREATE INDEX "_articles_v_rels_events_id_idx" ON "_articles_v_rels" USING btree ("events_id");
  CREATE INDEX "_articles_v_rels_partners_id_idx" ON "_articles_v_rels" USING btree ("partners_id");
  CREATE INDEX "faqs_updated_at_idx" ON "faqs" USING btree ("updated_at");
  CREATE INDEX "faqs_created_at_idx" ON "faqs" USING btree ("created_at");
  CREATE INDEX "faqs_rels_order_idx" ON "faqs_rels" USING btree ("order");
  CREATE INDEX "faqs_rels_parent_idx" ON "faqs_rels" USING btree ("parent_id");
  CREATE INDEX "faqs_rels_path_idx" ON "faqs_rels" USING btree ("path");
  CREATE INDEX "faqs_rels_programmes_id_idx" ON "faqs_rels" USING btree ("programmes_id");
  CREATE INDEX "media_collections_videos_order_idx" ON "media_collections_videos" USING btree ("_order");
  CREATE INDEX "media_collections_videos_parent_id_idx" ON "media_collections_videos" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "media_collections_slug_idx" ON "media_collections" USING btree ("slug");
  CREATE INDEX "media_collections_season_idx" ON "media_collections" USING btree ("season");
  CREATE INDEX "media_collections_programme_idx" ON "media_collections" USING btree ("programme_id");
  CREATE INDEX "media_collections_event_idx" ON "media_collections" USING btree ("event_id");
  CREATE INDEX "media_collections_is_demo_idx" ON "media_collections" USING btree ("is_demo");
  CREATE INDEX "media_collections_updated_at_idx" ON "media_collections" USING btree ("updated_at");
  CREATE INDEX "media_collections_created_at_idx" ON "media_collections" USING btree ("created_at");
  CREATE INDEX "media_collections__status_idx" ON "media_collections" USING btree ("_status");
  CREATE INDEX "media_collections_rels_order_idx" ON "media_collections_rels" USING btree ("order");
  CREATE INDEX "media_collections_rels_parent_idx" ON "media_collections_rels" USING btree ("parent_id");
  CREATE INDEX "media_collections_rels_path_idx" ON "media_collections_rels" USING btree ("path");
  CREATE INDEX "media_collections_rels_drivers_id_idx" ON "media_collections_rels" USING btree ("drivers_id");
  CREATE INDEX "media_collections_rels_media_id_idx" ON "media_collections_rels" USING btree ("media_id");
  CREATE INDEX "_media_collections_v_version_videos_order_idx" ON "_media_collections_v_version_videos" USING btree ("_order");
  CREATE INDEX "_media_collections_v_version_videos_parent_id_idx" ON "_media_collections_v_version_videos" USING btree ("_parent_id");
  CREATE INDEX "_media_collections_v_parent_idx" ON "_media_collections_v" USING btree ("parent_id");
  CREATE INDEX "_media_collections_v_version_version_slug_idx" ON "_media_collections_v" USING btree ("version_slug");
  CREATE INDEX "_media_collections_v_version_version_season_idx" ON "_media_collections_v" USING btree ("version_season");
  CREATE INDEX "_media_collections_v_version_version_programme_idx" ON "_media_collections_v" USING btree ("version_programme_id");
  CREATE INDEX "_media_collections_v_version_version_event_idx" ON "_media_collections_v" USING btree ("version_event_id");
  CREATE INDEX "_media_collections_v_version_version_is_demo_idx" ON "_media_collections_v" USING btree ("version_is_demo");
  CREATE INDEX "_media_collections_v_version_version_updated_at_idx" ON "_media_collections_v" USING btree ("version_updated_at");
  CREATE INDEX "_media_collections_v_version_version_created_at_idx" ON "_media_collections_v" USING btree ("version_created_at");
  CREATE INDEX "_media_collections_v_version_version__status_idx" ON "_media_collections_v" USING btree ("version__status");
  CREATE INDEX "_media_collections_v_created_at_idx" ON "_media_collections_v" USING btree ("created_at");
  CREATE INDEX "_media_collections_v_updated_at_idx" ON "_media_collections_v" USING btree ("updated_at");
  CREATE INDEX "_media_collections_v_latest_idx" ON "_media_collections_v" USING btree ("latest");
  CREATE INDEX "_media_collections_v_rels_order_idx" ON "_media_collections_v_rels" USING btree ("order");
  CREATE INDEX "_media_collections_v_rels_parent_idx" ON "_media_collections_v_rels" USING btree ("parent_id");
  CREATE INDEX "_media_collections_v_rels_path_idx" ON "_media_collections_v_rels" USING btree ("path");
  CREATE INDEX "_media_collections_v_rels_drivers_id_idx" ON "_media_collections_v_rels" USING btree ("drivers_id");
  CREATE INDEX "_media_collections_v_rels_media_id_idx" ON "_media_collections_v_rels" USING btree ("media_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "media_texts_order_parent" ON "media_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "partners_slug_idx" ON "partners" USING btree ("slug");
  CREATE INDEX "partners_logo_idx" ON "partners" USING btree ("logo_id");
  CREATE INDEX "partners_is_demo_idx" ON "partners" USING btree ("is_demo");
  CREATE INDEX "partners_updated_at_idx" ON "partners" USING btree ("updated_at");
  CREATE INDEX "partners_created_at_idx" ON "partners" USING btree ("created_at");
  CREATE INDEX "partnerships_partner_idx" ON "partnerships" USING btree ("partner_id");
  CREATE INDEX "partnerships_programme_idx" ON "partnerships" USING btree ("programme_id");
  CREATE INDEX "partnerships_driver_idx" ON "partnerships" USING btree ("driver_id");
  CREATE INDEX "partnerships_is_demo_idx" ON "partnerships" USING btree ("is_demo");
  CREATE INDEX "partnerships_updated_at_idx" ON "partnerships" USING btree ("updated_at");
  CREATE INDEX "partnerships_created_at_idx" ON "partnerships" USING btree ("created_at");
  CREATE INDEX "people_links_order_idx" ON "people_links" USING btree ("_order");
  CREATE INDEX "people_links_parent_id_idx" ON "people_links" USING btree ("_parent_id");
  CREATE INDEX "people_portrait_idx" ON "people" USING btree ("portrait_id");
  CREATE INDEX "people_is_demo_idx" ON "people" USING btree ("is_demo");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "facilities_image_idx" ON "facilities" USING btree ("image_id");
  CREATE INDEX "facilities_substantiation_substantiation_approved_by_idx" ON "facilities" USING btree ("substantiation_approved_by_id");
  CREATE INDEX "facilities_updated_at_idx" ON "facilities" USING btree ("updated_at");
  CREATE INDEX "facilities_created_at_idx" ON "facilities" USING btree ("created_at");
  CREATE INDEX "facilities_texts_order_parent" ON "facilities_texts" USING btree ("order","parent_id");
  CREATE INDEX "facilities_rels_order_idx" ON "facilities_rels" USING btree ("order");
  CREATE INDEX "facilities_rels_parent_idx" ON "facilities_rels" USING btree ("parent_id");
  CREATE INDEX "facilities_rels_path_idx" ON "facilities_rels" USING btree ("path");
  CREATE INDEX "facilities_rels_sources_id_idx" ON "facilities_rels" USING btree ("sources_id");
  CREATE INDEX "heritage_milestones_image_idx" ON "heritage_milestones" USING btree ("image_id");
  CREATE INDEX "heritage_milestones_substantiation_substantiation_approv_idx" ON "heritage_milestones" USING btree ("substantiation_approved_by_id");
  CREATE INDEX "heritage_milestones_updated_at_idx" ON "heritage_milestones" USING btree ("updated_at");
  CREATE INDEX "heritage_milestones_created_at_idx" ON "heritage_milestones" USING btree ("created_at");
  CREATE INDEX "heritage_milestones_rels_order_idx" ON "heritage_milestones_rels" USING btree ("order");
  CREATE INDEX "heritage_milestones_rels_parent_idx" ON "heritage_milestones_rels" USING btree ("parent_id");
  CREATE INDEX "heritage_milestones_rels_path_idx" ON "heritage_milestones_rels" USING btree ("path");
  CREATE INDEX "heritage_milestones_rels_sources_id_idx" ON "heritage_milestones_rels" USING btree ("sources_id");
  CREATE INDEX "vacancies_responsibilities_order_idx" ON "vacancies_responsibilities" USING btree ("_order");
  CREATE INDEX "vacancies_responsibilities_parent_id_idx" ON "vacancies_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "vacancies_requirements_order_idx" ON "vacancies_requirements" USING btree ("_order");
  CREATE INDEX "vacancies_requirements_parent_id_idx" ON "vacancies_requirements" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "vacancies_slug_idx" ON "vacancies" USING btree ("slug");
  CREATE INDEX "vacancies_is_demo_idx" ON "vacancies" USING btree ("is_demo");
  CREATE INDEX "vacancies_updated_at_idx" ON "vacancies" USING btree ("updated_at");
  CREATE INDEX "vacancies_created_at_idx" ON "vacancies" USING btree ("created_at");
  CREATE INDEX "vacancies__status_idx" ON "vacancies" USING btree ("_status");
  CREATE INDEX "_vacancies_v_version_responsibilities_order_idx" ON "_vacancies_v_version_responsibilities" USING btree ("_order");
  CREATE INDEX "_vacancies_v_version_responsibilities_parent_id_idx" ON "_vacancies_v_version_responsibilities" USING btree ("_parent_id");
  CREATE INDEX "_vacancies_v_version_requirements_order_idx" ON "_vacancies_v_version_requirements" USING btree ("_order");
  CREATE INDEX "_vacancies_v_version_requirements_parent_id_idx" ON "_vacancies_v_version_requirements" USING btree ("_parent_id");
  CREATE INDEX "_vacancies_v_parent_idx" ON "_vacancies_v" USING btree ("parent_id");
  CREATE INDEX "_vacancies_v_version_version_slug_idx" ON "_vacancies_v" USING btree ("version_slug");
  CREATE INDEX "_vacancies_v_version_version_is_demo_idx" ON "_vacancies_v" USING btree ("version_is_demo");
  CREATE INDEX "_vacancies_v_version_version_updated_at_idx" ON "_vacancies_v" USING btree ("version_updated_at");
  CREATE INDEX "_vacancies_v_version_version_created_at_idx" ON "_vacancies_v" USING btree ("version_created_at");
  CREATE INDEX "_vacancies_v_version_version__status_idx" ON "_vacancies_v" USING btree ("version__status");
  CREATE INDEX "_vacancies_v_created_at_idx" ON "_vacancies_v" USING btree ("created_at");
  CREATE INDEX "_vacancies_v_updated_at_idx" ON "_vacancies_v" USING btree ("updated_at");
  CREATE INDEX "_vacancies_v_latest_idx" ON "_vacancies_v" USING btree ("latest");
  CREATE UNIQUE INDEX "applications_reference_idx" ON "applications" USING btree ("reference");
  CREATE INDEX "applications_vacancy_idx" ON "applications" USING btree ("vacancy_id");
  CREATE INDEX "applications_cv_idx" ON "applications" USING btree ("cv_id");
  CREATE UNIQUE INDEX "applications_idempotency_key_idx" ON "applications" USING btree ("idempotency_key");
  CREATE INDEX "applications_updated_at_idx" ON "applications" USING btree ("updated_at");
  CREATE INDEX "applications_created_at_idx" ON "applications" USING btree ("created_at");
  CREATE INDEX "cv_uploads_updated_at_idx" ON "cv_uploads" USING btree ("updated_at");
  CREATE INDEX "cv_uploads_created_at_idx" ON "cv_uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX "cv_uploads_filename_idx" ON "cv_uploads" USING btree ("filename");
  CREATE INDEX "enquiries_internal_notes_order_idx" ON "enquiries_internal_notes" USING btree ("_order");
  CREATE INDEX "enquiries_internal_notes_parent_id_idx" ON "enquiries_internal_notes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "enquiries_reference_idx" ON "enquiries" USING btree ("reference");
  CREATE INDEX "enquiries_division_idx" ON "enquiries" USING btree ("division");
  CREATE INDEX "enquiries_category_idx" ON "enquiries" USING btree ("category");
  CREATE INDEX "enquiries_status_idx" ON "enquiries" USING btree ("status");
  CREATE INDEX "enquiries_assigned_to_idx" ON "enquiries" USING btree ("assigned_to_id");
  CREATE UNIQUE INDEX "enquiries_idempotency_key_idx" ON "enquiries" USING btree ("idempotency_key");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "notifications_enquiry_idx" ON "notifications" USING btree ("enquiry_id");
  CREATE INDEX "notifications_status_idx" ON "notifications" USING btree ("status");
  CREATE INDEX "notifications_next_attempt_at_idx" ON "notifications" USING btree ("next_attempt_at");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "sources_document_idx" ON "sources" USING btree ("document_id");
  CREATE INDEX "sources_approver_idx" ON "sources" USING btree ("approver_id");
  CREATE INDEX "sources_updated_at_idx" ON "sources" USING btree ("updated_at");
  CREATE INDEX "sources_created_at_idx" ON "sources" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX "consent_records_subject_idx" ON "consent_records" USING btree ("subject");
  CREATE INDEX "consent_records_updated_at_idx" ON "consent_records" USING btree ("updated_at");
  CREATE INDEX "consent_records_created_at_idx" ON "consent_records" USING btree ("created_at");
  CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");
  CREATE INDEX "audit_logs_collection_slug_idx" ON "audit_logs" USING btree ("collection_slug");
  CREATE INDEX "audit_logs_document_id_idx" ON "audit_logs" USING btree ("document_id");
  CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");
  CREATE INDEX "audit_logs_updated_at_idx" ON "audit_logs" USING btree ("updated_at");
  CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_divisions_order_idx" ON "users_divisions" USING btree ("order");
  CREATE INDEX "users_divisions_parent_idx" ON "users_divisions" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_divisions_id_idx" ON "payload_locked_documents_rels" USING btree ("divisions_id");
  CREATE INDEX "payload_locked_documents_rels_programmes_id_idx" ON "payload_locked_documents_rels" USING btree ("programmes_id");
  CREATE INDEX "payload_locked_documents_rels_programme_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("programme_seasons_id");
  CREATE INDEX "payload_locked_documents_rels_championships_id_idx" ON "payload_locked_documents_rels" USING btree ("championships_id");
  CREATE INDEX "payload_locked_documents_rels_championship_seasons_id_idx" ON "payload_locked_documents_rels" USING btree ("championship_seasons_id");
  CREATE INDEX "payload_locked_documents_rels_drivers_id_idx" ON "payload_locked_documents_rels" USING btree ("drivers_id");
  CREATE INDEX "payload_locked_documents_rels_driver_engagements_id_idx" ON "payload_locked_documents_rels" USING btree ("driver_engagements_id");
  CREATE INDEX "payload_locked_documents_rels_circuits_id_idx" ON "payload_locked_documents_rels" USING btree ("circuits_id");
  CREATE INDEX "payload_locked_documents_rels_events_id_idx" ON "payload_locked_documents_rels" USING btree ("events_id");
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_result_sets_id_idx" ON "payload_locked_documents_rels" USING btree ("result_sets_id");
  CREATE INDEX "payload_locked_documents_rels_standings_id_idx" ON "payload_locked_documents_rels" USING btree ("standings_id");
  CREATE INDEX "payload_locked_documents_rels_live_updates_id_idx" ON "payload_locked_documents_rels" USING btree ("live_updates_id");
  CREATE INDEX "payload_locked_documents_rels_articles_id_idx" ON "payload_locked_documents_rels" USING btree ("articles_id");
  CREATE INDEX "payload_locked_documents_rels_faqs_id_idx" ON "payload_locked_documents_rels" USING btree ("faqs_id");
  CREATE INDEX "payload_locked_documents_rels_media_collections_id_idx" ON "payload_locked_documents_rels" USING btree ("media_collections_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_partners_id_idx" ON "payload_locked_documents_rels" USING btree ("partners_id");
  CREATE INDEX "payload_locked_documents_rels_partnerships_id_idx" ON "payload_locked_documents_rels" USING btree ("partnerships_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_facilities_id_idx" ON "payload_locked_documents_rels" USING btree ("facilities_id");
  CREATE INDEX "payload_locked_documents_rels_heritage_milestones_id_idx" ON "payload_locked_documents_rels" USING btree ("heritage_milestones_id");
  CREATE INDEX "payload_locked_documents_rels_vacancies_id_idx" ON "payload_locked_documents_rels" USING btree ("vacancies_id");
  CREATE INDEX "payload_locked_documents_rels_applications_id_idx" ON "payload_locked_documents_rels" USING btree ("applications_id");
  CREATE INDEX "payload_locked_documents_rels_cv_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("cv_uploads_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_sources_id_idx" ON "payload_locked_documents_rels" USING btree ("sources_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_locked_documents_rels_consent_records_id_idx" ON "payload_locked_documents_rels" USING btree ("consent_records_id");
  CREATE INDEX "payload_locked_documents_rels_audit_logs_id_idx" ON "payload_locked_documents_rels" USING btree ("audit_logs_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "team_content_working_methods_order_idx" ON "team_content_working_methods" USING btree ("_order");
  CREATE INDEX "team_content_working_methods_parent_id_idx" ON "team_content_working_methods" USING btree ("_parent_id");
  CREATE INDEX "team_content_values_order_idx" ON "team_content_values" USING btree ("_order");
  CREATE INDEX "team_content_values_parent_id_idx" ON "team_content_values" USING btree ("_parent_id");
  CREATE INDEX "team_content_audience_metrics_order_idx" ON "team_content_audience_metrics" USING btree ("_order");
  CREATE INDEX "team_content_audience_metrics_parent_id_idx" ON "team_content_audience_metrics" USING btree ("_parent_id");
  CREATE INDEX "team_content_audience_metrics_source_idx" ON "team_content_audience_metrics" USING btree ("source_id");
  CREATE INDEX "team_content_acquisition_approved_by_idx" ON "team_content" USING btree ("acquisition_approved_by_id");
  CREATE INDEX "team_content_commercial_deck_idx" ON "team_content" USING btree ("commercial_deck_id");
  CREATE INDEX "team_content_team_profile_pdf_idx" ON "team_content" USING btree ("team_profile_pdf_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "divisions" CASCADE;
  DROP TABLE "programmes_team_support" CASCADE;
  DROP TABLE "programmes_inclusions" CASCADE;
  DROP TABLE "programmes_exclusions" CASCADE;
  DROP TABLE "programmes_official_links" CASCADE;
  DROP TABLE "programmes" CASCADE;
  DROP TABLE "programmes_rels" CASCADE;
  DROP TABLE "programme_seasons" CASCADE;
  DROP TABLE "championships" CASCADE;
  DROP TABLE "championships_texts" CASCADE;
  DROP TABLE "championships_rels" CASCADE;
  DROP TABLE "championship_seasons_documents" CASCADE;
  DROP TABLE "championship_seasons_format" CASCADE;
  DROP TABLE "championship_seasons" CASCADE;
  DROP TABLE "championship_seasons_texts" CASCADE;
  DROP TABLE "drivers_career_timeline" CASCADE;
  DROP TABLE "drivers_stats" CASCADE;
  DROP TABLE "drivers_social_links" CASCADE;
  DROP TABLE "drivers_driver_partners" CASCADE;
  DROP TABLE "drivers" CASCADE;
  DROP TABLE "_drivers_v_version_career_timeline" CASCADE;
  DROP TABLE "_drivers_v_version_stats" CASCADE;
  DROP TABLE "_drivers_v_version_social_links" CASCADE;
  DROP TABLE "_drivers_v_version_driver_partners" CASCADE;
  DROP TABLE "_drivers_v" CASCADE;
  DROP TABLE "driver_engagements" CASCADE;
  DROP TABLE "_driver_engagements_v" CASCADE;
  DROP TABLE "circuits_layouts" CASCADE;
  DROP TABLE "circuits" CASCADE;
  DROP TABLE "events" CASCADE;
  DROP TABLE "events_rels" CASCADE;
  DROP TABLE "_events_v" CASCADE;
  DROP TABLE "_events_v_rels" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "result_sets_entries" CASCADE;
  DROP TABLE "result_sets" CASCADE;
  DROP TABLE "_result_sets_v_version_entries" CASCADE;
  DROP TABLE "_result_sets_v" CASCADE;
  DROP TABLE "standings_entries" CASCADE;
  DROP TABLE "standings" CASCADE;
  DROP TABLE "_standings_v_version_entries" CASCADE;
  DROP TABLE "_standings_v" CASCADE;
  DROP TABLE "live_updates" CASCADE;
  DROP TABLE "articles_corrections" CASCADE;
  DROP TABLE "articles" CASCADE;
  DROP TABLE "articles_rels" CASCADE;
  DROP TABLE "_articles_v_version_corrections" CASCADE;
  DROP TABLE "_articles_v" CASCADE;
  DROP TABLE "_articles_v_rels" CASCADE;
  DROP TABLE "faqs" CASCADE;
  DROP TABLE "faqs_rels" CASCADE;
  DROP TABLE "media_collections_videos" CASCADE;
  DROP TABLE "media_collections" CASCADE;
  DROP TABLE "media_collections_rels" CASCADE;
  DROP TABLE "_media_collections_v_version_videos" CASCADE;
  DROP TABLE "_media_collections_v" CASCADE;
  DROP TABLE "_media_collections_v_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_texts" CASCADE;
  DROP TABLE "partners" CASCADE;
  DROP TABLE "partnerships" CASCADE;
  DROP TABLE "people_links" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "facilities" CASCADE;
  DROP TABLE "facilities_texts" CASCADE;
  DROP TABLE "facilities_rels" CASCADE;
  DROP TABLE "heritage_milestones" CASCADE;
  DROP TABLE "heritage_milestones_rels" CASCADE;
  DROP TABLE "vacancies_responsibilities" CASCADE;
  DROP TABLE "vacancies_requirements" CASCADE;
  DROP TABLE "vacancies" CASCADE;
  DROP TABLE "_vacancies_v_version_responsibilities" CASCADE;
  DROP TABLE "_vacancies_v_version_requirements" CASCADE;
  DROP TABLE "_vacancies_v" CASCADE;
  DROP TABLE "applications" CASCADE;
  DROP TABLE "cv_uploads" CASCADE;
  DROP TABLE "enquiries_internal_notes" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "sources" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "consent_records" CASCADE;
  DROP TABLE "audit_logs" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_divisions" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "feature_flags" CASCADE;
  DROP TABLE "team_content_working_methods" CASCADE;
  DROP TABLE "team_content_values" CASCADE;
  DROP TABLE "team_content_audience_metrics" CASCADE;
  DROP TABLE "team_content" CASCADE;
  DROP TYPE "public"."enum_divisions_key";
  DROP TYPE "public"."enum_divisions_status";
  DROP TYPE "public"."enum_programmes_status";
  DROP TYPE "public"."enum_programmes_relationship_type";
  DROP TYPE "public"."enum_programmes_seat_availability";
  DROP TYPE "public"."enum_programmes_pricing_mode";
  DROP TYPE "public"."enum_programmes_pricing_currency";
  DROP TYPE "public"."enum_programmes_pricing_tax_basis";
  DROP TYPE "public"."enum_programmes_substantiation_status";
  DROP TYPE "public"."enum_programme_seasons_participation_status";
  DROP TYPE "public"."enum_programme_seasons_seat_availability";
  DROP TYPE "public"."enum_championships_level";
  DROP TYPE "public"."enum_championships_substantiation_status";
  DROP TYPE "public"."enum_drivers_alumni";
  DROP TYPE "public"."enum_drivers_status";
  DROP TYPE "public"."enum__drivers_v_version_alumni";
  DROP TYPE "public"."enum__drivers_v_version_status";
  DROP TYPE "public"."enum_driver_engagements_status";
  DROP TYPE "public"."enum__driver_engagements_v_version_status";
  DROP TYPE "public"."enum_events_type";
  DROP TYPE "public"."enum_events_event_status";
  DROP TYPE "public"."enum_events_status";
  DROP TYPE "public"."enum__events_v_version_type";
  DROP TYPE "public"."enum__events_v_version_status";
  DROP TYPE "public"."enum_sessions_type";
  DROP TYPE "public"."enum_sessions_certainty";
  DROP TYPE "public"."enum_sessions_status";
  DROP TYPE "public"."enum_result_sets_entries_status";
  DROP TYPE "public"."enum_result_sets_state";
  DROP TYPE "public"."enum_result_sets_verification";
  DROP TYPE "public"."enum_result_sets_attribution";
  DROP TYPE "public"."enum_result_sets_status";
  DROP TYPE "public"."enum__result_sets_v_version_entries_status";
  DROP TYPE "public"."enum__result_sets_v_version_state";
  DROP TYPE "public"."enum__result_sets_v_version_verification";
  DROP TYPE "public"."enum__result_sets_v_version_attribution";
  DROP TYPE "public"."enum__result_sets_v_version_status";
  DROP TYPE "public"."enum_standings_type";
  DROP TYPE "public"."enum_standings_state";
  DROP TYPE "public"."enum_standings_verification";
  DROP TYPE "public"."enum_standings_attribution";
  DROP TYPE "public"."enum_standings_status";
  DROP TYPE "public"."enum__standings_v_version_type";
  DROP TYPE "public"."enum__standings_v_version_state";
  DROP TYPE "public"."enum__standings_v_version_verification";
  DROP TYPE "public"."enum__standings_v_version_attribution";
  DROP TYPE "public"."enum__standings_v_version_status";
  DROP TYPE "public"."enum_articles_type";
  DROP TYPE "public"."enum_articles_editorial_status";
  DROP TYPE "public"."enum_articles_status";
  DROP TYPE "public"."enum__articles_v_version_type";
  DROP TYPE "public"."enum__articles_v_version_editorial_status";
  DROP TYPE "public"."enum__articles_v_version_status";
  DROP TYPE "public"."enum_faqs_category";
  DROP TYPE "public"."enum_media_collections_videos_provider";
  DROP TYPE "public"."enum_media_collections_status";
  DROP TYPE "public"."enum__media_collections_v_version_videos_provider";
  DROP TYPE "public"."enum__media_collections_v_version_status";
  DROP TYPE "public"."enum_media_usage_scope";
  DROP TYPE "public"."enum_partnerships_tier";
  DROP TYPE "public"."enum_partnerships_scope";
  DROP TYPE "public"."enum_people_department";
  DROP TYPE "public"."enum_facilities_ownership";
  DROP TYPE "public"."enum_facilities_substantiation_status";
  DROP TYPE "public"."enum_heritage_milestones_entity";
  DROP TYPE "public"."enum_heritage_milestones_substantiation_status";
  DROP TYPE "public"."enum_vacancies_discipline";
  DROP TYPE "public"."enum_vacancies_contract_type";
  DROP TYPE "public"."enum_vacancies_application_mode";
  DROP TYPE "public"."enum_vacancies_status";
  DROP TYPE "public"."enum__vacancies_v_version_discipline";
  DROP TYPE "public"."enum__vacancies_v_version_contract_type";
  DROP TYPE "public"."enum__vacancies_v_version_application_mode";
  DROP TYPE "public"."enum__vacancies_v_version_status";
  DROP TYPE "public"."enum_applications_status";
  DROP TYPE "public"."enum_cv_uploads_scan_status";
  DROP TYPE "public"."enum_enquiries_division";
  DROP TYPE "public"."enum_enquiries_category";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_notifications_kind";
  DROP TYPE "public"."enum_notifications_status";
  DROP TYPE "public"."enum_sources_kind";
  DROP TYPE "public"."enum_redirects_status_code";
  DROP TYPE "public"."enum_consent_records_purpose";
  DROP TYPE "public"."enum_consent_records_choice";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_users_divisions";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_site_settings_social_platform";`)
}
