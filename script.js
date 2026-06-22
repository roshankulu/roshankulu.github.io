  // ============================================================
  // GRACEFUL FALLBACK for any broken photo path
  // ============================================================
  function handleImgError(img){
    img.onerror = null;
    img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='750'%3E%3Crect width='100%25' height='100%25' fill='%23EFE6D9'/%3E%3Ctext x='50%25' y='50%25' font-family='Georgia,serif' font-size='22' font-style='italic' fill='%235C1A26' text-anchor='middle' dy='.3em'%3Ea memory%3C/text%3E%3C/svg%3E";
  }

  // ============================================================
  // COUNTDOWN — edit TARGET_DATE. This now runs on the very first
  // page. Once it hits zero, the ticking clock hides and the
  // "Lali" + greeting + Begin button fade in — only triggered once.
  // ============================================================
  const TARGET_DATE = new Date("2026-08-15T00:00:00");
  let countdownArrivedTriggered = false;

  function showCountdownArrived(){
    if(countdownArrivedTriggered) return;
    countdownArrivedTriggered = true;
    const ticking = document.getElementById('countdownTicking');
    const arrived = document.getElementById('countdownArrived');
    if(ticking) ticking.classList.add('hide');
    if(arrived) arrived.classList.add('show');
  }

  function updateCountdown(){
    const now = new Date();
    const diff = TARGET_DATE - now;
    if(diff <= 0){ showCountdownArrived(); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const pad = n => String(n).padStart(2,'0');
    document.getElementById('cd-days').textContent = pad(d);
    document.getElementById('cd-hours').textContent = pad(h);
    document.getElementById('cd-mins').textContent = pad(m);
    document.getElementById('cd-secs').textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ============================================================
  // TESTING ONLY — see matching removal note in index.html and
  // style.css. Delete this whole block, plus the button and its
  // CSS, before sending the real link to Lali.
  // ============================================================
  (function wirePreviewSkip(){
    const btn = document.getElementById('previewSkipBtn');
    if(!btn) return;
    btn.addEventListener('click', () => showCountdownArrived());
  })();

  // ============================================================
  // LETTER — word by word, built once when its page is first shown
  // ============================================================
  const LETTER_TEXT = "I don't think I've ever said this exactly right, so let me try again, slower this time. You make ordinary days feel like they're worth remembering. I notice it in small moments — the way you laugh at your own jokes before you finish telling them, the way you fall asleep mid-sentence, the way you somehow make me feel like the lucky one every single day. I am. I love the version of life we're building, one quiet, unremarkable, completely extraordinary day at a time. Happy birthday, Lali. I'm so glad I get to know you.";

  function buildLetter(){
    const letterBody = document.getElementById('letterBody');
    if(letterBody.dataset.built) return;
    letterBody.dataset.built = 'true';
    const letterSign = document.getElementById('letterSign');
    const wordsContinue = document.getElementById('wordsContinue');
    const words = LETTER_TEXT.split(' ');
    const spans = [];
    words.forEach((word) => {
      const span = document.createElement('span');
      span.className = 'letter-word';
      span.textContent = word;
      letterBody.appendChild(span);
      spans.push(span);
    });
    // Reveal each word by explicitly toggling a class on a timer,
    // rather than relying on CSS animation-delay across ~90 elements
    // at once — some mobile browsers fail to resolve every staggered
    // filter animation correctly when there are this many running
    // concurrently, leaving some words permanently blurred. Setting
    // the final state directly in JS guarantees every word clears.
    spans.forEach((span, i) => {
      setTimeout(() => { span.classList.add('show'); }, i * 80);
    });
    const totalDelay = words.length * 80 + 500;
    setTimeout(() => {
      letterSign.classList.add('show');
      wordsContinue.classList.add('show');
    }, totalDelay);
  }

  // ============================================================
  // STORY — tap each chapter to reveal; Continue appears once
  // all 5 are revealed
  // ============================================================
  (function wireChapters(){
    const chapters = Array.from(document.querySelectorAll('[data-chapter]'));
    const storyContinue = document.getElementById('storyContinue');
    function checkAllRevealed(){
      const allDone = chapters.every(c => c.classList.contains('revealed'));
      if(allDone) storyContinue.classList.add('show');
    }
    chapters.forEach(ch => {
      ch.addEventListener('click', () => {
        if(ch.classList.contains('revealed')) return;
        ch.classList.add('revealed');
        checkAllRevealed();
      });
    });
  })();

  // ============================================================
  // PROOF — tap each photo to reveal; Continue appears once
  // all 3 are unlocked
  // ============================================================
  (function wirePhotos(){
    const frames = Array.from(document.querySelectorAll('[data-photo]'));
    const proofContinue = document.getElementById('proofContinue');
    function checkAllUnlocked(){
      const allDone = frames.every(f => f.classList.contains('unlocked'));
      if(allDone) proofContinue.classList.add('show');
    }
    frames.forEach(frame => {
      frame.addEventListener('click', () => {
        if(frame.classList.contains('unlocked')) return;
        frame.classList.add('unlocked');
        checkAllUnlocked();
      });
    });
  })();

  // ============================================================
  // ENVELOPE — signature interaction, the final page has no
  // Continue button since it's the end
  // ============================================================
  (function wireEnvelope(){
    const envelope = document.getElementById('envelope');
    const giftFinal = document.getElementById('giftFinal');
    const giftInstruction = document.getElementById('giftInstruction');
    let opened = false;
    envelope.addEventListener('click', () => {
      if(opened) return;
      opened = true;
      envelope.classList.add('open');
      giftInstruction.classList.add('fade');
      setTimeout(() => giftFinal.classList.add('show'), 500);
    });
  })();

  // ============================================================
  // PAGE CONTROLLER — she taps "Continue" to move forward.
  // Nothing advances on its own. Pages fade/blur in on arrival.
  // ============================================================
  const pages = Array.from(document.querySelectorAll('.page'));
  const navDots = document.getElementById('navDots');
  pages.forEach(() => navDots.appendChild(Object.assign(document.createElement('div'), {className:'nav-dot'})));

  function setActiveDot(i){
    Array.from(navDots.children).forEach((d, idx) => d.classList.toggle('active', idx === i));
  }

  let currentIndex = -1;

  function goToPage(index){
    if(index >= pages.length || index < 0) return;
    if(currentIndex >= 0) pages[currentIndex].classList.remove('active');
    currentIndex = index;
    const page = pages[currentIndex];
    page.classList.add('active');
    page.scrollTop = 0;
    setActiveDot(currentIndex);
    if(page.id === 'page-words') buildLetter();
  }

  // ============================================================
  // MUSIC — song.mp3 sits in the same folder as this index.html.
  // It starts the moment she taps "Begin" on the very first page,
  // fading in gently, and plays continuously through the rest of
  // the site (it is never paused or restarted on later pages).
  // If playback fails for any reason (autoplay block, missing
  // file, format issue), it logs the reason to the console instead
  // of failing completely silently, so it's possible to diagnose.
  // ============================================================
  const Music = (function(){
    let audioEl = null;
    let fadeTimer = null;
    function getAudio(){
      if(!audioEl) audioEl = document.getElementById('bgSong');
      return audioEl;
    }
    return {
      play(){
        const a = getAudio();
        if(!a){ console.warn('Music.play(): #bgSong element not found'); return; }
        a.volume = 0;
        a.currentTime = 0;
        const playPromise = a.play();
        if(playPromise && playPromise.catch){
          playPromise.catch(err => {
            console.warn('Music.play(): playback was blocked or failed —', err.message || err);
          });
        }
        const targetVolume = 0.7;
        const steps = 24;
        const stepTime = 60; // ms — ~1.4s total fade-in
        let i = 0;
        if(fadeTimer) clearInterval(fadeTimer);
        fadeTimer = setInterval(() => {
          i++;
          a.volume = Math.min(targetVolume, (targetVolume * i) / steps);
          if(i >= steps) clearInterval(fadeTimer);
        }, stepTime);
      },
      stop(){
        const a = getAudio();
        if(!a) return;
        if(fadeTimer) clearInterval(fadeTimer);
        a.pause();
      }
    };
  })();

  // ============================================================
  // AMBIENT DEBRIS — soft hearts and gold flecks drifting up the
  // door page now and then. Lightweight, capped, self-cleaning.
  // ============================================================
  (function wireDebris(){
    const field = document.getElementById('debrisField');
    if(!field) return;
    const HEART_PATH = "M12 21s-7.5-4.7-10-9.3C.3 8.4 2 4.5 6 4c2.4-.3 4.4 1 6 3.4C13.6 5 15.6 3.7 18 4c4 .5 5.7 4.4 4 7.7-2.5 4.6-10 9.3-10 9.3z";
    let activeCount = 0;
    const MAX_ACTIVE = 7;

    function spawn(){
      if(activeCount >= MAX_ACTIVE) return;
      const isHeart = Math.random() > 0.4;
      const size = 10 + Math.random() * 12;
      const left = 4 + Math.random() * 92;
      const duration = 9 + Math.random() * 7;
      const drift = (Math.random() * 60 - 30) + 'px';
      const spin = (Math.random() * 50 - 25) + 'deg';

      const el = document.createElement('div');
      el.className = 'debris-piece ' + (isHeart ? 'heart' : 'gold');
      el.style.left = left + '%';
      el.style.setProperty('--drift', drift);
      el.style.setProperty('--spin', spin);
      el.style.animationDuration = duration + 's';

      if(isHeart){
        el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="${HEART_PATH}"/></svg>`;
      } else {
        el.innerHTML = `<svg width="${size*0.55}" height="${size*0.55}" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="currentColor"/></svg>`;
      }

      field.appendChild(el);
      activeCount++;
      setTimeout(() => { el.remove(); activeCount--; }, duration * 1000 + 200);
    }

    // gentle, irregular timing — never a busy effect
    function scheduleNext(){
      const wait = 2200 + Math.random() * 2600;
      setTimeout(() => { spawn(); scheduleNext(); }, wait);
    }
    spawn();
    scheduleNext();
  })();

  // ============================================================
  // COUNTDOWN ARRIVED — the Begin button that appears once the
  // timer hits zero. This is now the very first tap on the whole
  // site, so the song starts here.
  // ============================================================
  (function wireCountdownBegin(){
    const btn = document.getElementById('countdownBeginBtn');
    if(!btn) return;
    btn.addEventListener('click', () => {
      Music.play(); // the song starts here and plays through the whole site
      goToPage(currentIndex + 1);
    });
  })();

  // ============================================================
  // DOOR — two-stage reveal. Only "Begin" shows at first; tapping
  // it hides the begin stage and reveals the rest, with her name
  // popping in as the centerpiece.
  // ============================================================
  (function wireDoor(){
    const beginBtn = document.getElementById('beginBtn');
    const beginStage = document.getElementById('beginStage');
    const doorReveal = document.getElementById('doorReveal');
    beginBtn.addEventListener('click', () => {
      beginStage.classList.add('hide');
      doorReveal.classList.add('show');
    });
  })();

  // wire every Continue button found, regardless of which page it's in
  document.querySelectorAll('[data-continue]').forEach(btn => {
    btn.addEventListener('click', () => {
      goToPage(currentIndex + 1);
    });
  });

  goToPage(0);

