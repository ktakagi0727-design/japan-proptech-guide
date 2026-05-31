const money = (value) => `${Math.round(value).toLocaleString("ja-JP")}万円`;
const percent = (value) => `${value.toFixed(2)}%`;

const bandState = {
  sourceUrl: "",
  sourceType: "",
  sourceIsObjectUrl: false,
  logoUrl: "",
  image: null,
  logo: null
};

const bandPreview = document.querySelector("[data-band-preview]");
const bandFile = document.querySelector("[data-band-file]");
const logoFile = document.querySelector("[data-logo-file]");
const printOutput = document.querySelector("[data-print-output]");
const bandInputs = {
  company: document.querySelector("[data-band-company]"),
  contact: document.querySelector("[data-band-contact]"),
  note: document.querySelector("[data-band-note]"),
  position: document.querySelector("[data-band-position]"),
  color: document.querySelector("[data-band-color]"),
  logoMode: document.querySelector("[data-logo-mode]"),
  logoX: document.querySelector("[data-logo-x]"),
  logoY: document.querySelector("[data-logo-y]"),
  logoWidth: document.querySelector("[data-logo-width]"),
  bandX: document.querySelector("[data-band-x]"),
  bandY: document.querySelector("[data-band-y]"),
  bandWidth: document.querySelector("[data-band-width]"),
  bandHeight: document.querySelector("[data-band-height]"),
  textColor: document.querySelector("[data-band-text-color]")
};
const logoFreeControls = document.querySelector("[data-logo-free-controls]");
const settingsKey = "proptechGuideBandSettings";
const hasBandTool = Boolean(bandPreview && bandFile && logoFile && logoFreeControls && Object.values(bandInputs).every(Boolean));
let logoDragState = null;
let bandDragState = null;
let textDragState = null;
let editingTextKey = null;

const textLayouts = {
  company: { label: "会社情報", x: 18, y: 86.2, width: 44, height: 10, font: 1.5, weight: 700 },
  contact: { label: "担当者情報", x: 18, y: 92.1, width: 44, height: 8, font: 1.5, weight: 600 },
  note: { label: "注意書き", x: 18, y: 96.4, width: 72, height: 5, font: 1.5, weight: 500 }
};

function revokeUrl(url) {
  if (url && url.startsWith("blob:")) URL.revokeObjectURL(url);
}

function readImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split("");
  let line = "";
  let lineCount = 0;
  for (const word of words) {
    const nextLine = line + word;
    if (ctx.measureText(nextLine).width > maxWidth && line) {
      ctx.fillText(line, x, y + lineCount * lineHeight);
      line = word;
      lineCount += 1;
      if (lineCount >= maxLines) return;
    } else {
      line = nextLine;
    }
  }
  if (line && lineCount < maxLines) {
    ctx.fillText(line, x, y + lineCount * lineHeight);
  }
}

function wrappedLines(ctx, text, maxWidth, maxLines = Infinity) {
  const sourceLines = text.split(/\r?\n/);
  const lines = [];
  for (const sourceLine of sourceLines) {
    if (!sourceLine) {
      lines.push("");
      if (lines.length >= maxLines) return lines;
      continue;
    }
    let line = "";
    for (const char of sourceLine.split("")) {
      const nextLine = line + char;
      if (ctx.measureText(nextLine).width > maxWidth && line) {
        lines.push(line);
        line = char;
        if (lines.length >= maxLines) return lines;
      } else {
        line = nextLine;
      }
    }
    if (line) lines.push(line);
    if (lines.length >= maxLines) return lines;
  }
  return lines;
}

function drawTextBlock(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const lines = wrappedLines(ctx, text, maxWidth, maxLines);
  lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
  return y + lines.length * lineHeight;
}

function fitTextBlock(ctx, text, maxWidth, maxHeight, maxFontSize, weight) {
  let fontSize = maxFontSize;
  while (fontSize >= 1) {
    ctx.font = `${weight} ${fontSize}px sans-serif`;
    const lineHeight = fontSize * 1.25;
    const lines = wrappedLines(ctx, text, maxWidth);
    const widest = Math.max(0, ...lines.map((line) => ctx.measureText(line).width));
    if (widest <= maxWidth && lines.length * lineHeight <= maxHeight) {
      return { fontSize, lineHeight, lines };
    }
    fontSize -= 0.5;
  }
  ctx.font = `${weight} 1px sans-serif`;
  return { fontSize: 1, lineHeight: 1.25, lines: wrappedLines(ctx, text, maxWidth) };
}

