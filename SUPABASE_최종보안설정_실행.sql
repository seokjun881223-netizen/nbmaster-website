-- 난방 마스터 비공개 문의게시판 최종 보안 설정
-- Supabase > SQL Editor에 전체 붙여넣고 Run을 한 번만 누르세요.

alter table public.inquiries enable row level security;

drop policy if exists "public can submit inquiries" on public.inquiries;
drop policy if exists "authenticated users can read inquiries" on public.inquiries;
drop policy if exists "authenticated users can update inquiries" on public.inquiries;
drop policy if exists "authenticated users can delete inquiries" on public.inquiries;
drop policy if exists "only nbmaster admin can read inquiries" on public.inquiries;
drop policy if exists "only nbmaster admin can update inquiries" on public.inquiries;
drop policy if exists "only nbmaster admin can delete inquiries" on public.inquiries;

create policy "public can submit inquiries"
on public.inquiries
for insert
to anon
with check (true);

create policy "only nbmaster admin can read inquiries"
on public.inquiries
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'nbmaster1223@naver.com');

create policy "only nbmaster admin can update inquiries"
on public.inquiries
for update
to authenticated
using ((auth.jwt() ->> 'email') = 'nbmaster1223@naver.com')
with check ((auth.jwt() ->> 'email') = 'nbmaster1223@naver.com');

create policy "only nbmaster admin can delete inquiries"
on public.inquiries
for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'nbmaster1223@naver.com');
