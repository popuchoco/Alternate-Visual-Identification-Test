# 色彩偽人檢測 (Hue of the Fake)

一個結合色盲測試、色相敏感度測試與「分辨偽人」的恐怖網頁遊戲。

## 遊戲概念

你被困在一個「色彩檢測中心」。偽人（偽裝成人類的存在）已經滲透了社會，而他們的色彩感知存在缺陷。只有通過色盲板與色相排序測試的人，才有資格進入最終階段——辨識真正的人類與偽人。

- **階段一**：Ishihara 風格色盲板（簡化版）
- **階段二**：色相漸變排序（靈感來自 arealme Color Hue Test）
- **最終階段**：根據色相異常找出偽人

失敗會觸發恐怖氛圍與壞結局。

## 部署到 GitHub Pages

1. 建立一個新的 GitHub Repository（例如 `color-fake-human`）
2. 將此資料夾內的 `index.html`、`style.css`、`game.js` 上傳到 repository 根目錄
3. 進入 Settings → Pages
4. Source 選擇 `Deploy from a branch`，Branch 選 `main` / `(root)`
5. 儲存後，幾分鐘內即可透過 `https://你的帳號.github.io/repository名稱/` 遊玩

## 本地測試

直接用瀏覽器打開 `index.html` 即可（無需伺服器）。

## 擴充建議

- 加入真正的 Ishihara 點陣生成（目前為簡化版）
- 增加更多色板與難度
- 加入音效（Web Audio API 或免費音檔）
- 讓偽人臉部使用更複雜的 SVG 或 Canvas 繪製
- 加入「偽人已經注意到你」的隨機事件

## 免責聲明

此為娛樂用途的恐怖遊戲，並非真正的色彩視覺診斷工具。實際色盲檢測請諮詢眼科醫師。
