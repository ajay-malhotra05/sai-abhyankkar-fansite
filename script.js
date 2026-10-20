// Track and video content used by the carousels.
const TRACKS = [
  { id: "aasa-kooda", title: "AASA KOODA", artist: "SD RECORDS", year: "2026", cover: "./Songs/AASA KOODA.png", bg: "./Songs/AASA KOODA.png", audioFreq: 420 },
  { id: "katchi-sera", title: "KATCHI SERA", artist: "SD RECORDS", year: "2026", cover: "./Songs/KATCHI SERA.webp", bg: "./Songs/KATCHI SERA.webp", audioFreq: 360 },
  { id: "pavazha-malli", title: "PAVAZHA MALLI", artist: "SD RECORDS", year: "2026", cover: "./Songs/PAVAZHA MALLI.jpg", bg: "./Songs/PAVAZHA MALLI.jpg", audioFreq: 300 },
  { id: "sithira-puthiri", title: "SITHIRA PUTHIRI", artist: "SD RECORDS", year: "2026", cover: "./Songs/SITHIRA PUTHIRI.png", bg: "./Songs/SITHIRA PUTHIRI.png", audioFreq: 380 },
  { id: "vizhi-veekura", title: "VIZHI VEEKURA", artist: "SD RECORDS", year: "2026", cover: "./Songs/VIZHI VEEKURA.jpeg", bg: "./Songs/VIZHI VEEKURA.jpeg", audioFreq: 410 }
];

const VIDEOS = [
  { id: "v1", number: "01", title: "BLACK DESERT", subtitle: "BLACK DESERT - SERHAT DURMUS, RONALDINHO GAÚCHO, TU MUSICA", image: "./THUMBNAIL/AASA KOODA THUBNAIL.jpg", youtubeId: "dQw4w9WgXcQ" },
  { id: "v2", number: "02", title: "LEKE", subtitle: "LEKE - AFRA & SERHAT DURMUS (OFFICIAL MUSIC VIDEO)", image: "./THUMBNAIL/KATCHI SERA THUBNAIL.jpg", youtubeId: "dQw4w9WgXcQ" },
  { id: "v3", number: "03", title: "YAK", subtitle: "SERHAT DURMUS & LAARA - YAK", image: "./THUMBNAIL/PAVAZHA MALLI THUBNAIL.jpg", youtubeId: "dQw4w9WgXcQ" },
  { id: "v4", number: "04", title: "THRACE", subtitle: "THRACE - SERHAT DURMUS (SPECIAL EDITION PERFORMANCE)", image: "./THUMBNAIL/SITHIRA PUTHIRI THUBNAIL.jpg", youtubeId: "dQw4w9WgXcQ" },
  { id: "v5", number: "05", title: "LA CÂLIN", subtitle: "LA CÂLIN - SERHAT DURMUS (VIRAL VERSION)", image: "./THUMBNAIL/VIZHI VEEKURA THUBNAIL.jpg", youtubeId: "dQw4w9WgXcQ" },
  { id: "v6", number: "06", title: "MY FEELINGS", subtitle: "MY FEELINGS - SERHAT DURMUS (ORIGINAL MIX)", image: "./THUMBNAIL/AASA KOODA THUBNAIL.jpg", youtubeId: "dQw4w9WgXcQ" },
  { id: "v7", number: "07", title: "ARRES", subtitle: "ARRES - SERHAT DURMUS (ALBUM TITULAR TRACK)", image: "./THUMBNAIL/KATCHI SERA THUBNAIL.jpg", youtubeId: "dQw4w9WgXcQ" }
];

// Shared page state.
let activeTrackIndex = 0;
let activeVideoIndex = 0;
let trackTimer;
let videoTimer;
let trackIsHovered = false;
let videoIsHovered = false;
let currentAudio = null;
let audioContext;
let lastFocusedElement;

const tracksCarousel = document.querySelector("#tracks-carousel");
const tracksCards = document.querySelector("#tracks-cards");
const videosCarousel = document.querySelector("#videos-carousel");
const videosCards = document.querySelector("#videos-cards");
const subscribeModal = document.querySelector("#subscribe-modal");
const videoModal = document.querySelector("#video-modal");
const videoFrame = document.querySelector("#video-frame");

function circularOffset(index, activeIndex, length) {
  let offset = (index - activeIndex) % length;
  if (offset > length / 2) offset -= length;
  if (offset < -length / 2) offset += length;
  return offset;
}