function drawFittedTextBlock(ctx, text, x, y, maxWidth, maxHeight, maxFontSize, weight) {
  const fitted = fitTextBlock(ctx, text, maxWidth, maxHeight, maxFontSize, weight);
  ctx.font = `${weight} ${fitted.fontSize}px sans-serif`;
  fitted.lines.forEach((line, index) => {
    ctx.fillText(line, x, y + fitted.fontSize + index * fitted.lineHeight);
  });
}

function drawImageContain(ctx, image, x, y, width, height) {
  const ratio = Math.min(width / image.naturalWidth, height / image.naturalHeight);
  const drawWidth = image.naturalWidth * ratio;
  const drawHeight = image.naturalHeight * ratio;
  ctx.drawImage(image, x + (width - drawWidth) / 2, y + (height - drawHeight) / 2, drawWidth, drawHeight);
}

function setBandLoading(message) {
  bandPreview.classList.add("is-dropzone");
  bandPreview.innerHTML = `<div class="empty-preview">${message}</div>`;
}

function setBandError(message) {
  bandPreview.classList.add("is-dropzone");
  bandPreview.innerHTML = `<div class="empty-preview">${message}</div>`;
}

async function renderPdfFirstPage(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF_RENDERER_UNAVAILABLE");
  }
  pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
}

function printOnly(className) {
  document.body.classList.add(className);
  window.print();
}

function collectSettings() {
  return {
    company: bandInputs.company.value,
    contact: bandInputs.contact.value,
    note: bandInputs.note.value,
    position: bandInputs.position.value,
    color: bandInputs.color.value,
    textColor: bandInputs.textColor.value,
    logoMode: bandInputs.logoMode.value,
    logoX: bandInputs.logoX.value,
    logoY: bandInputs.logoY.value,
    logoWidth: bandInputs.logoWidth.value,
    bandX: bandInputs.bandX.value,
    bandY: bandInputs.bandY.value,
    bandWidth: bandInputs.bandWidth.value,
    bandHeight: bandInputs.bandHeight.value,
    textLayouts,
    logoUrl: bandState.logoUrl && !bandState.logoUrl.startsWith("blob:") ? bandState.logoUrl : ""
  };
}

function saveSettings() {
  try {
    localStorage.setItem(settingsKey, JSON.stringify(collectSettings()));
  } catch (error) {
    console.warn("帯替え設定を保存できませんでした。", error);
  }
}

async function restoreSettings() {
  let settings;
  try {
    const raw = localStorage.getItem(settingsKey);
    if (!raw) return;
    settings = JSON.parse(raw);
  } catch (error) {
    console.warn("帯替え設定を復元できませんでした。", error);
    return;
  }
  const mapping = {
    company: bandInputs.company,
    contact: bandInputs.contact,
    note: bandInputs.note,
    position: bandInputs.position,
    color: bandInputs.color,
    textColor: bandInputs.textColor,
    logoMode: bandInputs.logoMode,
    logoX: bandInputs.logoX,
    logoY: bandInputs.logoY,
    logoWidth: bandInputs.logoWidth,
    bandX: bandInputs.bandX,
    bandY: bandInputs.bandY,
    bandWidth: bandInputs.bandWidth,
    bandHeight: bandInputs.bandHeight
  };
  Object.entries(mapping).forEach(([key, input]) => {
    if (settings[key] !== undefined && input) input.value = settings[key];
  });
  if (settings.textLayouts) {
    Object.entries(settings.textLayouts).forEach(([key, layout]) => {
      if (textLayouts[key]) Object.assign(textLayouts[key], layout);
    });
  }
  if (settings.logoUrl) {
    bandState.logoUrl = settings.logoUrl;
    bandState.logo = await readImage(settings.logoUrl);
  }
}

window.addEventListener("afterprint", () => {
  document.body.classList.remove("print-band", "print-render", "print-dd");
  if (printOutput) printOutput.innerHTML = "";
});

function updateLogoControls() {
  const mode = bandInputs.logoMode.value;
  logoFreeControls.hidden = mode === "band";
}

