export function getYouTubeID(url: string) {
    if (!url) return null;
    
    // Support various YouTube URL formats:
    // - Standard: youtube.com/watch?v=VIDEO_ID
    // - Shortened: youtu.be/VIDEO_ID
    // - Embed: youtube.com/embed/VIDEO_ID
    // - Shorts: youtube.com/shorts/VIDEO_ID
    // - Live: youtube.com/live/VIDEO_ID
    // - V-link: youtube.com/v/VIDEO_ID
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/|live\/)([^#&?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[1] && match[1].length === 11) {
        return match[1];
    }
    
    // If the input is exactly 11 characters, assume it's already the ID
    const trimmed = url.trim();
    if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        return trimmed;
    }
    
    return null;
}
