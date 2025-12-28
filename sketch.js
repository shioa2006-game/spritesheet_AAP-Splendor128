// プレビューキャンバスのサイズ定義
const canvasSize = 384;
// プレビュー背景のセルサイズ定義
const cellSize = 24;
// スプライトの仕様をまとめて定義
const spriteSpec = {
  edge: 12,
  minValue: 0,
  maxValue: 128
};

// PNG出力時の拡大倍率
const exportScale = 3;

// パレット定義（AAP-Splendor128 カラーパレット）
const palette = {
  0: "transparent",
  // ダーク・ブラウン系 (1-8)
  1: "#050403",
  2: "#0e0c0c",
  3: "#2d1b1e",
  4: "#612721",
  5: "#b9451d",
  6: "#f1641f",
  7: "#fca570",
  8: "#ffe0b7",
  // ホワイト・イエロー系 (9-14)
  9: "#ffffff",
  10: "#fff089",
  11: "#f8c53a",
  12: "#e88a36",
  13: "#b05b2c",
  14: "#673931",
  // ブラウン・アース系 (15-24)
  15: "#271f1b",
  16: "#4c3d2e",
  17: "#855f39",
  18: "#d39741",
  19: "#f8f644",
  20: "#d5dc1d",
  21: "#adb834",
  22: "#7f8e44",
  23: "#586335",
  24: "#333c24",
  // グリーン系 (25-36)
  25: "#181c19",
  26: "#293f21",
  27: "#477238",
  28: "#61a53f",
  29: "#8fd032",
  30: "#c4f129",
  31: "#d0ffea",
  32: "#97edca",
  33: "#59cf93",
  34: "#42a459",
  35: "#3d6f43",
  36: "#27412d",
  // ブルー系 (37-50)
  37: "#14121d",
  38: "#1b2447",
  39: "#2b4e95",
  40: "#2789cd",
  41: "#42bfe8",
  42: "#73efe8",
  43: "#f1f2ff",
  44: "#c9d4fd",
  45: "#8aa1f6",
  46: "#4572e3",
  47: "#494182",
  48: "#7864c6",
  49: "#9c8bdb",
  50: "#ceaaed",
  // ピンク・パープル系 (51-54)
  51: "#fad6ff",
  52: "#eeb59c",
  53: "#d480bb",
  54: "#9052bc",
  // グレースケール系 (55-67)
  55: "#171516",
  56: "#373334",
  57: "#695b59",
  58: "#b28b78",
  59: "#e2b27e",
  60: "#f6d896",
  61: "#fcf7be",
  62: "#ecebe7",
  63: "#cbc6c1",
  64: "#a69e9a",
  65: "#807b7a",
  66: "#595757",
  67: "#323232",
  // ブラウン・オレンジ系 (68-74)
  68: "#4f342f",
  69: "#8c5b3e",
  70: "#c68556",
  71: "#d6a851",
  72: "#b47538",
  73: "#724b2c",
  74: "#452a1b",
  // オリーブ・グリーン系 (75-83)
  75: "#61683a",
  76: "#939446",
  77: "#c6b858",
  78: "#efdd91",
  79: "#b5e7cb",
  80: "#86c69a",
  81: "#5d9b79",
  82: "#486859",
  83: "#2c3b39",
  // ティール・シアン系 (84-95)
  84: "#171819",
  85: "#2c3438",
  86: "#465456",
  87: "#64878c",
  88: "#8ac4c3",
  89: "#afe9df",
  90: "#dceaee",
  91: "#b8ccd8",
  92: "#88a3bc",
  93: "#5e718e",
  94: "#485262",
  95: "#282c3c",
  // パープル・グレー系 (96-106)
  96: "#464762",
  97: "#696682",
  98: "#9a97b9",
  99: "#c5c7dd",
  100: "#e6e7f0",
  101: "#eee6ea",
  102: "#e3cddf",
  103: "#bfa5c9",
  104: "#87738f",
  105: "#564f5b",
  106: "#322f35",
  // ピンク・レッド系 (107-118)
  107: "#36282b",
  108: "#654956",
  109: "#966888",
  110: "#c090a9",
  111: "#d4b8b8",
  112: "#eae0dd",
  113: "#f1ebdb",
  114: "#ddcebf",
  115: "#bda499",
  116: "#886e6a",
  117: "#594d4d",
  118: "#332729",
  // ウォーム・スキン系 (119-128)
  119: "#b29476",
  120: "#e1bf89",
  121: "#f8e398",
  122: "#ffe9e3",
  123: "#fdc9c9",
  124: "#f6a2a8",
  125: "#e27285",
  126: "#b25266",
  127: "#64364b",
  128: "#2a1e23"
};

