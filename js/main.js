// D-Day 카운트다운
const EVENT_DATE = new Date('2026-07-26T11:30:00+09:00');
const ddayEl = document.getElementById('dday');

function updateDday() {
  if (!ddayEl) return;
  const now = new Date();
  const diffDays = Math.ceil((EVENT_DATE - now) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    ddayEl.textContent = `D-${diffDays}`;
  } else if (diffDays === 0) {
    ddayEl.textContent = 'D-DAY';
  } else {
    ddayEl.textContent = '함께해주셔서 감사합니다';
  }
}

updateDday();

// 스크롤 시 섹션 페이드인
const fadeTargets = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  fadeTargets.forEach((el) => observer.observe(el));
} else {
  fadeTargets.forEach((el) => el.classList.add('is-visible'));
}

// 카카오톡 공유하기
const kakaoShareBtn = document.getElementById('kakaoShareBtn');
const toast = document.getElementById('copyToast');

async function copyLinkFallback() {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (err) {
    const temp = document.createElement('input');
    document.body.appendChild(temp);
    temp.value = window.location.href;
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }
  toast.textContent = '카카오톡 공유가 안 돼서 링크를 복사했어요';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

if (kakaoShareBtn) {
  kakaoShareBtn.addEventListener('click', () => {
    if (!window.Kakao) {
      copyLinkFallback();
      return;
    }
    if (!Kakao.isInitialized()) {
      Kakao.init('4106a0380955fcdabeb1ce286505c735');
    }
    try {
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: '김태율의 첫돌 초대장',
          description: '2026년 7월 26일 (일) 오전 11:30 · 쎄쎄쎄 송도점',
          imageUrl: new URL('images/001.jpg', window.location.href).href,
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '초대장 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } catch (err) {
      copyLinkFallback();
    }
  });
}

// 갤러리 사진 라이트박스 (좌우 화살표로 넘기기)
// 라이트박스는 전체 사진(큰 이미지·마퀴와 동일한 세트)을 탐색하고,
// 그리드는 그중 앞 6장만 클릭 진입점으로 사용
const lightboxItems = [...document.querySelectorAll('.gallery-featured .featured-page')];
const gridClickItems = [...document.querySelectorAll('.gallery-grid .gallery-item')];
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let lightboxIndex = 0;

function updateLightbox() {
  const img = lightboxItems[lightboxIndex].querySelector('img');
  if (img) {
    lightboxImage.src = img.src;
    lightboxImage.alt = img.alt;
  }
}

function openLightbox(index) {
  lightboxIndex = index;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
}

function showPrevPhoto() {
  lightboxIndex = (lightboxIndex - 1 + lightboxItems.length) % lightboxItems.length;
  updateLightbox();
}

function showNextPhoto() {
  lightboxIndex = (lightboxIndex + 1) % lightboxItems.length;
  updateLightbox();
}

if (lightbox && lightboxItems.length > 0) {
  gridClickItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', showPrevPhoto);
  lightboxNext.addEventListener('click', showNextPhoto);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrevPhoto();
    if (e.key === 'ArrowRight') showNextPhoto();
  });

  // 스와이프로 넘기기
  let touchStartX = null;
  let touchStartY = null;

  lightbox.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }, { passive: true });

  lightbox.addEventListener('touchmove', (e) => {
    if (touchStartX === null) return;
    e.preventDefault();
  }, { passive: false });

  lightbox.addEventListener('touchend', (e) => {
    if (touchStartX === null) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    touchStartX = null;
    touchStartY = null;

    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) {
      showNextPhoto();
    } else {
      showPrevPhoto();
    }
  }, { passive: true });
}

// 대형 사진 책장 넘김 자동 전환 (테마 6)
const featuredPages = document.querySelectorAll('.featured-page');
if (featuredPages.length > 0) {
  let featuredIndex = 0;
  featuredPages[0].classList.add('is-active');
  setInterval(() => {
    featuredPages[featuredIndex].classList.remove('is-active');
    featuredIndex = (featuredIndex + 1) % featuredPages.length;
    featuredPages[featuredIndex].classList.add('is-active');
  }, 3600);
}

// 카카오맵 (쎄쎄쎄 송도점)
const VENUE_LAT = 37.3891411;
const VENUE_LNG = 126.6444397;

if (window.kakao && window.kakao.maps) {
  kakao.maps.load(() => {
    const container = document.getElementById('map');
    const center = new kakao.maps.LatLng(VENUE_LAT, VENUE_LNG);
    const map = new kakao.maps.Map(container, { center, level: 3 });
    new kakao.maps.Marker({ position: center, map });
  });
}

// 테마 스위처
const THEMES = ['theme-1', 'theme-2', 'theme-3', 'theme-4', 'theme-5', 'theme-6', 'theme-7'];
const THEME_STORAGE_KEY = 'doljanchi-theme';

function updateActiveThemeOption(themeId) {
  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.classList.toggle('is-active', btn.dataset.themeId === themeId);
  });
}

function applyTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);
  updateActiveThemeOption(themeId);
}

const themeSwitcher = document.getElementById('themeSwitcher');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const themePanel = document.getElementById('themePanel');

if (themeSwitcher && themeToggleBtn && themePanel) {
  themeToggleBtn.addEventListener('click', () => {
    themePanel.hidden = !themePanel.hidden;
  });

  document.addEventListener('click', (e) => {
    if (!themeSwitcher.contains(e.target)) {
      themePanel.hidden = true;
    }
  });

  document.querySelectorAll('.theme-option').forEach((btn) => {
    btn.addEventListener('click', () => {
      const themeId = btn.dataset.themeId;
      try {
        localStorage.setItem(THEME_STORAGE_KEY, themeId);
      } catch (e) {}
      applyTheme(themeId);
      themePanel.hidden = true;
    });
  });

  const randomModeBtn = document.getElementById('randomModeBtn');
  if (randomModeBtn) {
    randomModeBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } catch (e) {}
      const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
      applyTheme(randomTheme);
      themePanel.hidden = true;
    });
  }

  const currentTheme = document.documentElement.getAttribute('data-theme');
  updateActiveThemeOption(currentTheme);
}
