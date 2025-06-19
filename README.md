# 🎵 WebMusic – Intelligent Music Streaming Platform

An interactive web application that allows users to search, stream, and control music playback, view artist profiles, and manage queues, using data from YouTube, Spotify, and integrated mailing functionality via Gmail SMTP.

---

## 📘 1. Project Description *(5 pts)*

### ▪️ Topic
Development of a modern audio streaming web platform.

### ▪️ Goal and Expected Outcome
To build a fully functional, responsive, and fast music platform similar to Spotify Lite, enabling users to play tracks, navigate artist pages, manage queues, and receive music metadata dynamically via external APIs.

### ▪️ Main Features
- Audio playback with full controls: play, pause, skip, volume, progress
- Persistent player at the bottom of all pages
- Artist pages with top tracks and albums
- Albums carousel with centered selection
- Integrated queue with interactive modal
- Track streaming via custom YouTube wrapper
- Search via YouTube and Spotify API
- Automatic transition to next song
- SMTP integration via Gmail for user feedback or contact (server-side)

### ▪️ Technologies Used
- React, Vite
- Tailwind CSS
- Axios for HTTP requests
- Node.js + Express (backend)
- YouTube API (via custom search endpoint)
- Spotify API (artist metadata, top tracks, albums)
- Gmail SMTP (nodemailer for feedback or contact feature)
- React Icons / Lucide
- LocalStorage for persistent queue state

### ▪️ How to Run
1. Clone both frontend and backend repositories
   ```bash
   git clone https://github.com/d3zon1x/i-am-webmusic-web.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```
4. Start backend API (`i-am-webmusic-api`):
   ```bash
   uvicorn app.main:app --reload
   ```

---

## 📋 2. Requirements Analysis *(5 pts)*

### ▪️ Functional Requirements
- Stream tracks from YouTube
- Show artist details using Spotify API
- Navigate albums and top tracks
- Play/pause/resume audio globally
- Track queue management
- Send email via SMTP on form submission (optional)

### ▪️ Non-Functional Requirements
- Fast page loading
- Persistent playback between page navigations
- Responsive layout across devices
- Graceful error fallback (e.g. broken thumbnail, empty queue)

### ▪️ UI Overview
- Bottom-fixed audio player
- Left: artist photo, popular tracks
- Right: carousel of albums, tracklist for selected album
- Queue modal with remove/play on hover
- Dark theme with gradient overlays

---

## ⚙️ 3. Implementation *(40 pts)*

### ▪️ Data Structures *(5 pts)*
```js
{
  title: String,
  artist: String,
  url: String,
  videoId: String,
  thumbnail: String,
  duration: String
}
```
Track queue is managed as an array of such objects, stored globally.

### ▪️ Classes and Attribute Access *(5 pts)*
Track attributes are filtered/searched using functions that match `title`, `artist`, `videoId`. Artist albums are mapped via class-based `ArtistPage.jsx`.

### ▪️ API Integration
- `GET /music/search` → YouTube metadata & videoId
- `GET /artist/:name` → Spotify API for top tracks and albums
- `GET /album/:id/tracks` → Spotify album details
- Gmail SMTP via `nodemailer` (backend)

### ▪️ Modular Code *(5 pts)*
- `components/player/` — audio logic
- `components/artist/` — carousel, UI
- `contexts/MusicContext.jsx` — global state
- `lib/axios.js` — API abstraction

### ▪️ Error Handling *(5 pts)*
- Try/catch blocks for async logic
- Broken thumbnails handled via `onError`
- No-crash behavior for undefined track or empty queue

### ▪️ Generators / Comprehensions *(5 pts)*
JS equivalents used:
```js
const formatted = await Promise.all(
  rawTracks.map(async t => {
    const res = await api.get(`/music/search?query=${t.title} ${t.artist}`);
    return formatTrack(res.data[0]);
  })
);
```

### ▪️ Standard Library Element *(5 pts)*
- `localStorage` for queue persistence
- `Date.toISOString().substr(14, 5)` for duration formatting

### ▪️ AI Framework *(5 pts)*
- Spotify API used as intelligent metadata provider (replaces recommendation logic)
- YouTube track matching is a simplified NLP search by fuzzy title + artist

---

## 🧪 4. Testing *(5 pts)*

### ▪️ Unit Tests
- Custom test file for `formatTrack()`, URL generators, queue management

### ▪️ Manual Testing
- Tested queue logic: add/remove, playNext, playPrev
- Verified track loads correctly from search
- Refreshing page maintains track state
- `onEnded` event triggers auto-play of next track

---

## 📌 5. Conclusions *(5 pts)*

### ▪️ Summary
The project successfully replicates core audio streaming behavior in a custom-built UI. Integrating Spotify and YouTube APIs provides rich metadata and streaming capability. Gmail SMTP adds real-world functionality for feedback.

### ▪️ Potential Improvements
- Add shuffle/repeat support
- Support user authentication + playlists
- Add animations (e.g., visualizer)
- Show waveform preview for tracks
- Integrate with more advanced AI (e.g. TensorFlow-based recommender)

---


