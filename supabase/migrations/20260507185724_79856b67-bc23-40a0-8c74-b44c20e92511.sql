
-- fix search_path on set_updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- revoke execute on internal trigger functions
revoke execute on function public.handle_new_user() from anon, authenticated, public;
revoke execute on function public.set_updated_at() from anon, authenticated, public;

-- restrict avatar listing: replace broad SELECT with per-folder
drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_owner_list" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_public_object_read" on storage.objects for select to anon
  using (bucket_id = 'avatars');
