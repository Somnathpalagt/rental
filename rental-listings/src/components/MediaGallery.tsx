async function fetchMedia() {
  const { data, error } = await supabase
    .from('listings')
    .select('media')
    .eq('id', listingId)
    .single();

  if (error || !data.media) return;

  const signedUrls = await Promise.all(
    data.media.map(async (path) => {
      const { data } = await supabase.storage.from('listing-media').createSignedUrl(path, 3600);
      return data?.signedUrl;
    })
  );

  setMediaUrls(signedUrls);
}
