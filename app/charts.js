// charts.js — hand-drawn canvas charts, no library. Every chart is drawn
// from the household's live numbers, so adding or deleting a transaction
// redraws it.
function setupCanvas(canvas, height) {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth || canvas.parentElement.clientWidth || 320;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  canvas.style.height = height + 'px';
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

// Donut of spending by category. slices: [{label, value, color}]
export function drawDonut(canvas, slices, centerLabel, centerValue) {
  const { ctx, width, height } = setupCanvas(canvas, 220);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = width / 2;
  const cy = height / 2;
  const outer = Math.min(width, height) / 2 - 8;
  const inner = outer * 0.62;
  ctx.clearRect(0, 0, width, height);
  if (!total) {
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fillStyle = '#ece5d3';
    ctx.fill();
  } else {
    let start = -Math.PI / 2;
    for (const s of slices) {
      const sweep = (s.value / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outer, start, start + sweep);
      ctx.closePath();
      ctx.fillStyle = s.color;
      ctx.fill();
      start += sweep;
    }
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }
  ctx.fillStyle = '#22302a';
  ctx.font = '700 22px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(centerValue, cx, cy - 2);
  ctx.fillStyle = '#6b7a70';
  ctx.font = '12px system-ui, sans-serif';
  ctx.fillText(centerLabel, cx, cy + 18);
}

// Grouped bars: income vs spending per month.
// rows: [{label, income, spent}]
export function drawTrendBars(canvas, rows) {
  const { ctx, width, height } = setupCanvas(canvas, 240);
  ctx.clearRect(0, 0, width, height);
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent))) * 1.08;
  const padL = 44;
  const padB = 26;
  const padT = 12;
  const plotW = width - padL - 8;
  const plotH = height - padT - padB;
  const groupW = plotW / rows.length;
  const barW = Math.min(26, (groupW - 18) / 2);

  ctx.strokeStyle = '#e5dccb';
  ctx.fillStyle = '#6b7a70';
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const v = (max / 4) * i;
    const y = padT + plotH - (v / max) * plotH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - 8, y);
    ctx.stroke();
    ctx.fillText('$' + Math.round(v / 1000) + 'k', padL - 6, y + 4);
  }

  rows.forEach((r, i) => {
    const gx = padL + i * groupW + groupW / 2;
    const incomeH = (r.income / max) * plotH;
    const spentH = (r.spent / max) * plotH;
    const label = r.label || (r.month ? r.month.split(' ')[0] : '');
    ctx.fillStyle = '#2e6b4f';
    ctx.fillRect(gx - barW - 2, padT + plotH - incomeH, barW, incomeH);
    ctx.fillStyle = '#c96f3f';
    ctx.fillRect(gx + 2, padT + plotH - spentH, barW, spentH);
    ctx.fillStyle = '#22302a';
    ctx.textAlign = 'center';
    ctx.fillText(label, gx, height - 8);
  });
}

// Horizontal bars for the reports page: one row per category.
export function drawCategoryBars(canvas, rows) {
  const rowH = 34;
  const { ctx, width, height } = setupCanvas(canvas, rows.length * rowH + 8);
  ctx.clearRect(0, 0, width, height);
  const max = Math.max(...rows.map((r) => r.spent), 1);
  const labelW = 108;
  const valueW = 64;
  const barX = labelW;
  const barW = width - labelW - valueW - 8;
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    ctx.fillStyle = '#22302a';
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(r.label, 0, y + 14);
    ctx.fillStyle = '#ece5d3';
    ctx.fillRect(barX, y, barW, 16);
    ctx.fillStyle = r.color;
    ctx.fillRect(barX, y, Math.max(2, (r.spent / max) * barW), 16);
    ctx.fillStyle = '#22302a';
    ctx.textAlign = 'right';
    ctx.fillText('$' + Math.round(r.spent), width - 4, y + 14);
  });
}