// アプリ全体の状態をここで保持
const state = {
  sprites: [],
  layout: {
    columns: 8,
    padding: 0,
    margin: 0,
    exportPadding: 2,
    spriteSize: spriteSpec.edge
  }
};

// レイアウトプリセット定義
const layoutPresets = {
  default: { columns: 8, padding: 0, margin: 0, exportPadding: 2 },
  tight: { columns: 12, padding: 0, margin: 0, exportPadding: 2 },
  spaced: { columns: 6, padding: 2, margin: 2, exportPadding: 2 },
  custom: null
};

// DOM参照をまとめて保持
const domRefs = {
  spriteInput: null,
  addButton: null,
  clearButton: null,
  errorMessage: null,
  spriteList: null,
  spriteListEmpty: null,
  clearAllButton: null,
  previewInfo: null,
  exportButton: null,
  layoutColumns: null,
  layoutPadding: null,
  layoutMargin: null,
  layoutExportPadding: null,
  layoutPreset: null
};

function setup() {
  // p5.jsキャンバスを生成してDOMに接続
  const canvas = createCanvas(canvasSize, canvasSize);
  canvas.parent("p5-container");
  noSmooth();

  // DOM要素を取得してキャッシュ
  domRefs.spriteInput = document.getElementById("spriteInput");
  domRefs.addButton = document.getElementById("addButton");
  domRefs.clearButton = document.getElementById("clearButton");
  domRefs.errorMessage = document.getElementById("errorMessage");
  domRefs.spriteList = document.getElementById("spriteList");
  domRefs.spriteListEmpty = document.getElementById("spriteListEmpty");
  domRefs.clearAllButton = document.getElementById("clearAllButton");
  domRefs.previewInfo = document.getElementById("previewInfo");
  domRefs.exportButton = document.getElementById("exportButton");
  domRefs.layoutColumns = document.getElementById("layoutColumns");
  domRefs.layoutPadding = document.getElementById("layoutPadding");
  domRefs.layoutMargin = document.getElementById("layoutMargin");
  domRefs.layoutExportPadding = document.getElementById("layoutExportPadding");
  domRefs.layoutPreset = document.getElementById("layoutPreset");

  // イベントハンドラを紐付け
  if (domRefs.addButton) {
    domRefs.addButton.addEventListener("click", handleAddClick);
  }
  if (domRefs.clearButton) {
    domRefs.clearButton.addEventListener("click", handleClearClick);
  }
  if (domRefs.spriteInput) {
    domRefs.spriteInput.addEventListener("input", () => updateErrorMessage(""));
  }
  if (domRefs.clearAllButton) {
    domRefs.clearAllButton.addEventListener("click", handleClearAllClick);
  }
  if (domRefs.spriteList) {
    domRefs.spriteList.addEventListener("click", handleSpriteListClick);
  }
  if (domRefs.layoutColumns) {
    domRefs.layoutColumns.addEventListener("change", handleLayoutSelectChange);
  }
  if (domRefs.layoutPadding) {
    domRefs.layoutPadding.addEventListener("change", handleLayoutSelectChange);
  }
  if (domRefs.layoutMargin) {
    domRefs.layoutMargin.addEventListener("change", handleLayoutSelectChange);
  }
  if (domRefs.layoutExportPadding) {
    domRefs.layoutExportPadding.addEventListener("change", handleLayoutSelectChange);
  }
  if (domRefs.layoutPreset) {
    domRefs.layoutPreset.addEventListener("change", handleLayoutPresetChange);
  }
  if (domRefs.exportButton) {
    domRefs.exportButton.addEventListener("click", handleExportClick);
  }

  renderSpriteList();
  syncLayoutSelectors();
  updateExportButtonState();
}

function draw() {
  // 背景パターンを描画してからスプライトを配置
  background(255);
  drawBackgroundPattern();
  const metrics = updatePreviewStatistics();
  drawSpritesOnPreview(metrics);
  noLoop();
}

