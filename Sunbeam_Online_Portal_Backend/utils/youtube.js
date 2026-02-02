function toEmbedUrl(url) {
  if (!url) return '';

  // already embed
  if (url.includes('youtube.com/embed')) {
    return url;
  }

  // watch?v=
  if (url.includes('watch?v=')) {
    return url.replace('watch?v=', 'embed/').split('&')[0];
  }

  // youtu.be
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

module.exports = { toEmbedUrl };
