
-- ============ ROLES ============
create type public.app_role as enum ('super_admin', 'admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles self read" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','super_admin'))
$$;

create policy "roles read own" on public.user_roles for select to authenticated using (user_id = auth.uid());
create policy "super admin manages roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'super_admin')) with check (public.has_role(auth.uid(),'super_admin'));

-- Auto-create profile and grant super_admin to first user
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare user_count int;
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  select count(*) into user_count from auth.users;
  if user_count = 1 then
    insert into public.user_roles (user_id, role) values (new.id, 'super_admin');
  end if;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- ============ SETTINGS ============
create table public.settings (
  id uuid primary key default gen_random_uuid(),
  singleton boolean not null default true unique,
  salon_name text not null default 'Rashid Salon and Academy',
  logo_url text,
  phone text default '',
  whatsapp text default '',
  email text default '',
  address text default '280, Model Town Rd, opposite KFC, above The Hanger, Model Town, Jalandhar, Punjab 144001',
  business_hours jsonb not null default '{"mon":"10:00 - 20:00","tue":"10:00 - 20:00","wed":"10:00 - 20:00","thu":"10:00 - 20:00","fri":"10:00 - 20:00","sat":"10:00 - 21:00","sun":"11:00 - 19:00"}',
  instagram text default 'https://instagram.com/rashidsalon_',
  facebook text default 'https://facebook.com/',
  google_maps text default '',
  hero_title text default 'Where pigment meets practice.',
  hero_subtitle text default 'A unisex salon and training academy in Model Town, Jalandhar — sit in the chair, or learn behind it.',
  hero_image_url text,
  about_title text default 'Two rooms. One craft.',
  about_description text default 'By day we color, cut, and care for hair. By evening the same chairs teach the next generation of stylists. Everything we do at Rashid passes through both rooms.',
  about_image_url text,
  about_stat_1_value text default '12+',
  about_stat_1_label text default 'Years in Model Town',
  about_stat_2_value text default '300+',
  about_stat_2_label text default 'Graduates trained',
  about_stat_3_value text default '8',
  about_stat_3_label text default 'Senior stylists',
  academy_title text default 'Rashid Academy',
  academy_description text default 'A working-floor school. Small batches, real clients, certified by industry-experienced educators.',
  academy_image_url text,
  academy_stat_1_value text default '300+',
  academy_stat_1_label text default 'Graduates',
  academy_stat_2_value text default '85%',
  academy_stat_2_label text default 'Placement rate',
  academy_stat_3_value text default '6',
  academy_stat_3_label text default 'Years running',
  updated_at timestamptz not null default now()
);
grant select on public.settings to anon, authenticated;
grant all on public.settings to authenticated, service_role;
alter table public.settings enable row level security;
create policy "settings public read" on public.settings for select using (true);
create policy "settings admin write" on public.settings for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

insert into public.settings (singleton) values (true);

-- ============ SERVICES ============
create table public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  category text,
  price numeric(10,2),
  duration text,
  description text,
  image_url text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
grant select on public.services to anon, authenticated;
grant all on public.services to authenticated, service_role;
alter table public.services enable row level security;
create policy "services public read" on public.services for select using (true);
create policy "services admin write" on public.services for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ STYLISTS ============
create table public.stylists (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  photo_url text,
  experience text,
  specialization text,
  bio text,
  availability text,
  instagram text,
  facebook text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
grant select on public.stylists to anon, authenticated;
grant all on public.stylists to authenticated, service_role;
alter table public.stylists enable row level security;
create policy "stylists public read" on public.stylists for select using (true);
create policy "stylists admin write" on public.stylists for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ GALLERY ============
create table public.gallery (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  category text,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
grant select on public.gallery to anon, authenticated;
grant all on public.gallery to authenticated, service_role;
alter table public.gallery enable row level security;
create policy "gallery public read" on public.gallery for select using (true);
create policy "gallery admin write" on public.gallery for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ REVIEWS ============
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rating int not null default 5,
  review text,
  photo_url text,
  created_at timestamptz not null default now()
);
grant select on public.reviews to anon, authenticated;
grant all on public.reviews to authenticated, service_role;
alter table public.reviews enable row level security;
create policy "reviews public read" on public.reviews for select using (true);
create policy "reviews public insert" on public.reviews for insert to anon, authenticated with check (true);
create policy "reviews admin write" on public.reviews for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ CONTACTS ============
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  message text not null,
  resolved boolean default false,
  created_at timestamptz not null default now()
);
grant insert on public.contacts to anon, authenticated;
grant select, update, delete on public.contacts to authenticated;
grant all on public.contacts to service_role;
alter table public.contacts enable row level security;
create policy "contacts public insert" on public.contacts for insert to anon, authenticated with check (true);
create policy "contacts admin read" on public.contacts for select to authenticated using (public.is_admin(auth.uid()));
create policy "contacts admin write" on public.contacts for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ APPOINTMENTS ============
create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  service_id uuid references public.services(id) on delete set null,
  stylist_id uuid references public.stylists(id) on delete set null,
  date date not null,
  time text not null,
  notes text,
  status text not null default 'pending' check (status in ('pending','confirmed','completed','cancelled')),
  created_at timestamptz not null default now()
);
grant insert on public.appointments to anon, authenticated;
grant select, update, delete on public.appointments to authenticated;
grant all on public.appointments to service_role;
alter table public.appointments enable row level security;
create policy "appointments public insert" on public.appointments for insert to anon, authenticated with check (true);
create policy "appointments admin read" on public.appointments for select to authenticated using (public.is_admin(auth.uid()));
create policy "appointments admin write" on public.appointments for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ COURSES ============
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  duration text,
  fee numeric(10,2),
  description text,
  curriculum jsonb default '[]'::jsonb,
  image_url text,
  certification text,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz not null default now()
);
grant select on public.courses to anon, authenticated;
grant all on public.courses to authenticated, service_role;
alter table public.courses enable row level security;
create policy "courses public read" on public.courses for select using (true);
create policy "courses admin write" on public.courses for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));

-- ============ COURSE ENROLLMENTS ============
create table public.course_enrollments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  course_id uuid references public.courses(id) on delete set null,
  preferred_batch text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','enrolled','closed')),
  created_at timestamptz not null default now()
);
grant insert on public.course_enrollments to anon, authenticated;
grant select, update, delete on public.course_enrollments to authenticated;
grant all on public.course_enrollments to service_role;
alter table public.course_enrollments enable row level security;
create policy "enrollments public insert" on public.course_enrollments for insert to anon, authenticated with check (true);
create policy "enrollments admin read" on public.course_enrollments for select to authenticated using (public.is_admin(auth.uid()));
create policy "enrollments admin write" on public.course_enrollments for all to authenticated
  using (public.is_admin(auth.uid())) with check (public.is_admin(auth.uid()));