// 追加ボタン押下時の処理
function handleAddClick() {
  const rawText = domRefs.spriteInput ? domRefs.spriteInput.value.trim() : "";
  const validation = parseSpriteText(rawText);
  if (!validation.ok) {
    updateErrorMessage(validation.message);
    return;
  }

  if (state.sprites.length >= 256) {
    updateErrorMessage("スプライトの最大数に達しました（上限: 256個）。");
    return;
  }

  const spriteId = generateSpriteId();
  state.sprites.push({
    id: spriteId,
    data: validation.data
  });
  updateErrorMessage(`スプライトを追加しました（現在: ${state.sprites.length}個）。`);
  if (domRefs.spriteInput) {
    domRefs.spriteInput.value = "";
  }

  renderSpriteList();
  loop();
  redraw();
}

// クリアボタン押下時の処理
function handleClearClick() {
  if (domRefs.spriteInput) {
    domRefs.spriteInput.value = "";
  }
  updateErrorMessage("入力エリアをクリアしました。");
  loop();
  redraw();
}

// 全削除ボタン押下時の処理
function handleClearAllClick() {
  if (state.sprites.length === 0) {
    updateErrorMessage("削除するスプライトがありません。");
    return;
  }
  const shouldClear = window.confirm("登録済みのスプライトをすべて削除しますか？");
  if (!shouldClear) {
    return;
  }
  state.sprites = [];
  renderSpriteList();
  updateErrorMessage("全てのスプライトを削除しました。");
  loop();
  redraw();
}

// PNG出力ボタン押下時の処理
function handleExportClick() {
  if (state.sprites.length === 0) {
    updateErrorMessage("出力するスプライトがありません。");
    return;
  }
  updateErrorMessage("PNG出力を準備しています…");

  if (state.sprites.length === 1) {
    const singleCanvas = generateSingleSpriteCanvas(state.sprites[0].data, exportScale);
    if (!singleCanvas) {
      updateErrorMessage("単体スプライトのPNG出力に失敗しました。");
      return;
    }
    downloadCanvasAsPng(singleCanvas, { type: "single" });
    return;
  }

  const sheetLayout = {
    columns: 8,
    padding: state.layout.exportPadding,
    margin: 0,
    spriteSize: spriteSpec.edge
  };
  const metrics = calculateSheetMetrics(state.sprites.length, sheetLayout);
  const sheetCanvas = generateSpriteSheetCanvas(metrics, sheetLayout, exportScale);
  if (!sheetCanvas) {
    updateErrorMessage("スプライトシートのPNG出力に失敗しました。");
    return;
  }
  downloadCanvasAsPng(sheetCanvas, {
    type: "sheet",
    columns: sheetLayout.columns,
    rows: metrics.rows
  });
}

