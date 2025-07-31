(() => {
 
  const msgDiv = document.createElement('div');
  Object.assign(msgDiv.style, {
    position: 'absolute',
    top: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    color: '#eee',
    fontFamily: 'sans-serif',
    fontSize: '20px',
    zIndex: '10',
  });
  document.body.appendChild(msgDiv);

  const canvas = document.createElement('canvas');
  const W = 500, H = 500;
  canvas.width = W;
  canvas.height = H;
  Object.assign(canvas.style, {
    display: 'block',
    margin: '50px auto',
    background: '#090a12',
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const ringWidth = 4;  // stroke width for both rings

  // --- Game state ---
  let targetRadius;      // goal ring radius
  let shrinkRadius;      // current animated radius
  let shrinking = false; // are we animating?
  let lastTime = 0;
  let speed;             // constant px/ms

  // start a new round
  function newRound() {
    targetRadius   = 20 + Math.random() * 120;      // 30–150px
    const shrinkDuration = 200 + Math.random() * 200; // 800–1200ms
    const delay      = 500 + Math.random() * 1000;  // 0.5–1.5s before start

    shrinking = false;
    msgDiv.textContent = '';
    drawRings();

    setTimeout(() => {
      const startRadius = Math.max(W, H) * 0.6 + targetRadius;
      shrinkRadius = startRadius;
      speed = (startRadius - 0) / shrinkDuration; 
      // shrink all the way to 0 over shrinkDuration ms

      shrinking = true;
      msgDiv.textContent = '';
      lastTime = performance.now();
      requestAnimationFrame(animate);
    }, delay);
  }

  // draw both rings
  function drawRings() {
    ctx.clearRect(0, 0, W, H);

    // target (salmon)
    ctx.strokeStyle = '#f0bbc2';
    ctx.lineWidth   = ringWidth;
    ctx.beginPath();
    ctx.arc(W/2, H/2, targetRadius, 0, Math.PI * 2);
    ctx.stroke();

    // shrinking (baby pink)
    if (shrinking && shrinkRadius > 0) {
      ctx.strokeStyle = '#ff4589';
      ctx.lineWidth   = ringWidth;
      ctx.beginPath();
      ctx.arc(W/2, H/2, shrinkRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  // animation loop
  function animate(now) {
    if (!shrinking) return;
    const dt = now - lastTime;
    lastTime = now;

    // constant-speed shrink toward 0
    shrinkRadius -= speed * dt;

    drawRings();

    if (shrinkRadius <= 0) {
      // completely shrunk past: auto-miss
      shrinking = false;
      msgDiv.textContent = 'Missed! Next round…';
      setTimeout(newRound, 1000);
    } else {
      requestAnimationFrame(animate);
    }
  }

  // spacebar handler
  window.addEventListener('keydown', e => {
    if (e.code === 'Space' && shrinking) {
      shrinking = false;
      const diff = Math.abs(shrinkRadius - targetRadius);

      // any overlap if diff <= ringWidth
      if (diff <= ringWidth) {
        msgDiv.textContent = '🎉 Match! 🎉';
      } else {
        msgDiv.textContent =
          diff < 30
            ? `Close!`
            : `Miss!`;
      }

      setTimeout(newRound, 1500);
    }
  });

  // kickoff
  document.body.style.background = '#222';
  newRound();
})();
