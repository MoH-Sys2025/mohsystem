-- Enable UUID generation
create extension if not exists "pgcrypto";

--------------------------------------------------------------------------------
-- Trigger function to update "updated_at"
--------------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
return new;
end;
$$ language plpgsql;

--------------------------------------------------------------------------------
-- ADMINISTRATIVE REGIONS
--------------------------------------------------------------------------------
create table administrative_regions (
                                        id uuid primary key default gen_random_uuid(),
                                        name text not null,
                                        type text check (type in ('region','district','ta','village')) not null,
                                        parent_id uuid references administrative_regions(id) on delete cascade,
                                        code text,
                                        metadata jsonb default '{}'::jsonb,
                                        created_at timestamptz default now(),
                                        updated_at timestamptz default now()
);
create index administrative_regions_type_idx on administrative_regions(type);
create trigger trg_admin_regions_updated before update on administrative_regions
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- HEALTH FACILITIES
--------------------------------------------------------------------------------
create table health_facilities (
                                   id uuid primary key default gen_random_uuid(),
                                   facility_name text not null,
                                   facility_code text,
                                   facility_type text check (facility_type in ('clinic','health_center','hospital','other')) not null,
                                   region_id uuid references administrative_regions(id),
                                   district_id uuid references administrative_regions(id),
                                   latitude double precision,
                                   longitude double precision,
                                   address text,
                                   contact_phone text,
                                   contact_email text,
                                   owner text,
                                   metadata jsonb default '{}'::jsonb,
                                   created_at timestamptz default now(),
                                   updated_at timestamptz default now()
);
create index health_facilities_name_idx on health_facilities(facility_name);
create index health_facilities_lat_idx on health_facilities(latitude);
create index health_facilities_lon_idx on health_facilities(longitude);
create trigger trg_health_facilities_updated before update on health_facilities
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- PROFILES (linked to Supabase auth)
--------------------------------------------------------------------------------
create table profiles (
                          id uuid primary key references auth.users(id) on delete cascade,
                          full_name text,
                          phone text,
                          email text,
                          role text check (role in ('admin','moh_viewer','district_officer','training_institution','health_worker','lab_tech','data_clerk')),
                          facility_id uuid references health_facilities(id),
                          district_id uuid references administrative_regions(id),
                          organization text,
                          activated boolean default true,
                          metadata jsonb default '{}'::jsonb,
                          created_at timestamptz default now(),
                          updated_at timestamptz default now()
);
create index profiles_role_idx on profiles(role);
create trigger trg_profiles_updated before update on profiles
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- CADRES
--------------------------------------------------------------------------------
create table cadres (
                        id uuid primary key default gen_random_uuid(),
                        name text not null unique,
                        description text,
                        created_at timestamptz default now(),
                        updated_at timestamptz default now()
);
create trigger trg_cadres_updated before update on cadres for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- PERSONNEL
--------------------------------------------------------------------------------
create table personnel (
                           id uuid primary key default gen_random_uuid(),
                           profile_id uuid references profiles(id) on delete set null,
                           personnel_identifier text,
                           first_name text,
                           last_name text,
                           other_names text,
                           cadre_id uuid references cadres(id),
                           gender text check (gender in ('male','female','non_binary','unknown')),
                           date_of_birth date,
                           phone text,
                           email text,
                           current_facility_id uuid references health_facilities(id),
                           current_district_id uuid references administrative_regions(id),
                           employment_status text check (employment_status in ('active','inactive','retired','deceased','on_leave')) default 'active',
                           hire_date date,
                           exit_date date,
                           qualifications text,
                           ihrmis_sync boolean default false,
                           dhis2_sync boolean default false,
                           metadata jsonb default '{}'::jsonb,
                           created_at timestamptz default now(),
                           updated_at timestamptz default now()
);
create index personnel_identifier_idx on personnel(personnel_identifier);
create index personnel_name_idx on personnel(last_name, first_name);
create trigger trg_personnel_updated before update on personnel
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- COMPETENCY TYPES
--------------------------------------------------------------------------------
create table competency_types (
                                  id uuid primary key default gen_random_uuid(),
                                  code text unique not null,
                                  name text not null,
                                  description text,
                                  level text check (level in ('basic','intermediate','advanced')) default 'basic',
                                  created_at timestamptz default now(),
                                  updated_at timestamptz default now()
);
create trigger trg_competency_types_updated before update on competency_types
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- PERSONNEL COMPETENCIES
--------------------------------------------------------------------------------
create table personnel_competencies (
                                        id uuid primary key default gen_random_uuid(),
                                        personnel_id uuid references personnel(id) on delete cascade,
                                        competency_type_id uuid references competency_types(id) on delete cascade,
                                        competency_level text check (competency_level in ('observed','trained','certified','mastered')),
                                        evidence text,
                                        evidence_url text,
                                        date_attained date,
                                        verified_by uuid references profiles(id),
                                        verified_at timestamptz,
                                        notes text,
                                        metadata jsonb default '{}'::jsonb,
                                        created_at timestamptz default now(),
                                        updated_at timestamptz default now(),
                                        unique(personnel_id, competency_type_id)
);
create index personnel_competencies_pid_idx on personnel_competencies(personnel_id);
create trigger trg_personnel_competencies_updated before update on personnel_competencies
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- TRAININGS
--------------------------------------------------------------------------------
create table trainings (
                           id uuid primary key default gen_random_uuid(),
                           title text not null,
                           training_code text,
                           provider text,
                           provider_id uuid,
                           start_date date,
                           end_date date,
                           modality text check (modality in ('in_person','online','blended','on_the_job')),
                           location text,
                           seats integer,
                           metadata jsonb default '{}'::jsonb,
                           created_at timestamptz default now(),
                           updated_at timestamptz default now()
);
create index trainings_title_idx on trainings(title);
create trigger trg_trainings_updated before update on trainings
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- TRAINING PARTICIPANTS
--------------------------------------------------------------------------------
create table training_participants (
                                       id uuid primary key default gen_random_uuid(),
                                       training_id uuid references trainings(id) on delete cascade,
                                       personnel_id uuid references personnel(id) on delete cascade,
                                       attended boolean default true,
                                       attendance_certificate_url text,
                                       score numeric,
                                       completion_date date,
                                       created_at timestamptz default now(),
                                       updated_at timestamptz default now(),
                                       unique(training_id, personnel_id)
);
create trigger trg_training_participants_updated before update on training_participants
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- TRAINING INSTITUTIONS
--------------------------------------------------------------------------------
create table training_institutions (
                                       id uuid primary key default gen_random_uuid(),
                                       name text not null,
                                       code text,
                                       contact_person text,
                                       contact_email text,
                                       contact_phone text,
                                       address text,
                                       metadata jsonb default '{}'::jsonb,
                                       created_at timestamptz default now(),
                                       updated_at timestamptz default now()
);
create trigger trg_training_institutions_updated before update on training_institutions
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- DEPLOYMENTS
--------------------------------------------------------------------------------
create table deployments (
                             id uuid primary key default gen_random_uuid(),
                             personnel_id uuid references personnel(id) on delete cascade,
                             deployment_type text check (deployment_type in ('surge','routine','training','response')) default 'response',
                             start_date date,
                             end_date date,
                             assigned_district_id uuid references administrative_regions(id),
                             assigned_facility_id uuid references health_facilities(id),
                             team_lead uuid references personnel(id),
                             role_description text,
                             status text check (status in ('planned','ongoing','completed','cancelled')) default 'planned',
                             notes text,
                             created_at timestamptz default now(),
                             updated_at timestamptz default now()
);
create trigger trg_deployments_updated before update on deployments
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- CERTIFICATIONS
--------------------------------------------------------------------------------
create table certifications (
                                id uuid primary key default gen_random_uuid(),
                                personnel_id uuid references personnel(id) on delete cascade,
                                title text not null,
                                issuing_organization text,
                                certificate_number text,
                                date_issued date,
                                date_expires date,
                                certificate_url text,
                                verified boolean default false,
                                verified_by uuid references profiles(id),
                                verified_at timestamptz,
                                metadata jsonb default '{}'::jsonb,
                                created_at timestamptz default now(),
                                updated_at timestamptz default now()
);
create trigger trg_certifications_updated before update on certifications
    for each row execute procedure set_updated_at();