function renderTracks() {
  if (!tracksCards) return;
  tracksCards.innerHTML = TRACKS.map((track, index) => {
    const offset = circularOffset(index, activeTrackIndex, TRACKS.length);
    if (Math.abs(offset) > 2) return "";

    const center = offset === 0;
    const scale = center ? 1.05 : Math.abs(offset) === 1 ? 0.78 : 0.58;
    const opacity = center ? 1 : Math.abs(offset) === 1 ? 0.75 : 0.45;
    const translateX = offset * (window.innerWidth < 640 ? 120 : window.innerWidth < 1024 ? 210 : 280);
    const rotateY = offset * -22;
    const centerButton = center
      ? `<button type="button" data-play-track="${index}" class="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-brand-red/90 text-white flex items-center justify-center shadow-[0_0_35px_rgba(255,0,30,0.9)] hover:scale-110 transition-transform z-30 group-hover:bg-brand-red" aria-label="Play ${track.title}">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="translate-x-0.5" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        </button>`
      : "";

    return `<div class="carousel-card absolute transition-all duration-700 ease-out flex items-center justify-center" style="transform:translate3d(${translateX}px,0,0) scale(${scale}) rotateY(${rotateY}deg);opacity:${opacity};z-index:${30 - Math.abs(offset) * 10}">
      <div class="cd-jewel-case w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-xs p-3.5 flex flex-col justify-between overflow-hidden relative group transition-shadow duration-300">
        <div class="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-white/10 to-transparent transform -skew-x-12 opacity-80"></div>
        <div class="absolute top-0 right-0 w-2/3 h-full pointer-events-none z-20 bg-gradient-to-l from-white/10 to-transparent"></div>
        <div class="flex items-center justify-between text-[9px] sm:text-[11px] font-mono tracking-widest text-white/70 uppercase z-10 px-2 pl-4">
          <span class="font-bold">SD RECORDS</span><span class="opacity-60">STEREO / DIGITAL</span>
        </div>
        <div class="relative w-full h-[76%] my-1 flex items-center justify-center overflow-hidden bg-black/60 rounded-xs border border-white/10">
          <div class="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-2xl flex items-center justify-center cd-disc-reflection border border-white/20">
            <img src="${track.cover}" alt="${track.title}" class="w-full h-full object-cover filter brightness-90 opacity-90 contrast-110">
            <div class="absolute inset-0 rounded-full border-[8px] border-black/30 pointer-events-none"></div>
            <div class="absolute inset-3 rounded-full border border-white/20 pointer-events-none"></div>
            <div class="absolute inset-8 rounded-full border border-black/40 pointer-events-none"></div>
            <div class="absolute w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/80 border-2 border-white/40 flex items-center justify-center backdrop-blur-md shadow-inner z-10">
              <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/50 bg-black/90 flex items-center justify-center"><div class="w-3 h-3 sm:w-4 sm:h-4 bg-white/30 rounded-full border border-white/60"></div></div>
            </div>
            ${centerButton}
          </div>
        </div>
        <div class="text-center font-mono text-[9px] tracking-widest text-white/50 z-10 uppercase pl-4">CAT NO. SD-2026-0${track.id.length}</div>
      </div>
    </div>`;
  }).join("");

  const activeTrack = TRACKS[activeTrackIndex];
  document.querySelector("#track-title").textContent = activeTrack.title;
  document.querySelector("#track-background").src = activeTrack.bg;
}

