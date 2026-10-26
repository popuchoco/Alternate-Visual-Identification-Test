# 虹膜色彩校準｜Hue of the Fake

一款以視力測驗為入口的短篇心理恐怖網頁遊戲。玩家先在明亮、友善的色彩研究室完成色點辨讀與漸層排序；直到校準結果第一次與玩家自己的記憶衝突，畫面才轉為濃郁的青綠、莓紫與珊瑚紅，逐步把熟悉的人與物推向不自然。

## 敘事節奏

1. **色點辨讀**：三張圓形色點圖，以普通的校準語氣作答。
2. **色相排序**：四組循序增加至 6、7、8、10 格；每組固定第一格作為參照，其餘色塊重排。錯誤不會打斷測驗，也不會在恐怖尚未揭露前暗示「有人」或「異常」。
3. **記憶錯位**：完成前兩類測驗後，值班室才指出玩家剛才實際按下的答案，與封存紀錄中的「71」互相矛盾。
4. **熟悉事物變形**：氣球、小屋、人像與視力表先以正常影像出現，再逐步回放被改寫的版本。
5. **記憶核對與結局**：玩家比較正常／異常備份、決定是否回報、最後辨認替換者；前段的色點、色相與回憶準確度會影響判定。

## 網頁原生的第四面牆

異常揭露後，若玩家切換離開此分頁，瀏覽器分頁標題會短暫改變；回到遊戲時，頁面會直接回應「你回來了」。遊戲只讀取本頁的可見狀態，選擇只存在此分頁的執行記憶，不使用鏡頭、麥克風、帳號或伺服器提交。

## 操作與可及性

- 色相色塊以點選兩格交換，鍵盤可透過原生按鈕操作；手機版支援捲動與窄畫面。
- 聲音預設關閉；可關閉動態效果。支援系統的減少動態偏好。
- 直接以瀏覽器開啟 `index.html`，或用 GitHub Pages 發佈根目錄即可遊玩，不需要建置或伺服器。
- 色點與視力表是敘事道具，不是色弱、視力或醫療診斷工具。

## GitHub Pages

靜態檔案位於 repository 根目錄。在 **Settings → Pages** 設定由 `main` 分支的根目錄部署；確認 Pages 已啟用後，推送更新會自動發佈。

## 設計參考與授權處理

視覺節奏參考了 [EnChroma 色覺測試](https://enchroma.com/pages/test) 與 [Arealme 色相測試](https://www.arealme.com/color-hue-test/zh/) 的「先作答、再逐步增加辨識難度」感受。恐怖遊戲參考僅用於理解氣氛、觸發節奏與規則線索的設計方向：

- [Midnight Visitors](https://github.com/KishorePaul0205/Midnight-Visitors---A-Short-Horror-Game-Built-in-Unreal-Engine)
- [Blocky Horror (Three.js)](https://github.com/zhulinghao/Blocky_Horror_Three.js-horror-game)
- [Godot Horror Demo 2D](https://github.com/NuclearPhoenixx/Godot-Horror-Demo-2D)
- [Unity RuleNonsense](https://github.com/Vae078/Unity_RuleNonsense)
- [Duo-Cai-You-Xi](https://github.com/EmbraceAGI/Duo-Cai-You-Xi)
- [Duo-Cai-You-Xi 的規則怪談解謎腳本](https://github.com/EmbraceAGI/Duo-Cai-You-Xi/blob/main/%E3%80%90DallE-3%E7%89%88%E6%9C%AC%E3%80%91%E8%A7%84%E5%88%99%E6%80%AA%E8%B0%88%E8%A7%A3%E8%B0%9C%E6%B8%B8%E6%88%8F.txt)
- [Rulekeeper](https://github.com/dongsheng123132/rulekeeper)
- [Stranger Rules Web](https://github.com/wjt2018/stranger-rules-web)

本次改版沒有複製上述作品的程式碼、圖像、音訊或劇本文字；只將一般性的節奏與互動概念轉寫成原創的視力測驗敘事。這份專案原本沒有附 `LICENSE`；本次不替既有專案或圖片擅自指定新授權，也不把參考作品的授權套用到本專案。若要對外授權整個 repository，仍需先確認原始碼與現有圖片的權利人。