function applyBandPreset() {
  if (bandInputs.position.value === "top") {
    setBandValues({ x: 0, y: 0, width: 100, height: 16 });
  } else if (bandInputs.position.value === "bottom") {
    setBandValues({ x: 0, y: 84, width: 100, height: 16 });
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function setFreeLogoValues({ x, y, width }) {
  if (typeof x === "number") bandInputs.logoX.value = clamp(x, 0, 95).toFixed(2);
  if (typeof y === "number") bandInputs.logoY.value = clamp(y, 0, 95).toFixed(2);
  if (typeof width === "number") bandInputs.logoWidth.value = clamp(width, 5, 70).toFixed(2);
}

function updateFreeLogoElement() {
  const box = bandPreview.querySelector("[data-free-logo-box]");
  if (!box) return;
  box.style.left = `${bandInputs.logoX.value}%`;
  box.style.top = `${bandInputs.logoY.value}%`;
  box.style.width = `${bandInputs.logoWidth.value}%`;
  updatePreviewImage();
}

function setBandValues({ x, y, width, height }) {
  if (typeof x === "number") bandInputs.bandX.value = clamp(x, 0, 98).toFixed(2);
  if (typeof y === "number") bandInputs.bandY.value = clamp(y, 0, 98).toFixed(2);
  if (typeof width === "number") bandInputs.bandWidth.value = clamp(width, 12, 100).toFixed(2);
  if (typeof height === "number") bandInputs.bandHeight.value = clamp(height, 6, 45).toFixed(2);
}

function updateBandOverlayElement() {
  const overlay = bandPreview.querySelector("[data-band-overlay]");
  if (!overlay) return;
  overlay.style.left = `${bandInputs.bandX.value}%`;
  overlay.style.top = `${bandInputs.bandY.value}%`;
  overlay.style.width = `${bandInputs.bandWidth.value}%`;
  overlay.style.height = `${bandInputs.bandHeight.value}%`;
  updatePreviewImage();
}

function textBoxHeight(layout) {
  return clamp(layout.height || 8, 3, 35);
}

function setTextLayout(key, values) {
  const layout = textLayouts[key];
  if (!layout) return;
  if (typeof values.x === "number") layout.x = clamp(values.x, 0, 100 - layout.width);
  if (typeof values.y === "number") layout.y = clamp(values.y, 0, 100 - textBoxHeight(layout));
  if (typeof values.width === "number") layout.width = clamp(values.width, 8, 96 - layout.x);
  if (typeof values.font === "number") layout.font = clamp(values.font, 0.55, 5.5);
  if (typeof values.height === "number") layout.height = clamp(values.height, 3, 35);
}

function updateTextBoxElement(key) {
  const box = bandPreview.querySelector(`[data-text-box="${key}"]`);
  const layout = textLayouts[key];
  if (!box || !layout) return;
  box.style.left = `${layout.x}%`;
  box.style.top = `${layout.y}%`;
  box.style.width = `${layout.width}%`;
  box.style.height = `${textBoxHeight(layout)}%`;
  updatePreviewImage();
}

function valueInputForTextKey(key) {
  return {
    company: bandInputs.company,
    contact: bandInputs.contact,
    note: bandInputs.note
  }[key];
}

function showInlineTextEditor(key) {
  const box = bandPreview.querySelector(`[data-text-box="${key}"]`);
  const input = valueInputForTextKey(key);
  if (!box || !input) return;
  editingTextKey = key;
  box.classList.add("is-editing");
  box.innerHTML = `
    <textarea class="inline-text-editor" data-inline-text-editor>${input.value}</textarea>
    <span class="text-resize" data-text-resize aria-hidden="true"></span>
  `;
  const editor = box.querySelector("[data-inline-text-editor]");
  editor.focus();
  editor.setSelectionRange(editor.value.length, editor.value.length);
}

function commitInlineTextEditor() {
  if (!editingTextKey) return;
  const box = bandPreview.querySelector(`[data-text-box="${editingTextKey}"]`);
  const editor = box?.querySelector("[data-inline-text-editor]");
  const input = valueInputForTextKey(editingTextKey);
  if (editor && input) {
    input.value = editor.value;
  }
  editingTextKey = null;
  saveSettings();
  renderBandPreview();
}

function updatePreviewImage() {
  const image = bandPreview.querySelector(".band-document");
  if (!image) return;
  const canvas = composeBandCanvas();
  if (!canvas) return;
  image.src = canvas.toDataURL("image/png");
}

function renderBandPreview() {
  if (!bandState.sourceUrl) return;
  bandPreview.classList.remove("is-dropzone", "is-dragover");
  const canvas = composeBandCanvas();
  if (!canvas) return;
  const showFreeLogo = bandInputs.logoMode.value !== "band" && bandState.logoUrl;
  const aspectRatio = bandState.logo ? `${bandState.logo.naturalWidth} / ${bandState.logo.naturalHeight}` : "1 / 1";
  const freeLogo = showFreeLogo
    ? `<div class="free-logo-box" data-free-logo-box style="left:${bandInputs.logoX.value}%; top:${bandInputs.logoY.value}%; width:${bandInputs.logoWidth.value}%; aspect-ratio:${aspectRatio};">
        <span class="free-logo-resize" data-free-logo-resize aria-hidden="true"></span>
      </div>`
    : "";
  const textBoxes = Object.entries(textLayouts).map(([key, layout]) => `
    <div class="text-edit-box" data-text-box="${key}" style="left:${layout.x}%; top:${layout.y}%; width:${layout.width}%; height:${textBoxHeight(layout)}%;">
      <span class="text-edit-label">${layout.label}</span>
      <span class="text-resize" data-text-resize aria-hidden="true"></span>
    </div>
  `).join("");
  bandPreview.innerHTML = `
    <div class="band-sheet">
      <img class="band-document" src="${canvas.toDataURL("image/png")}" alt="帯替え済み物件概要書プレビュー">
      ${freeLogo}
      <div class="band-overlay" data-band-overlay style="left:${bandInputs.bandX.value}%; top:${bandInputs.bandY.value}%; width:${bandInputs.bandWidth.value}%; height:${bandInputs.bandHeight.value}%;">
        <span class="band-resize" data-band-resize aria-hidden="true"></span>
      </div>
      ${textBoxes}
    </div>
  `;
}

function startBandDrag(event) {
  if (event.target.closest("[data-free-logo-box]")) return;
  const overlay = event.target.closest("[data-band-overlay]");
  if (!overlay) return;
  event.preventDefault();
  event.stopPropagation();
  bandInputs.position.value = "custom";
  const sheet = bandPreview.querySelector(".band-sheet");
  const sheetRect = sheet.getBoundingClientRect();
  const overlayRect = overlay.getBoundingClientRect();
  bandDragState = {
    mode: event.target.closest("[data-band-resize]") ? "resize" : "move",
    pointerId: event.pointerId,
    sheetRect,
    startX: event.clientX,
    startY: event.clientY,
    startLeftPx: overlayRect.left - sheetRect.left,
    startTopPx: overlayRect.top - sheetRect.top,
    startWidthPx: overlayRect.width,
    startHeightPx: overlayRect.height
  };
  overlay.setPointerCapture(event.pointerId);
}

function moveBandDrag(event) {
  if (!bandDragState) return;
  event.preventDefault();
  const state = bandDragState;
  if (state.mode === "move") {
    const widthPct = Number(bandInputs.bandWidth.value);
    const heightPct = Number(bandInputs.bandHeight.value);
    const x = clamp((state.startLeftPx + event.clientX - state.startX) / state.sheetRect.width * 100, 0, 100 - widthPct);
    const y = clamp((state.startTopPx + event.clientY - state.startY) / state.sheetRect.height * 100, 0, 100 - heightPct);
    setBandValues({ x, y });
  } else {
    const width = (state.startWidthPx + event.clientX - state.startX) / state.sheetRect.width * 100;
    const height = (state.startHeightPx + event.clientY - state.startY) / state.sheetRect.height * 100;
    setBandValues({ width, height });
  }
  updateBandOverlayElement();
}

function endBandDrag(event) {
  if (!bandDragState) return;
  const overlay = bandPreview.querySelector("[data-band-overlay]");
  if (overlay && event.pointerId === bandDragState.pointerId) {
    overlay.releasePointerCapture(event.pointerId);
  }
  bandDragState = null;
  saveSettings();
}

function startLogoDrag(event) {
  const box = event.target.closest("[data-free-logo-box]");
  if (!box) return;
  event.preventDefault();
  event.stopPropagation();
  const sheet = bandPreview.querySelector(".band-sheet");
  const sheetRect = sheet.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  logoDragState = {
    mode: event.target.closest("[data-free-logo-resize]") ? "resize" : "move",
    pointerId: event.pointerId,
    sheetRect,
    startX: event.clientX,
    startY: event.clientY,
    startLeftPx: boxRect.left - sheetRect.left,
    startTopPx: boxRect.top - sheetRect.top,
    startWidthPx: boxRect.width
  };
  box.setPointerCapture(event.pointerId);
}

function moveLogoDrag(event) {
  if (!logoDragState) return;
  event.preventDefault();
  const state = logoDragState;
  if (state.mode === "move") {
    const nextLeftPx = state.startLeftPx + event.clientX - state.startX;
    const nextTopPx = state.startTopPx + event.clientY - state.startY;
    const widthPx = state.sheetRect.width * Number(bandInputs.logoWidth.value) / 100;
    const x = clamp(nextLeftPx / state.sheetRect.width * 100, 0, 100 - widthPx / state.sheetRect.width * 100);
    const y = clamp(nextTopPx / state.sheetRect.height * 100, 0, 95);
    setFreeLogoValues({ x, y });
  } else {
    const nextWidthPx = state.startWidthPx + event.clientX - state.startX;
    const width = clamp(nextWidthPx / state.sheetRect.width * 100, 5, 70);
    setFreeLogoValues({ width });
  }
  updateFreeLogoElement();
}

function endLogoDrag(event) {
  if (!logoDragState) return;
  const box = bandPreview.querySelector("[data-free-logo-box]");
  if (box && event.pointerId === logoDragState.pointerId) {
    box.releasePointerCapture(event.pointerId);
  }
  logoDragState = null;
  saveSettings();
}

function startTextDrag(event) {
  const box = event.target.closest("[data-text-box]");
  if (!box) return;
  if (event.target.closest("[data-inline-text-editor]")) return;
  event.preventDefault();
  event.stopPropagation();
  const key = box.dataset.textBox;
  const layout = textLayouts[key];
  const sheet = bandPreview.querySelector(".band-sheet");
  const sheetRect = sheet.getBoundingClientRect();
  const boxRect = box.getBoundingClientRect();
  textDragState = {
    key,
    mode: event.target.closest("[data-text-resize]") ? "resize" : "move",
    pointerId: event.pointerId,
    sheetRect,
    startX: event.clientX,
    startY: event.clientY,
    startLeftPx: boxRect.left - sheetRect.left,
    startTopPx: boxRect.top - sheetRect.top,
    startWidthPx: boxRect.width,
    startHeightPx: boxRect.height,
    startFont: layout.font
  };
  box.setPointerCapture(event.pointerId);
}

function moveTextDrag(event) {
  if (!textDragState) return;
  event.preventDefault();
  const state = textDragState;
  if (state.mode === "move") {
    const x = (state.startLeftPx + event.clientX - state.startX) / state.sheetRect.width * 100;
    const y = (state.startTopPx + event.clientY - state.startY) / state.sheetRect.height * 100;
    setTextLayout(state.key, { x, y });
  } else {
    const width = (state.startWidthPx + event.clientX - state.startX) / state.sheetRect.width * 100;
    const height = (state.startHeightPx + event.clientY - state.startY) / state.sheetRect.height * 100;
    const font = state.startFont + (event.clientX - state.startX + event.clientY - state.startY) / state.sheetRect.height * 4;
    setTextLayout(state.key, { width, height, font });
  }
  updateTextBoxElement(state.key);
}

function endTextDrag(event) {
  if (!textDragState) return;
  const box = bandPreview.querySelector(`[data-text-box="${textDragState.key}"]`);
  if (box && event.pointerId === textDragState.pointerId) {
    box.releasePointerCapture(event.pointerId);
  }
  textDragState = null;
  saveSettings();
}

async function loadBandFile(file) {
  if (!file) return;
  if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
    setBandError("画像またはPDFファイルを選択してください。");
    return;
  }
  revokeUrl(bandState.sourceUrl);
  try {
    if (file.type === "application/pdf") {
      setBandLoading("PDFの1ページ目をプレビュー用に変換しています。");
      bandState.sourceUrl = await renderPdfFirstPage(file);
      bandState.sourceType = "image/png";
      bandState.sourceIsObjectUrl = false;
      bandState.image = await readImage(bandState.sourceUrl);
    } else {
      bandState.sourceUrl = URL.createObjectURL(file);
      bandState.sourceType = file.type;
      bandState.sourceIsObjectUrl = true;
      bandState.image = await readImage(bandState.sourceUrl);
    }
    renderBandPreview();
  } catch (error) {
    bandState.sourceUrl = "";
    bandState.image = null;
    setBandError("PDFを画像化できませんでした。ネットワーク接続を確認するか、物件概要書を画像で選択してください。");
  }
}

if (hasBandTool) {
  bandFile.addEventListener("change", async (event) => {
    await loadBandFile(event.target.files[0]);
  });

  bandPreview.addEventListener("click", () => {
    if (!bandState.sourceUrl) bandFile.click();
  });

  bandPreview.addEventListener("dblclick", (event) => {
    const box = event.target.closest("[data-text-box]");
    if (!box) return;
    event.preventDefault();
    event.stopPropagation();
    showInlineTextEditor(box.dataset.textBox);
  });

  document.addEventListener("pointerdown", (event) => {
    if (!editingTextKey) return;
    if (event.target.closest("[data-text-box]")) return;
    commitInlineTextEditor();
  });

  bandPreview.addEventListener("input", (event) => {
    if (!event.target.matches("[data-inline-text-editor]") || !editingTextKey) return;
    const input = valueInputForTextKey(editingTextKey);
    if (input) input.value = event.target.value;
    saveSettings();
    updatePreviewImage();
  });

  bandPreview.addEventListener("pointerdown", startLogoDrag);
  bandPreview.addEventListener("pointerdown", startBandDrag);
  bandPreview.addEventListener("pointerdown", startTextDrag);
  bandPreview.addEventListener("pointermove", moveLogoDrag);
  bandPreview.addEventListener("pointermove", moveBandDrag);
  bandPreview.addEventListener("pointermove", moveTextDrag);
  bandPreview.addEventListener("pointerup", endLogoDrag);
  bandPreview.addEventListener("pointerup", endBandDrag);
  bandPreview.addEventListener("pointerup", endTextDrag);
  bandPreview.addEventListener("pointercancel", endLogoDrag);
  bandPreview.addEventListener("pointercancel", endBandDrag);
  bandPreview.addEventListener("pointercancel", endTextDrag);

  bandPreview.addEventListener("keydown", (event) => {
    if (bandState.sourceUrl) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      bandFile.click();
    }
  });

  bandPreview.addEventListener("dragover", (event) => {
    event.preventDefault();
    bandPreview.classList.add("is-dragover");
  });

  bandPreview.addEventListener("dragleave", () => {
    bandPreview.classList.remove("is-dragover");
  });

  bandPreview.addEventListener("drop", async (event) => {
    event.preventDefault();
    bandPreview.classList.remove("is-dragover");
    await loadBandFile(event.dataTransfer.files[0]);
  });

  logoFile.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    revokeUrl(bandState.logoUrl);
    bandState.logoUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    bandState.logo = await readImage(bandState.logoUrl);
    saveSettings();
    renderBandPreview();
  });

  Object.values(bandInputs).forEach((input) => {
    input.addEventListener("input", () => {
      saveSettings();
      renderBandPreview();
    });
    input.addEventListener("change", () => {
      updateLogoControls();
      applyBandPreset();
      saveSettings();
      renderBandPreview();
    });
  });

  document.querySelector("[data-reset-band-settings]").addEventListener("click", () => {
    localStorage.removeItem(settingsKey);
    location.reload();
  });

  restoreSettings().then(() => {
    applyBandPreset();
    updateLogoControls();
  });
}

