-- 난방 마스터 기존 정적 게시글 8개를 관리자 CMS로 이전
-- Supabase > SQL Editor > New query에서 전체 실행하세요.
-- 다시 실행해도 중복 생성되지 않습니다.

begin;

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '11111111-1111-4111-8111-111111111101'::uuid,
  'excavation',
  '실내 바닥 홈파기 시공',
  '배관 매립을 위한 바닥 절삭 작업',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '배관 매립을 위한 바닥 절삭 작업',
  true,
  '2026-01-08T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '11111111-1111-4111-8111-111111111101'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '11111111-1111-4111-8111-111111111101'::uuid,
  'https://nbmaster.co.kr/images/portfolio/excavation-01.jpg',
  'legacy:excavation-01:excavation-01.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '11111111-1111-4111-8111-111111111101'::uuid,
  'https://nbmaster.co.kr/images/portfolio/excavation-02.jpg',
  'legacy:excavation-01:excavation-02.jpg',
  1
);

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '11111111-1111-4111-8111-111111111102'::uuid,
  'excavation',
  '홈파기 후 바닥 미장',
  '배관 공정 후 바닥면 정리 및 마감 준비',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '배관 공정 후 바닥면 정리 및 마감 준비',
  true,
  '2026-01-07T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '11111111-1111-4111-8111-111111111102'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '11111111-1111-4111-8111-111111111102'::uuid,
  'https://nbmaster.co.kr/images/portfolio/excavation-02.jpg',
  'legacy:excavation-02:excavation-02.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '11111111-1111-4111-8111-111111111102'::uuid,
  'https://nbmaster.co.kr/images/portfolio/excavation-01.jpg',
  'legacy:excavation-02:excavation-01.jpg',
  1
);

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '22222222-2222-4222-8222-222222222201'::uuid,
  'heating',
  '바닥 난방배관 시공',
  '단열재 위 난방배관 배치 및 고정',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '단열재 위 난방배관 배치 및 고정',
  true,
  '2026-01-06T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '22222222-2222-4222-8222-222222222201'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '22222222-2222-4222-8222-222222222201'::uuid,
  'https://nbmaster.co.kr/images/portfolio/heating-01.jpg',
  'legacy:heating-01:heating-01.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '22222222-2222-4222-8222-222222222201'::uuid,
  'https://nbmaster.co.kr/images/portfolio/heating-02.jpg',
  'legacy:heating-01:heating-02.jpg',
  1
);

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '22222222-2222-4222-8222-222222222202'::uuid,
  'heating',
  '난방 분배기 및 배관 연결',
  '분배기 설치와 난방배관 연결 작업',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '분배기 설치와 난방배관 연결 작업',
  true,
  '2026-01-05T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '22222222-2222-4222-8222-222222222202'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '22222222-2222-4222-8222-222222222202'::uuid,
  'https://nbmaster.co.kr/images/portfolio/heating-02.jpg',
  'legacy:heating-02:heating-02.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '22222222-2222-4222-8222-222222222202'::uuid,
  'https://nbmaster.co.kr/images/portfolio/heating-01.jpg',
  'legacy:heating-02:heating-01.jpg',
  1
);

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '33333333-3333-4333-8333-333333333301'::uuid,
  'plumbing',
  '수도배관 인입부 시공',
  '벽체 수도배관 인입 및 연결 준비',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '벽체 수도배관 인입 및 연결 준비',
  true,
  '2026-01-04T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '33333333-3333-4333-8333-333333333301'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '33333333-3333-4333-8333-333333333301'::uuid,
  'https://nbmaster.co.kr/images/portfolio/plumbing-01.jpg',
  'legacy:plumbing-01:plumbing-01.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '33333333-3333-4333-8333-333333333301'::uuid,
  'https://nbmaster.co.kr/images/portfolio/plumbing-02.jpg',
  'legacy:plumbing-01:plumbing-02.jpg',
  1
);

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '33333333-3333-4333-8333-333333333302'::uuid,
  'plumbing',
  '바닥 수도배관 홈파기',
  '벽체와 바닥을 연결하는 배관 통로 시공',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '벽체와 바닥을 연결하는 배관 통로 시공',
  true,
  '2026-01-03T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '33333333-3333-4333-8333-333333333302'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '33333333-3333-4333-8333-333333333302'::uuid,
  'https://nbmaster.co.kr/images/portfolio/plumbing-02.jpg',
  'legacy:plumbing-02:plumbing-02.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '33333333-3333-4333-8333-333333333302'::uuid,
  'https://nbmaster.co.kr/images/portfolio/plumbing-01.jpg',
  'legacy:plumbing-02:plumbing-01.jpg',
  1
);

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '44444444-4444-4444-8444-444444444401'::uuid,
  'leak',
  '노후 분배기 누수 점검',
  '노후 밸브와 배관 연결부 상태 점검',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '노후 밸브와 배관 연결부 상태 점검',
  true,
  '2026-01-02T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '44444444-4444-4444-8444-444444444401'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '44444444-4444-4444-8444-444444444401'::uuid,
  'https://nbmaster.co.kr/images/portfolio/leak-01.jpg',
  'legacy:leak-01:leak-01.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '44444444-4444-4444-8444-444444444401'::uuid,
  'https://nbmaster.co.kr/images/portfolio/leak-02.jpg',
  'legacy:leak-01:leak-02.jpg',
  1
);

insert into public.projects
(id, category, title, summary, description, region, work_details, is_published, created_at, updated_at)
values (
  '44444444-4444-4444-8444-444444444402'::uuid,
  'leak',
  '분배기 교체 후 누수 점검',
  '신규 분배기 설치 후 연결부 확인',
  '현장 구조와 기존 설비 상태를 확인한 뒤 필요한 시공 범위를 정하고 작업했습니다. 난방 마스터는 공정 전후 상태를 꼼꼼하게 확인하고 다음 공정이 원활하도록 현장을 정리합니다.',
  '서울 · 인천 · 경기',
  '신규 분배기 설치 후 연결부 확인',
  true,
  '2026-01-01T09:00:00+09:00'::timestamptz,
  now()
)
on conflict (id) do update set
  category = excluded.category,
  title = excluded.title,
  summary = excluded.summary,
  description = excluded.description,
  region = excluded.region,
  work_details = excluded.work_details,
  is_published = excluded.is_published,
  updated_at = now();

delete from public.project_images where project_id = '44444444-4444-4444-8444-444444444402'::uuid;

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '44444444-4444-4444-8444-444444444402'::uuid,
  'https://nbmaster.co.kr/images/portfolio/leak-02.jpg',
  'legacy:leak-02:leak-02.jpg',
  0
);

insert into public.project_images
(project_id, image_url, storage_path, sort_order)
values (
  '44444444-4444-4444-8444-444444444402'::uuid,
  'https://nbmaster.co.kr/images/portfolio/leak-01.jpg',
  'legacy:leak-02:leak-01.jpg',
  1
);

commit;