function renderVideos() {
  if (!videosCards) return;
  videosCards.innerHTML = VIDEOS.map((video, index) => {
    const offset = circularOffset(index, activeVideoIndex, VIDEOS.length);
    if (Math.abs(offset) > 2) return "";

    const center = offset === 0;
    const translateX = offset * (window.innerWidth < 640 ? 180 : window.innerWidth < 1024 ? 300 : 440);
    const thumb = index === 0
      ? `<div class="relative w-full h-full bg-gradient-to-r from-neutral-100 via-sky-100 to-sky-200 text-black flex flex-col justify-between p-3 sm:p-5 select-none">
          <div class="flex items-center justify-between z-10">
            <span class="font-display text-2xl sm:text-4xl font-black tracking-tight text-neutral-900 uppercase">CAMISA 10</span>
            <div class="flex items-center gap-2 sm:gap-3"><span class="font-mono text-[9px] sm:text-xs font-bold tracking-widest uppercase">tumúsica</span><span class="font-serif italic text-xs sm:text-sm text-neutral-800 font-bold border-b border-black">Ronaldinho 10</span></div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none"><img src="${video.image}" alt="Black Desert Cover" class="w-full h-full object-cover filter brightness-95 contrast-110 opacity-90"></div>
          <div class="relative z-10 mt-auto bg-[#0d0a14] text-white px-3 py-1.5 sm:px-4 sm:py-2 flex items-center justify-between border-t border-white/20">
            <span class="font-display text-xl sm:text-3xl font-black tracking-widest text-white uppercase">BLACK DESERT</span><span class="font-mono text-[9px] sm:text-xs tracking-wider text-white/80 uppercase">⬡ SERHAT DURMUS</span>
          </div>
        </div>`
      : `<img src="${video.image}" alt="${video.title}" class="w-full h-full object-cover filter brightness-90 contrast-110 group-hover:scale-102 transition-transform duration-500">`;

    return `<button type="button" data-video-card="${index}" class="video-card absolute transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer flex flex-col items-center justify-center" style="transform:translate3d(${translateX}px,0,0) scale(${center ? 1 : 0.8});opacity:${center ? 1 : 0.4};filter:blur(${center ? 0 : 2}px);z-index:${30 - Math.abs(offset) * 10}" aria-label="${center ? `Play ${video.title}` : `Select ${video.title}`}">
      <span class="relative block w-[300px] sm:w-[520px] md:w-[660px] aspect-[16/9] bg-neutral-900 group overflow-visible ${center ? "video-glow" : ""}">
        <span class="relative block w-full h-full overflow-hidden border border-white/10 bg-black">${thumb}<span class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none"></span></span>
        ${center ? `<span class="absolute -inset-3 sm:-inset-5 pointer-events-none z-30 transition-all duration-300" aria-hidden="true">
          <span class="absolute top-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-brand-red"></span><span class="absolute top-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-brand-red"></span>
          <span class="absolute bottom-0 left-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-brand-red"></span><span class="absolute bottom-0 right-0 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-brand-red"></span>
        </span>` : ""}
      </span>
    </button>`;
  }).join("");
  document.querySelector("#video-subtitle").textContent = VIDEOS[activeVideoIndex].subtitle;
}

function setTrack(index) {
  activeTrackIndex = (index + TRACKS.length) % TRACKS.length;
  renderTracks();
}

function setVideo(index) {
  activeVideoIndex = (index + VIDEOS.length) % VIDEOS.length;
  renderVideos();
}

// Short synthesized previews matching the original track controls.
async function playTrack(index) {
  const track = TRACKS[index];
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    console.warn("Audio previews are not supported by this browser.");
    return;
  }

  if (!audioContext) audioContext = new AudioContextConstructor();
  if (audioContext.state === "suspended") await audioContext.resume();

  if (currentAudio && currentAudio.index === index) {
    currentAudio.oscillator.stop();
    currentAudio = null;
    return;
  }
  if (currentAudio) {
    currentAudio.oscillator.stop();
    currentAudio = null;
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  const now = audioContext.currentTime;

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(track.audioFreq || 350, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(300, now);
  filter.frequency.exponentialRampToValueAtTime(2800, now + 0.6);
  gain.gain.setValueAtTime(0.25, now);
  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  currentAudio = { index, oscillator };
  oscillator.addEventListener("ended", () => {
    if (currentAudio && currentAudio.oscillator === oscillator) currentAudio = null;
  }, { once: true });
  oscillator.start(now);
  oscillator.stop(now + 4.5);
}

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  const focusTarget = modal.querySelector("button, input");
  if (focusTarget) focusTarget.focus();
}

