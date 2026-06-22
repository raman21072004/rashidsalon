
create policy "public read images" on storage.objects for select using (
  bucket_id in ('gallery-images','stylist-images','service-images','course-images','website-assets')
);
create policy "admin upload images" on storage.objects for insert to authenticated with check (
  bucket_id in ('gallery-images','stylist-images','service-images','course-images','website-assets')
  and public.is_admin(auth.uid())
);
create policy "admin update images" on storage.objects for update to authenticated using (
  bucket_id in ('gallery-images','stylist-images','service-images','course-images','website-assets')
  and public.is_admin(auth.uid())
);
create policy "admin delete images" on storage.objects for delete to authenticated using (
  bucket_id in ('gallery-images','stylist-images','service-images','course-images','website-assets')
  and public.is_admin(auth.uid())
);