function composeBandCanvas() {
  if (!bandState.image) {
    return null;
  }
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = bandState.image.naturalWidth;
  canvas.height = bandState.image.naturalHeight;
  ctx.drawImage(bandState.image, 0, 0);

  const bandHeight = canvas.height * Number(bandInputs.bandHeight.value) / 100;
  const bandWidth = canvas.width * Number(bandInputs.bandWidth.value) / 100;
  const bandX = canvas.width * Number(bandInputs.bandX.value) / 100;
  const y = canvas.height * Number(bandInputs.bandY.value) / 100;
  ctx.fillStyle = bandInputs.color.value;
  ctx.fillRect(bandX, y, bandWidth, bandHeight);

  const padX = bandWidth * 0.022;
  const padY = bandHeight * 0.18;
  const gap = bandWidth * 0.02;
  const logoBoxWidth = bandWidth * 0.12;
  const logoBoxHeight = bandHeight * 0.72;
  const logoBoxSize = Math.min(logoBoxWidth, logoBoxHeight);
  const logoBoxX = bandX + padX;
  const logoBoxY = y + (bandHeight - logoBoxSize) / 2;
  const showBandLogo = bandInputs.logoMode.value !== "free";
  if (showBandLogo && bandState.logo) {
    ctx.fillStyle = "#fff";
    ctx.fillRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);
    const logoPad = logoBoxSize * 0.12;
    drawImageContain(ctx, bandState.logo, logoBoxX + logoPad, logoBoxY + logoPad, logoBoxSize - logoPad * 2, logoBoxSize - logoPad * 2);
  } else if (showBandLogo) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.strokeRect(logoBoxX, logoBoxY, logoBoxSize, logoBoxSize);
    ctx.fillStyle = "#fff";
    ctx.font = `700 ${Math.max(16, logoBoxSize * 0.22)}px sans-serif`;
    ctx.fillText("LOGO", logoBoxX + logoBoxSize * 0.18, logoBoxY + logoBoxSize * 0.56);
  }

  const textX = showBandLogo ? logoBoxX + logoBoxSize + gap : bandX + padX;
  const textMaxWidth = bandX + bandWidth - textX - padX;
  void textX;
  void textMaxWidth;

  const textValues = {
    company: bandInputs.company.value,
    contact: bandInputs.contact.value,
    note: bandInputs.note.value
  };
  Object.entries(textLayouts).forEach(([key, layout]) => {
    const x = canvas.width * layout.x / 100;
    const yText = canvas.height * layout.y / 100;
    const width = canvas.width * layout.width / 100;
    const height = canvas.height * textBoxHeight(layout) / 100;
    const fontSize = canvas.width * layout.font / 100;
    ctx.fillStyle = bandInputs.textColor.value;
    drawFittedTextBlock(ctx, textValues[key], x, yText, width, height, fontSize, layout.weight);
  });

  if (bandState.logo && bandInputs.logoMode.value !== "band") {
    const freeWidth = canvas.width * Number(bandInputs.logoWidth.value) / 100;
    const freeHeight = freeWidth * (bandState.logo.naturalHeight / bandState.logo.naturalWidth);
    const freeX = canvas.width * Number(bandInputs.logoX.value) / 100;
    const freeY = canvas.height * Number(bandInputs.logoY.value) / 100;
    drawImageContain(ctx, bandState.logo, freeX, freeY, freeWidth, freeHeight);
  }

  return canvas;
}

