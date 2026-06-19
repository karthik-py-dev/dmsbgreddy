-- BG REDDY DMS OWNER ADMIN GALLERY + EXPORT SQL PATCH
-- Safe additive patch for website owner dashboard.
-- Adds RPCs for:
-- 1. Visit audit: which doctor added each visit
-- 2. Gallery audit: who uploaded each photo/file
-- This does not reset or delete data.

create extension if not exists pgcrypto;

create or replace function public.current_user_clinic_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select clinic_id
  from public.profiles
  where id = auth.uid()
    and active = true
  limit 1;
$$;

grant execute on function public.current_user_clinic_id() to authenticated;

alter table public.patient_visits
add column if not exists clinic_id uuid references public.clinics(id) on delete cascade,
add column if not exists patient_id uuid references public.patients(id) on delete cascade,
add column if not exists doctor_id uuid references public.profiles(id) on delete set null,
add column if not exists visit_date timestamptz default now(),
add column if not exists chief_complaint text,
add column if not exists notes text,
add column if not exists next_appointment_date timestamptz,
add column if not exists created_at timestamptz default now();

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  clinic_id uuid references public.clinics(id) on delete cascade,
  patient_id uuid references public.patients(id) on delete cascade,
  visit_id uuid,
  file_type text not null default 'other',
  file_url text not null,
  file_name text,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table public.files
add column if not exists clinic_id uuid references public.clinics(id) on delete cascade,
add column if not exists patient_id uuid references public.patients(id) on delete cascade,
add column if not exists visit_id uuid,
add column if not exists file_type text default 'other',
add column if not exists file_url text,
add column if not exists file_name text,
add column if not exists uploaded_by uuid references public.profiles(id) on delete set null,
add column if not exists created_at timestamptz default now();

update public.files f
set clinic_id = p.clinic_id
from public.patients p
where f.patient_id = p.id
  and f.clinic_id is null;

create index if not exists patient_visits_clinic_created_idx
on public.patient_visits(clinic_id, created_at desc);

create index if not exists patient_visits_doctor_idx
on public.patient_visits(doctor_id);

create index if not exists files_clinic_created_idx
on public.files(clinic_id, created_at desc);

create index if not exists files_uploaded_by_idx
on public.files(uploaded_by);

drop function if exists public.get_owner_visit_audit(text);

create function public.get_owner_visit_audit(
  p_search text default null
)
returns table (
  visit_id uuid,
  patient_id uuid,
  patient_name text,
  patient_phone text,
  patient_code text,
  doctor_id uuid,
  doctor_name text,
  doctor_role text,
  visit_date timestamptz,
  chief_complaint text,
  diagnosis text,
  notes text,
  treatment text,
  next_appointment_date timestamptz,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    v.id as visit_id,
    p.id as patient_id,
    p.name as patient_name,
    p.phone as patient_phone,
    p.patient_code as patient_code,
    d.id as doctor_id,
    coalesce(d.name, d.email, 'Not recorded') as doctor_name,
    d.role as doctor_role,
    coalesce(v.visit_date, v.created_at) as visit_date,
    coalesce(v.chief_complaint, '') as chief_complaint,
    ''::text as diagnosis,
    coalesce(v.notes, '') as notes,
    ''::text as treatment,
    v.next_appointment_date,
    v.created_at
  from public.patient_visits v
  join public.patients p on p.id = v.patient_id
  left join public.profiles d on d.id = v.doctor_id
  where v.clinic_id = public.current_user_clinic_id()
    and p.clinic_id = public.current_user_clinic_id()
    and (
      nullif(trim(coalesce(p_search, '')), '') is null
      or lower(p.name) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(p.phone, '')) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(p.patient_code, '')) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(d.name, d.email, '')) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(v.chief_complaint, '')) like '%' || lower(trim(p_search)) || '%'
    )
  order by coalesce(v.visit_date, v.created_at) desc
  limit 1000;
$$;

grant execute on function public.get_owner_visit_audit(text) to authenticated;

drop function if exists public.get_owner_gallery_audit(text);

create function public.get_owner_gallery_audit(
  p_search text default null
)
returns table (
  file_id uuid,
  patient_id uuid,
  patient_name text,
  patient_phone text,
  patient_code text,
  file_type text,
  file_name text,
  file_url text,
  uploaded_by uuid,
  uploaded_by_name text,
  uploaded_by_role text,
  created_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select
    f.id as file_id,
    p.id as patient_id,
    p.name as patient_name,
    p.phone as patient_phone,
    p.patient_code as patient_code,
    f.file_type,
    f.file_name,
    f.file_url,
    u.id as uploaded_by,
    coalesce(u.name, u.email, 'Not recorded') as uploaded_by_name,
    u.role as uploaded_by_role,
    f.created_at
  from public.files f
  join public.patients p on p.id = f.patient_id
  left join public.profiles u on u.id = f.uploaded_by
  where f.clinic_id = public.current_user_clinic_id()
    and p.clinic_id = public.current_user_clinic_id()
    and (
      nullif(trim(coalesce(p_search, '')), '') is null
      or lower(p.name) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(p.phone, '')) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(p.patient_code, '')) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(f.file_type, '')) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(f.file_name, '')) like '%' || lower(trim(p_search)) || '%'
      or lower(coalesce(u.name, u.email, '')) like '%' || lower(trim(p_search)) || '%'
    )
  order by f.created_at desc
  limit 1000;
$$;

grant execute on function public.get_owner_gallery_audit(text) to authenticated;

alter table public.patient_visits enable row level security;
alter table public.files enable row level security;

alter table public.patient_visits no force row level security;
alter table public.files no force row level security;

grant select on public.patient_visits to authenticated;
grant select on public.files to authenticated;

drop policy if exists "patient_visits_select_own_clinic" on public.patient_visits;
create policy "patient_visits_select_own_clinic"
on public.patient_visits
for select
to authenticated
using (clinic_id = public.current_user_clinic_id());

drop policy if exists "files_select_own_clinic" on public.files;
create policy "files_select_own_clinic"
on public.files
for select
to authenticated
using (clinic_id = public.current_user_clinic_id());

notify pgrst, 'reload schema';

select 'OWNER ADMIN GALLERY + EXPORT RPCS READY' as result;
