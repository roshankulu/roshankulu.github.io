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
  const TARGET_DATE = new Date("2026-07-08T00:00:00");
  let countdownArrivedTriggered = false;
  let firstCheckDone = false;
  let arrivedLate = false;

  const GREETING_ON_TIME = "Zaye Doh Chui Mubarak";
  const GREETING_LATE = " Cxe Chui Addati Late Yun.";

  function showCountdownArrived(){
    if(countdownArrivedTriggered) return;
    countdownArrivedTriggered = true;
    const ticking = document.getElementById('countdownTicking');
    const arrived = document.getElementById('countdownArrived');
    const greeting = document.getElementById('countdownGreeting');
    if(greeting) greeting.textContent = arrivedLate ? GREETING_LATE : GREETING_ON_TIME;
    if(ticking) ticking.classList.add('hide');
    if(arrived) arrived.classList.add('show');
    spawnHeartBurst();
  }

  // ============================================================
  // HEART BURST — a one-time celebration the instant the countdown
  // hits zero. A dozen soft hearts rise and fade around her name.
  // Reuses the same heart shape as the ambient debris elsewhere,
  // so it stays visually consistent with the rest of the site.
  // ============================================================
  function spawnHeartBurst(){
    const field = document.getElementById('burstField');
    if(!field) return;
    const HEART_PATH = "M12 21s-7.5-4.7-10-9.3C.3 8.4 2 4.5 6 4c2.4-.3 4.4 1 6 3.4C13.6 5 15.6 3.7 18 4c4 .5 5.7 4.4 4 7.7-2.5 4.6-10 9.3-10 9.3z";
    const HEART_COUNT = 14;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.42; // roughly where her name sits

    for(let i = 0; i < HEART_COUNT; i++){
      const el = document.createElement('div');
      el.className = 'burst-heart';
      const size = 14 + Math.random() * 14;
      const angle = (Math.random() * Math.PI) - (Math.PI / 2); // upward-biased spread
      const spread = 70 + Math.random() * 90;
      const startX = centerX + Math.cos(angle) * (spread * 0.3);
      const rise = -(120 + Math.random() * 90);
      const drift = (Math.random() * 100 - 50);
      const spin = (Math.random() * 40 - 20);
      const delay = Math.random() * 0.35;
      const duration = 1.6 + Math.random() * 0.8;

      el.style.left = startX + 'px';
      el.style.top = centerY + 'px';
      el.style.setProperty('--burst-rise', rise + 'px');
      el.style.setProperty('--burst-drift', drift + 'px');
      el.style.setProperty('--burst-spin', spin + 'deg');
      el.style.animationDelay = delay + 's';
      el.style.animationDuration = duration + 's';
      el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><path d="${HEART_PATH}"/></svg>`;

      field.appendChild(el);
      setTimeout(() => el.remove(), (delay + duration) * 1000 + 200);
    }
  }

  function updateCountdown(){
    const now = new Date();
    const diff = TARGET_DATE - now;
    if(!firstCheckDone){
      firstCheckDone = true;
      if(diff <= 0) arrivedLate = true;
    }
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
  // THE COUNT — counts UP from roughly when you first knew her,
  // live, continuously. This is the true final page; nothing
  // after it, so there's no "arrived" state to trigger, it just
  // keeps climbing for as long as she stays on the page.
  // ============================================================
  const KNOWN_SINCE_DATE = new Date("2012-06-23T00:00:00");

  function updateCountUp(){
    const now = new Date();
    const diff = now - KNOWN_SINCE_DATE;
    if(diff < 0) return; // safety guard, shouldn't happen
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const pad = n => String(n).padStart(2,'0');
    const ctDays = document.getElementById('ct-days');
    const ctHours = document.getElementById('ct-hours');
    const ctMins = document.getElementById('ct-mins');
    const ctSecs = document.getElementById('ct-secs');
    if(ctDays) ctDays.textContent = d.toLocaleString();
    if(ctHours) ctHours.textContent = pad(h);
    if(ctMins) ctMins.textContent = pad(m);
    if(ctSecs) ctSecs.textContent = pad(s);
  }
  updateCountUp();
  setInterval(updateCountUp, 1000);

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
  const LETTER_TEXT = "If you were actually standing in front of me right now, my mind would probably just freeze. I don't think I'd know where to start, even after everything I've written here. So let me just say the true things, plainly. I love you. Not a little. Not in the easy way people say it. Very much, in the way that's been true since I was a kid watching you like you were just part of how things were, long before I understood why. You could never make me hate you. I don't think that's possible. Even in our hardest stretches, even when you've gone quiet, even when I've messed up and didn't deserve to be forgiven, you still are the person I come back to, every single time. I love the small things most. The way you fall asleep mid-sentence, like the world can just wait. The way ordinary days feel like they're worth remembering, just because you're in them. I made this for you, not because things are perfect right now, but because what I feel doesn't change based on the weather between us. I'm still here. I'm still yours. I don't think that's ever going to change.";

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
  // FOLDED LETTER — two taps before the words ever start typing:
  // 1) tap the folded paper to unfold it
  // 2) tap "begin reading" to actually start the word-by-word reveal
  // This gives The Words page its own distinct ritual, instead of
  // reusing the same tap-to-reveal pattern as the chapters/photos.
  // ============================================================
  (function wireFoldedLetter(){
    const folded = document.getElementById('letterFolded');
    const paper = document.getElementById('letterPaper');
    const readCue = document.getElementById('letterReadCue');
    if(!folded || !paper || !readCue) return;

    folded.addEventListener('click', () => {
      folded.classList.add('hide');
      paper.classList.add('show');
    });

    readCue.addEventListener('click', () => {
      readCue.classList.add('hide');
      buildLetter();
    });
  })();

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
        if(!frame.classList.contains('unlocked')){
          frame.classList.add('unlocked');
          checkAllUnlocked();
        }
        // tilt this one like it was just picked up; every other
        // photo settles back flat, so only one is ever tilted —
        // like a small puzzle, picking up one piece at a time
        const tilt = (Math.random() * 10 - 5).toFixed(1); // -5deg to 5deg
        frames.forEach(f => {
          if(f === frame){
            f.style.setProperty('--photo-tilt', tilt + 'deg');
            f.classList.add('tilted');
          } else {
            f.classList.remove('tilted');
          }
        });
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
    const giftContinue = document.getElementById('giftContinue');
    let opened = false;
    envelope.addEventListener('click', () => {
      if(opened) return;
      opened = true;
      envelope.classList.add('open');
      giftInstruction.classList.add('fade');
      setTimeout(() => {
        giftFinal.classList.add('show');
        if(giftContinue) giftContinue.classList.add('show');
      }, 500);
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
    const HEART_PATH = "M12 21s-7.5-4.7-10-9.3C.3 8.4 2 4.5 6 4c2.4-.3 4.4 1 6 3.4C13.6 5 15.6 3.7 18 4c4 .5 5.7 4.4 4 7.7-2.5 4.6-10 9.3-10 9.3z";

    function startField(fieldId, opts){
      const field = document.getElementById(fieldId);
      if(!field) return;
      const goldOnly = opts && opts.goldOnly;
      let activeCount = 0;
      const MAX_ACTIVE = 7;

      function spawn(){
        if(activeCount >= MAX_ACTIVE) return;
        const isHeart = !goldOnly && Math.random() > 0.4;
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
    }

    // Door page keeps the original heart+gold mix
    startField('debrisField', { goldOnly: false });
    // Story and the final Count page get a quieter, gold-only drift
    startField('debrisFieldStory', { goldOnly: true });
    startField('debrisFieldCount', { goldOnly: true });
  })();

  // ============================================================
  // COUNTDOWN ARRIVED — the Begin button that appears once the
  // timer hits zero. This is now the very first tap on the whole
  // site, so the song starts here.
  // ============================================================
  let musicStarted = false;
  (function wireCountdownBegin(){
    const btn = document.getElementById('countdownBeginBtn');
    const volumeHint = document.getElementById('volumeHint');
    if(!btn) return;
    btn.addEventListener('click', () => {
      if(!musicStarted){
        Music.play(); // starts the song the very first time only
        musicStarted = true;
      }
      if(volumeHint) volumeHint.classList.add('hide');
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

  // ============================================================
  // STORY SCROLL HINT — a bouncing chevron nudges her to scroll for
  // the remaining chapters. Appears when the Story page becomes
  // active, disappears the moment she scrolls or reveals a chapter,
  // and never reappears once dismissed.
  // ============================================================
  (function wireStoryScrollHint(){
    const storyPage = document.getElementById('page-story');
    const hint = document.getElementById('storyScrollHint');
    if(!storyPage || !hint) return;
    let dismissed = false;
    let shown = false;

    function dismiss(){
      if(dismissed) return;
      dismissed = true;
      hint.classList.remove('show');
    }

    storyPage.addEventListener('scroll', dismiss, { passive: true });
    storyPage.querySelectorAll('[data-chapter]').forEach(ch => {
      ch.addEventListener('click', dismiss, { once: true });
    });

    const observer = new MutationObserver(() => {
      if(storyPage.classList.contains('active') && !shown && !dismissed){
        shown = true;
        setTimeout(() => { if(!dismissed) hint.classList.add('show'); }, 500);
      }
    });
    observer.observe(storyPage, { attributes: true, attributeFilter: ['class'] });
  })();

  // wire every Continue button found, regardless of which page it's in
  document.querySelectorAll('[data-continue]').forEach(btn => {
    btn.addEventListener('click', () => {
      goToPage(currentIndex + 1);
    });
  });

  // ============================================================
  // PLAY AGAIN — full reset. Locks every chapter, photo, and the
  // letter back up, closes the envelope, and hides every Continue
  // button that depends on those reveals, then returns to the
  // start so the whole experience can be replayed from scratch
  // without a page refresh.
  // ============================================================
  (function wirePlayAgain(){
    const btn = document.getElementById('playAgainBtn');
    if(!btn) return;

    function resetSite(){
      // Story chapters
      document.querySelectorAll('[data-chapter]').forEach(ch => ch.classList.remove('revealed'));
      const storyContinue = document.getElementById('storyContinue');
      if(storyContinue) storyContinue.classList.remove('show');

      // Proof photos
      document.querySelectorAll('[data-photo]').forEach(f => {
        f.classList.remove('unlocked', 'tilted');
        f.style.removeProperty('--photo-tilt');
      });
      const proofContinue = document.getElementById('proofContinue');
      if(proofContinue) proofContinue.classList.remove('show');

      // Letter — fold it back up, clear the built words so it
      // retypes fresh next time
      const letterFolded = document.getElementById('letterFolded');
      const letterPaper = document.getElementById('letterPaper');
      const letterReadCue = document.getElementById('letterReadCue');
      const letterBody = document.getElementById('letterBody');
      const letterSign = document.getElementById('letterSign');
      const wordsContinue = document.getElementById('wordsContinue');
      if(letterFolded) letterFolded.classList.remove('hide');
      if(letterPaper) letterPaper.classList.remove('show');
      if(letterReadCue) letterReadCue.classList.remove('hide');
      if(letterBody){ letterBody.innerHTML = ''; delete letterBody.dataset.built; }
      if(letterSign) letterSign.classList.remove('show');
      if(wordsContinue) wordsContinue.classList.remove('show');

      // Envelope
      const envelope = document.getElementById('envelope');
      const giftInstruction = document.getElementById('giftInstruction');
      const giftFinal = document.getElementById('giftFinal');
      const giftContinue = document.getElementById('giftContinue');
      if(envelope) envelope.classList.remove('open');
      if(giftInstruction) giftInstruction.classList.remove('fade');
      if(giftFinal) giftFinal.classList.remove('show');
      if(giftContinue) giftContinue.classList.remove('show');

      // Door page — reset the two-stage reveal so "Begin" shows
      // again instead of landing on the already-revealed name
      const beginStage = document.getElementById('beginStage');
      const doorReveal = document.getElementById('doorReveal');
      if(beginStage) beginStage.classList.remove('hide');
      if(doorReveal) doorReveal.classList.remove('show');

      // Envelope click handler uses a closure variable `opened` that
      // we can't reach from here, so re-clone the envelope node to
      // wipe its old listener and re-wire a fresh one.
      if(envelope){
        const clone = envelope.cloneNode(true);
        envelope.parentNode.replaceChild(clone, envelope);
        let opened = false;
        clone.addEventListener('click', () => {
          if(opened) return;
          opened = true;
          clone.classList.add('open');
          giftInstruction.classList.add('fade');
          setTimeout(() => {
            giftFinal.classList.add('show');
            if(giftContinue) giftContinue.classList.add('show');
          }, 500);
        });
      }
    }

    btn.addEventListener('click', () => {
      resetSite();
      Music.stop();
      Music.play();
      goToPage(0);
    });
  })();

  goToPage(0);