// チェックボードパターンをキャンバス全体に描画
function drawBackgroundPattern() {
  noStroke();
  for (let y = 0; y < height; y += cellSize) {
    for (let x = 0; x < width; x += cellSize) {
      const isLight = (Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0;
      fill(isLight ? 224 : 255);
      rect(x, y, cellSize, cellSize);
    }
  }
}

// プレビュー用にスプライトをすべて描画
function drawSpritesOnPreview(metrics) {
  if (state.sprites.length === 0) {
    return;
  }

  const scale = determineScale(metrics.sheetWidth, metrics.sheetHeight);
  const offset = calculateSheetOffset(metrics.sheetWidth, metrics.sheetHeight, scale);
  const { columns, padding, margin, spriteSize } = state.layout;

  state.sprites.forEach((sprite, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const baseX = offset.x + (margin + col * (spriteSize + padding)) * scale;
    const baseY = offset.y + (margin + row * (spriteSize + padding)) * scale;
    drawSpritePixels(sprite.data, baseX, baseY, scale);
  });
}

// 1つのスプライトをピクセル単位で描画
function drawSpritePixels(sprite, baseX, baseY, scale) {
  const { spriteSize } = state.layout;
  noStroke();
  for (let y = 0; y < spriteSize; y += 1) {
    for (let x = 0; x < spriteSize; x += 1) {
      const value = sprite[y][x];
      if (value === 0) {
        continue;
      }
      const color = palette[value] || "#000000";
      fill(color);
      rect(baseX + x * scale, baseY + y * scale, scale, scale);
    }
  }
}

// シートサイズと行数を計算
function calculateSheetMetrics(spriteCount, layout = state.layout) {
  const { columns, padding, margin, spriteSize } = layout;
  if (spriteCount === 0) {
    return { rows: 0, sheetWidth: margin * 2, sheetHeight: margin * 2 };
  }
  const rows = Math.ceil(spriteCount / columns);
  const sheetWidth = columns * spriteSize + Math.max(0, columns - 1) * padding + margin * 2;
  const sheetHeight = rows * spriteSize + Math.max(0, rows - 1) * padding + margin * 2;
  return { rows, sheetWidth, sheetHeight };
}

// プレビューに収めるためのスケールを決定
function determineScale(sheetWidth, sheetHeight) {
  if (sheetWidth === 0 || sheetHeight === 0) {
    return 1;
  }
  const maxSide = Math.max(sheetWidth, sheetHeight);
  const fitScale = canvasSize / maxSide;
  if (fitScale >= 1) {
    const integerScale = Math.floor(fitScale);
    return Math.min(4, Math.max(1, integerScale));
  }
  return fitScale;
}

// シート全体を中央に配置するためのオフセットを計算
function calculateSheetOffset(sheetWidth, sheetHeight, scale) {
  const drawnWidth = sheetWidth * scale;
  const drawnHeight = sheetHeight * scale;
  return {
    x: (canvasSize - drawnWidth) / 2,
    y: (canvasSize - drawnHeight) / 2
  };
}

// プレビュー情報の表示を更新
function updatePreviewStatistics() {
  const metrics = calculateSheetMetrics(state.sprites.length);
  if (domRefs.previewInfo) {
    domRefs.previewInfo.textContent =
      `スプライト数: ${state.sprites.length}個 / サイズ: ${metrics.sheetWidth}x${metrics.sheetHeight}px / グリッド: ${state.layout.columns}列x${metrics.rows}行`;
  }
  return metrics;
}

// スプライト一覧の表示を更新
function renderSpriteList() {
  if (!domRefs.spriteList) {
    return;
  }

  domRefs.spriteList.innerHTML = "";
  const fragment = document.createDocumentFragment();

  state.sprites.forEach((sprite, index) => {
    const card = document.createElement("div");
    card.className = "sprite-card";

    const thumbWrapper = document.createElement("div");
    thumbWrapper.className = "sprite-thumb";

    const indexLabel = document.createElement("span");
    indexLabel.className = "sprite-index";
    indexLabel.textContent = `#${index}`;
    thumbWrapper.appendChild(indexLabel);

    const thumbnailCanvas = createSpriteThumbnail(sprite.data);
    thumbWrapper.appendChild(thumbnailCanvas);

    const deleteButton = document.createElement("button");
    deleteButton.className = "sprite-delete";
    deleteButton.type = "button";
    deleteButton.textContent = "削除";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = sprite.id;

    card.appendChild(thumbWrapper);
    card.appendChild(deleteButton);
    fragment.appendChild(card);
  });

  domRefs.spriteList.appendChild(fragment);
  updateSpriteListEmptyState();
  updateExportButtonState();
}

// サムネイル用のCanvasを生成
function createSpriteThumbnail(sprite) {
  const scale = 4;
  const size = spriteSpec.edge;
  const canvas = document.createElement("canvas");
  canvas.width = size * scale;
  canvas.height = size * scale;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return canvas;
  }
  ctx.imageSmoothingEnabled = false;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const value = sprite[y][x];
      if (value === 0) {
        continue;
      }
      ctx.fillStyle = palette[value] || "#000000";
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas;
}

// スプライト一覧の空状態表示を制御
function updateSpriteListEmptyState() {
  if (!domRefs.spriteListEmpty) {
    return;
  }
  domRefs.spriteListEmpty.hidden = state.sprites.length > 0;
}

// 出力ボタンの活性状態を更新
function updateExportButtonState() {
  if (!domRefs.exportButton) {
    return;
  }
  const shouldDisable = state.sprites.length === 0;
  domRefs.exportButton.disabled = shouldDisable;
  domRefs.exportButton.title = shouldDisable
    ? "スプライトを追加するとPNG出力できます。"
    : "";
}