function closeModal(modal) {
  modal.hidden = true;
  if (modal === videoModal) videoFrame.src = "";
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

function openVideo(video) {
  videoFrame.title = video.title;
  videoFrame.src = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`;
  openModal(videoModal);
}

function setupCarouselDrag(element, move) {
  let startX = null;
  let isDragging = false;
  element.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    startX = event.clientX;
    isDragging = true;
    element.setPointerCapture(event.pointerId);
  });
  element.addEventListener("pointermove", (event) => {
    if (!isDragging || startX === null) return;
    const difference = event.clientX - startX;
    if (Math.abs(difference) > 45) {
      move(difference > 0 ? -1 : 1);
      isDragging = false;
      startX = null;
    }
  });
  const finishDrag = () => {
    isDragging = false;
    startX = null;
  };
  element.addEventListener("pointerup", finishDrag);
  element.addEventListener("pointercancel", finishDrag);
  element.addEventListener("lostpointercapture", finishDrag);
}

function pauseAutoplayOnTouch(element, setPaused) {
  element.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "touch") return;
    setPaused(true);
    startAutoplay();
  });
  ["pointerup", "pointercancel"].forEach((eventName) => {
    element.addEventListener(eventName, (event) => {
      if (event.pointerType !== "touch") return;
      setPaused(false);
      startAutoplay();
    });
  });
}

function startAutoplay() {
  clearInterval(trackTimer);
  clearInterval(videoTimer);
  if (!trackIsHovered) trackTimer = setInterval(() => setTrack(activeTrackIndex + 1), 4500);
  if (!videoIsHovered) videoTimer = setInterval(() => setVideo(activeVideoIndex + 1), 4000);
}

function initializeAnimations() {
  if (window.Lenis) {
    const lenis = new window.Lenis({
      duration: 1.2,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true
    });
    const animateScroll = (time) => {
      lenis.raf(time);
      requestAnimationFrame(animateScroll);
    };
    requestAnimationFrame(animateScroll);
  }

  if (!window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  window.gsap.fromTo(".hero-title-text", { y: 140, opacity: 0, scaleY: 1.4 }, { y: 0, opacity: 1, scaleY: 1.15, duration: 1.5, ease: "power4.out", delay: 0.1 });
  window.gsap.fromTo(".hero-reticle", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1, delay: 0.8, ease: "back.out(1.7)" });
  window.gsap.fromTo(".hero-nav-bar", { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" });
  window.gsap.fromTo(".about-photo-left", { x: -120, opacity: 0, rotate: -18 }, {
    x: 0, opacity: 1, rotate: -7, duration: 1.4, ease: "power3.out",
    scrollTrigger: { trigger: "#about", start: "top 70%" }
  });
  window.gsap.fromTo(".about-photo-right", { x: 120, opacity: 0, rotate: 20 }, {
    x: 0, opacity: 1, rotate: 9, duration: 1.4, ease: "power3.out",
    scrollTrigger: { trigger: "#about", start: "top 70%" }
  });
  window.gsap.fromTo(".about-text-content", { y: 40, opacity: 0 }, {
    y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
    scrollTrigger: { trigger: ".about-text-content", start: "top 85%" }
  });
}

// Bind page controls once the deferred script runs after the document is parsed.
document.querySelectorAll("[data-open-subscribe]").forEach((button) => {
  button.addEventListener("click", () => openModal(subscribeModal));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => closeModal(subscribeModal));
});

document.querySelector("#menu-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const menu = document.querySelector("#site-menu");
  const isOpen = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  button.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  menu.hidden = isOpen;
});

document.querySelectorAll("#site-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#site-menu").hidden = true;
    const menuToggle = document.querySelector("#menu-toggle");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

document.querySelector("[data-track-prev]").addEventListener("click", () => setTrack(activeTrackIndex - 1));
document.querySelector("[data-track-next]").addEventListener("click", () => setTrack(activeTrackIndex + 1));
document.querySelector("[data-video-prev]").addEventListener("click", () => setVideo(activeVideoIndex - 1));
document.querySelector("[data-video-next]").addEventListener("click", () => setVideo(activeVideoIndex + 1));
document.querySelector("#watch-video").addEventListener("click", () => openVideo(VIDEOS[activeVideoIndex]));
document.querySelector("#close-video").addEventListener("click", () => closeModal(videoModal));

tracksCards.addEventListener("click", (event) => {
  const playButton = event.target.closest("[data-play-track]");
  if (playButton) playTrack(Number(playButton.dataset.playTrack));
});

videosCards.addEventListener("click", (event) => {
  const card = event.target.closest("[data-video-card]");
  if (!card) return;
  const index = Number(card.dataset.videoCard);
  if (index !== activeVideoIndex) {
    setVideo(index);
  } else {
    openVideo(VIDEOS[index]);
  }
});

document.querySelector("#subscribe-form").addEventListener("submit", (event) => {
  event.preventDefault();
  closeModal(subscribeModal);
});

[subscribeModal, videoModal].forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!subscribeModal.hidden) closeModal(subscribeModal);
    if (!videoModal.hidden) closeModal(videoModal);
    return;
  }
  if (event.key === "ArrowLeft") setVideo(activeVideoIndex - 1);
  if (event.key === "ArrowRight") setVideo(activeVideoIndex + 1);
});

tracksCarousel.addEventListener("pointerenter", () => {
  trackIsHovered = true;
  startAutoplay();
});
tracksCarousel.addEventListener("pointerleave", () => {
  trackIsHovered = false;
  startAutoplay();
});
videosCarousel.addEventListener("pointerenter", () => {
  videoIsHovered = true;
  startAutoplay();
});
videosCarousel.addEventListener("pointerleave", () => {
  videoIsHovered = false;
  startAutoplay();
});

pauseAutoplayOnTouch(tracksCarousel, (paused) => { trackIsHovered = paused; });
pauseAutoplayOnTouch(videosCarousel, (paused) => { videoIsHovered = paused; });
setupCarouselDrag(tracksCarousel, (direction) => setTrack(activeTrackIndex + direction));
setupCarouselDrag(videosCarousel, (direction) => setVideo(activeVideoIndex + direction));

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    renderTracks();
    renderVideos();
  }, 100);
});

renderTracks();
renderVideos();
startAutoplay();
initializeAnimations();
