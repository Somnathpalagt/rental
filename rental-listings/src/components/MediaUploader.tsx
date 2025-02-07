async function handleUpload() {
  setUploading(true);
  const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'video/mp4'];

  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      toast.error(`${file.name} is not allowed`);
      setUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB Limit
      toast.error(`${file.name} is too large`);
      setUploading(false);
      return;
    }

    const filePath = `listings/${listingId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('listing-media').upload(filePath, file);

    if (error) {
      toast.error(`Error uploading ${file.name}`);
    } else {
      const { data: urlData } = await supabase.storage.from('listing-media').getPublicUrl(filePath);
      uploadedUrls.push(urlData.publicUrl);
    }
  }

  setUploading(false);
}