// スプライト一覧で削除ボタンが押されたときの処理
function handleSpriteListClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const button = target.closest("button");
  if (!button || button.dataset.action !== "delete") {
    return;
  }
  const spriteId = button.dataset.id;
  removeSpriteById(spriteId);
}

// 指定IDのスプライトを削除
function removeSpriteById(spriteId) {
  const nextSprites = state.sprites.filter((sprite) => sprite.id !== spriteId);
  if (nextSprites.length === state.sprites.length) {
    updateErrorMessage("指定されたスプライトが見つかりませんでした。");
    return;
  }
  state.sprites = nextSprites;
  renderSpriteList();
  updateErrorMessage("スプライトを削除しました。");
  loop();
  redraw();
}

// スプライトIDを生成
function generateSpriteId() {
  const timestamp = Date.now();
  const randomSuffix = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, "0");
  return `sprite_${timestamp}_${randomSuffix}`;
}

// エラーメッセージ表示を更新
function updateErrorMessage(message) {
  if (!domRefs.errorMessage) {
    return;
  }
  domRefs.errorMessage.textContent = message;
}

// タイムスタンプ文字列を生成
function formatTimestamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}_` +
    `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  );
}

// テキスト入力を解析してスプライト配列を検証
function parseSpriteText(rawText) {
  if (!rawText) {
    return {
      ok: false,
      message: "配列データが空です。"
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(rawText);
  } catch (error) {
    return {
      ok: false,
      message: "配列の形式が正しくありません。"
    };
  }

  if (!Array.isArray(parsed)) {
    return {
      ok: false,
      message: "配列の最上位は一次元配列である必要があります。"
    };
  }

  if (parsed.length !== spriteSpec.edge) {
    return {
      ok: false,
      message: `行数が${spriteSpec.edge}ではありません（現在: ${parsed.length}行）。`
    };
  }

  for (let rowIndex = 0; rowIndex < parsed.length; rowIndex += 1) {
    const row = parsed[rowIndex];
    if (!Array.isArray(row)) {
      return {
        ok: false,
        message: `${rowIndex + 1}行目が配列ではありません。`
      };
    }

    if (row.length !== spriteSpec.edge) {
      return {
        ok: false,
        message: `${rowIndex + 1}行目の列数が${spriteSpec.edge}ではありません（現在: ${row.length}列）。`
      };
    }

    for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
      const value = row[colIndex];
      if (typeof value !== "number" || Number.isNaN(value)) {
        return {
          ok: false,
          message: `${rowIndex + 1}行${colIndex + 1}列が数値ではありません（値: ${value}）。`
        };
      }
      if (!Number.isInteger(value)) {
        return {
          ok: false,
          message: `${rowIndex + 1}行${colIndex + 1}列が整数ではありません（値: ${value}）。`
        };
      }
      if (value < spriteSpec.minValue || value > spriteSpec.maxValue) {
        return {
          ok: false,
          message: `${rowIndex + 1}行${colIndex + 1}列の値が範囲外です（値: ${value}、範囲: ${spriteSpec.minValue}-${spriteSpec.maxValue}）。`
        };
      }
    }
  }

  return {
    ok: true,
    data: parsed
  };
}

// レイアウト設定を適用して再描画
function applyLayoutSettings(nextLayout) {
  state.layout = {
    ...state.layout,
    ...nextLayout,
    spriteSize: spriteSpec.edge
  };
  syncLayoutSelectors();
  updateExportButtonState();
  loop();
  redraw();
}

// セレクタ表示を現在値に合わせる
function syncLayoutSelectors() {
  if (domRefs.layoutColumns) {
    domRefs.layoutColumns.value = String(state.layout.columns);
  }
  if (domRefs.layoutPadding) {
    domRefs.layoutPadding.value = String(state.layout.padding);
  }
  if (domRefs.layoutMargin) {
    domRefs.layoutMargin.value = String(state.layout.margin);
  }
  if (domRefs.layoutExportPadding) {
    domRefs.layoutExportPadding.value = String(state.layout.exportPadding);
  }
  if (domRefs.layoutPreset) {
    domRefs.layoutPreset.value = resolveLayoutPresetKey();
  }
}