if (hasBandTool) {
  document.querySelector("[data-download-band]").addEventListener("click", () => {
    const canvas = composeBandCanvas();
    if (!canvas) {
      alert("物件概要書の画像またはPDFを選択してください。");
      return;
    }
    const link = document.createElement("a");
    link.download = "butsuken-gaiyosho-obi.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  });

  document.querySelector("[data-print-band]").addEventListener("click", () => {
    const canvas = composeBandCanvas();
    if (!canvas) {
      alert("物件概要書の画像またはPDFを選択してください。");
      return;
    }
    const image = new Image();
    image.alt = "帯替え済み物件概要書";
    image.onload = () => {
      printOutput.innerHTML = "";
      printOutput.append(image);
      document.body.classList.add("print-render");
      requestAnimationFrame(() => window.print());
    };
    image.src = canvas.toDataURL("image/png");
  });
}

const noiFields = {
  price: document.querySelector("[data-noi-price]"),
  rent: document.querySelector("[data-noi-rent]"),
  vacancy: document.querySelector("[data-noi-vacancy]"),
  opex: document.querySelector("[data-noi-opex]"),
  capex: document.querySelector("[data-noi-capex]"),
  caprate: document.querySelector("[data-noi-caprate]")
};
const noiResult = document.querySelector("[data-noi-result]");
const hasNoiTool = Boolean(noiResult && Object.values(noiFields).every(Boolean));

function numberOf(field) {
  return Number(field.value || 0);
}

function renderNoi() {
  const price = numberOf(noiFields.price);
  const annualRent = numberOf(noiFields.rent) * 12;
  const vacancyLoss = annualRent * numberOf(noiFields.vacancy) / 100;
  const effectiveIncome = annualRent - vacancyLoss;
  const noi = effectiveIncome - numberOf(noiFields.opex);
  const afterCapex = noi - numberOf(noiFields.capex);
  const grossYield = price ? annualRent / price * 100 : 0;
  const noiYield = price ? noi / price * 100 : 0;
  const afterCapexYield = price ? afterCapex / price * 100 : 0;
  const targetValue = numberOf(noiFields.caprate) ? noi / (numberOf(noiFields.caprate) / 100) : 0;
  noiResult.innerHTML = `
    <div class="result-metrics">
      <article><span>年間賃料</span><strong>${money(annualRent)}</strong></article>
      <article><span>NOI</span><strong>${money(noi)}</strong></article>
      <article><span>表面利回り</span><strong>${percent(grossYield)}</strong></article>
      <article><span>NOI利回り</span><strong>${percent(noiYield)}</strong></article>
      <article><span>修繕後利回り</span><strong>${percent(afterCapexYield)}</strong></article>
      <article><span>目標Cap換算価値</span><strong>${money(targetValue)}</strong></article>
    </div>
    <p class="tool-note">概算式: NOI = 年間賃料 - 空室損 - 年間運営費。税金、取得費、借入条件、減価償却は含めていません。</p>
  `;
}

if (hasNoiTool) {
  Object.values(noiFields).forEach((field) => field.addEventListener("input", renderNoi));
  renderNoi();
}

const ddResult = document.querySelector("[data-dd-result]");
const ddFields = {
  type: document.querySelector("[data-dd-type]"),
  phase: document.querySelector("[data-dd-phase]"),
  income: document.querySelector("[data-dd-income]"),
  development: document.querySelector("[data-dd-development]")
};
const hasDdTool = Boolean(ddResult && Object.values(ddFields).every(Boolean));

const baseChecks = {
  "権利・登記": ["登記簿の所有者、持分、担保権、差押えを確認", "公図、地積測量図、境界確認資料の有無を確認", "越境、通行、私道、地役権、借地権の有無を整理"],
  "法令・行政": ["用途地域、建ぺい率、容積率、高度地区、防火指定を確認", "道路種別、接道幅員、セットバック要否を確認", "ハザード、土壌汚染、埋蔵文化財、景観・条例制限を確認"],
  "物理・建物": ["建築確認、検査済証、竣工図、増改築履歴を確認", "耐震、アスベスト、PCB、設備劣化、修繕履歴を確認", "現地で境界、越境、設備、管理状態、周辺環境を確認"],
  "契約・取引条件": ["売買対象、付帯設備、引渡条件、契約不適合責任を整理", "解除条件、融資特約、DD期間、表明保証の論点を整理", "決済までの関係者、必要書類、精算項目を確認"]
};

const typeChecks = {
  office: ["テナント業種、契約満了、解約予告、フリーレントを確認", "共用部、空調、EV、受変電、BCP対応を確認"],
  residence: ["住戸別の賃料、敷金、滞納、原状回復負担を確認", "管理規約、長期修繕、設備更新、入居者属性を確認"],
  land: ["確定測量、境界標、越境合意、土壌・地中埋設物を確認", "開発許可、造成、上下水・ガス引込、道路後退を確認"],
  hotel: ["運営契約、許認可、消防、旅館業法、PMLを確認", "ADR、稼働率、OTA依存、オペレーター変更可否を確認"]
};

function checklistGroups() {
  const groups = Object.entries(baseChecks).map(([title, items]) => ({ title, items: [...items] }));
  groups.push({ title: "物件タイプ別", items: typeChecks[ddFields.type.value] });
  if (ddFields.income.checked) {
    groups.push({ title: "経済DD・収益", items: ["レントロール、賃貸借契約、入金実績の整合を確認", "NOI、空室率、賃料単価、運営費、CAPEXを整理", "周辺賃料、出口Cap Rate、売却事例を確認"] });
  }
  if (ddFields.development.checked) {
    groups.push({ title: "開発・建替余地", items: ["有効宅地、容積消化、斜線、日影、駐車場附置義務を確認", "概算ボリューム、事業収支、許認可スケジュールを確認", "既存テナント退去、解体、近隣対応、インフラ増強を確認"] });
  }
  if (ddFields.phase.value === "initial") return groups.map((group) => ({ ...group, items: group.items.slice(0, 2) }));
  if (ddFields.phase.value === "full") {
    groups.push({ title: "詳細DD管理", items: ["Q&A表、追加資料依頼、回答期限、担当者を管理", "専門家レポートの指摘事項を価格・契約条件に反映", "社内稟議、融資、決済準備への引継ぎ事項を整理"] });
  }
  return groups;
}

function renderDd() {
  const groups = checklistGroups();
  ddResult.innerHTML = groups.map((group) => `
    <article class="check-group">
      <h3>${group.title}</h3>
      <ul>${group.items.map((item) => `<li><label><input type="checkbox"> <span>${item}</span></label></li>`).join("")}</ul>
    </article>
  `).join("");
}

if (hasDdTool) {
  Object.values(ddFields).forEach((field) => field.addEventListener("change", renderDd));

  document.querySelector("[data-copy-dd]").addEventListener("click", async () => {
    const text = checklistGroups().map((group) => `${group.title}\n${group.items.map((item) => `- ${item}`).join("\n")}`).join("\n\n");
    await navigator.clipboard.writeText(text);
    alert("チェックリストをコピーしました。");
  });

  document.querySelector("[data-print-dd]").addEventListener("click", () => printOnly("print-dd"));

  renderDd();
}
