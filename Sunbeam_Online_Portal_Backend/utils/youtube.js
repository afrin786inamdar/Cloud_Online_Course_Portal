function toEmbedUrl(url) {
  if (!url) return '';

  // Already embed
  if (url.includes('youtube.com/embed/')) {
    return url;
  }

  // youtu.be/VIDEO_ID
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // youtube.com/watch?v=VIDEO_ID
  if (url.includes('watch?v=')) {
    const id = url.split('watch?v=')[1].split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // youtube.com/shorts/VIDEO_ID
  if (url.includes('youtube.com/shorts/')) {
    const id = url.split('shorts/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url; // fallback
}

module.exports = { toEmbedUrl };