// レイアウトセレクト変更時の処理
function handleLayoutSelectChange() {
  const columns = parseInt(domRefs.layoutColumns?.value ?? state.layout.columns, 10);
  const padding = parseInt(domRefs.layoutPadding?.value ?? state.layout.padding, 10);
  const margin = parseInt(domRefs.layoutMargin?.value ?? state.layout.margin, 10);
  const exportPadding = parseInt(domRefs.layoutExportPadding?.value ?? state.layout.exportPadding, 10);

  applyLayoutSettings({
    columns: clamp(columns, 1, 16),
    padding: clamp(padding, 0, 4),
    margin: clamp(margin, 0, 4),
    exportPadding: clamp(exportPadding, 0, 4)
  });

  updateErrorMessage("レイアウト設定を更新しました。");
}

// プリセット変更時の処理
function handleLayoutPresetChange() {
  const presetKey = domRefs.layoutPreset?.value ?? "default";
  const preset = layoutPresets[presetKey];
  if (!preset) {
    return;
  }
  applyLayoutSettings(preset);
  const label = domRefs.layoutPreset?.selectedOptions?.[0]?.textContent ?? "プリセット";
  updateErrorMessage(`プリセット「${label}」を適用しました。`);
}

// 数値を範囲内に収める
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// 現在の設定がどのプリセットに該当するか判定
function resolveLayoutPresetKey() {
  const { columns, padding, margin, exportPadding } = state.layout;
  for (const [key, preset] of Object.entries(layoutPresets)) {
    if (!preset) {
      continue;
    }
    if (preset.columns === columns && preset.padding === padding && preset.margin === margin && preset.exportPadding === exportPadding) {
      return key;
    }
  }
  return "custom";
}

// 出力用スプライトシートCanvasを生成
function generateSpriteSheetCanvas(metrics, layout = state.layout, scale = 1) {
  const { columns, padding, margin, spriteSize } = layout;
  const { sheetWidth, sheetHeight } = metrics;
  const canvas = document.createElement("canvas");
  canvas.width = sheetWidth * scale;
  canvas.height = sheetHeight * scale;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return null;
  }
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, sheetWidth * scale, sheetHeight * scale);

  state.sprites.forEach((spriteItem, index) => {
    const sprite = spriteItem.data;
    const col = index % columns;
    const row = Math.floor(index / columns);
    const baseX = (margin + col * (spriteSize + padding)) * scale;
    const baseY = (margin + row * (spriteSize + padding)) * scale;
    for (let y = 0; y < spriteSize; y += 1) {
      for (let x = 0; x < spriteSize; x += 1) {
        const value = sprite[y][x];
        if (value === 0) {
          continue;
        }
        ctx.fillStyle = palette[value] || "#000000";
        ctx.fillRect(baseX + x * scale, baseY + y * scale, scale, scale);
      }
    }
  });

  return canvas;
}

// 単体スプライトをPNG用キャンバスに変換
function generateSingleSpriteCanvas(sprite, scale = 1) {
  const size = spriteSpec.edge;
  const canvas = document.createElement("canvas");
  canvas.width = size * scale;
  canvas.height = size * scale;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) {
    return null;
  }
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size * scale, size * scale);

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const value = sprite[y][x];
      if (value === 0) {
        continue;
      }
      ctx.fillStyle = palette[value] || "#000000";
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas;
}

// CanvasをPNGとしてダウンロード
function downloadCanvasAsPng(canvas, options) {
  const timestamp = formatTimestamp(new Date());
  let filename;
  if (options?.type === "single") {
    filename = `sprite_${timestamp}.png`;
  } else {
    const columns = options?.columns ?? state.layout.columns;
    const rows = options?.rows ?? calculateSheetMetrics(state.sprites.length).rows;
    filename = `spritesheet_${columns}x${rows}_${timestamp}.png`;
  }
  const triggerDownload = (blob) => {
    if (!blob) {
      updateErrorMessage("PNG出力に失敗しました。");
      return;
    }
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    updateErrorMessage(`PNGファイル「${filename}」をダウンロードしました。`);
  };

  if (canvas.toBlob) {
    canvas.toBlob((blob) => triggerDownload(blob), "image/png");
  } else {
    const dataUrl = canvas.toDataURL("image/png");
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const buffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i += 1) {
      buffer[i] = byteString.charCodeAt(i);
    }
    triggerDownload(new Blob([buffer], { type: mimeString }));
  }
}