--------------------------------------------------------------------------------
-- ATTACHMENTS
--------------------------------------------------------------------------------
create table attachments (
                             id uuid primary key default gen_random_uuid(),
                             owner_table text not null,
                             owner_id uuid not null,
                             file_url text not null,
                             file_name text,
                             file_type text,
                             uploaded_by uuid references profiles(id),
                             uploaded_at timestamptz default now(),
                             metadata jsonb default '{}'::jsonb
);
create index attachments_owner_idx on attachments(owner_table, owner_id);

--------------------------------------------------------------------------------
-- AUDIT LOGS
--------------------------------------------------------------------------------
create table audit_logs (
                            id uuid primary key default gen_random_uuid(),
                            actor_id uuid references profiles(id),
                            action text not null,
                            table_name text,
                            record_id uuid,
                            ip_address text,
                            user_agent text,
                            payload jsonb,
                            created_at timestamptz default now()
);

--------------------------------------------------------------------------------
-- SYSTEM SETTINGS
--------------------------------------------------------------------------------
create table system_settings (
                                 key text primary key,
                                 value jsonb,
                                 description text,
                                 created_at timestamptz default now(),
                                 updated_at timestamptz default now()
);
create trigger trg_system_settings_updated before update on system_settings
    for each row execute procedure set_updated_at();
