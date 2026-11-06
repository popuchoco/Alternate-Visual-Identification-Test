# 虹膜色彩校準｜Hue of the Fake — Radar Review

Review of the static build before this renovation (`index.html`, `style.css`, `game.js`, `images/`). Scores are 1–10. Evidence names the file or symbol and what the player actually meets. Axes that were already doing the short-story job are called out under **Keep**.

This is a narrative toy, not a systems game. Multiplayer, mod support, and a content catalog were not treated as missing features of the format. The weak scores are the ones a ten-minute browser horror piece can still fail: sound, a reason to sit through it again, and a few rough edges in the late UI.

## Scores before renovation

| Axis | Score | Player-facing evidence |
| --- | ---: | --- |
| 畫面表現 Aesthetics / Graphics | 7 | Strong palette shift; thin transitions, empty-image flash, hue row wraps |
| 遊戲玩法 Gameplay / Mechanics | 7 | Clear five-stage loop and a real final observation puzzle; early stages only record clicks |
| 劇情敘事 Story / Narrative | 8 | Gaslight interlude, fourth wall, many endings; payoff text is one template |
| 聲音效果 Audio / Sound | 3 | Optional, but not yet a score: two quiet sines and one sting |
| 耐玩價值 Replayability / Value | 4 | Endings branch, then the tab forgets you |
| 系統優化 Performance / Bug | 6 | Finishes reliably; one broken ending string, hue DOM rebuild, empty `src` |

### 1. 畫面表現 — 7

What works, and should stay, is the deliberate grade change. `revealAnomaly()` adds `body.unsettled` only after the first memory mismatch. `style.css` then crossfades the clinical cream/mint lab into teal, berry, and coral over `transition: background 1.2s`. The facility meter (`updateMonitor`, `#signal-meter`) and the scanline (`body::before`) sell the lab without a loading splash. The false-pass ending (`#screen-ending.false-pass`) is the best single frame in the game.

What the player feels as unfinished:

- `#vision-img` shipped with `src=""`. Several browsers request the page URL itself, so stage 3 can flash a broken or empty circle before `showVisionStep()` assigns `balloon_normal.jpg`.
- Record and final comparison images pop in with no placeholder (`renderRecordStep`, `initFaces`). On a slow phone that is a white hole inside the round frame.
- `#hue-container` was `flex-wrap: wrap` with blocks at `clamp(30px, 8vw, 48px)`. The 10-step coral round wraps to two lines on a 360px screen, so “left to right” stops being obvious.
- Tumbling E was a rotated Arial glyph (`.acuity-letter`). iOS and desktop rasterize that differently, and the row reflows when archive images arrive.
- Horror FX do not track the meter. `flicker()` and `.face-echo-arrival` are separate one-shots. Distortion climbs to 96 while the grade stays a single class toggle.
- `drawPlate()` restarted the echo animation with `void canvas.offsetWidth`, a forced reflow on the last plate.

### 2. 遊戲玩法 — 7

The loop in `showScreen` order is legible: plates → hue → interlude choice → vision → acuity → records → one-shot final submit. Hue keeps a locked reference swatch (`hueReference`) and allows one retry (`checkHue`). The final board (`finalComparisons`, `selectFinalVersion`) is the only stage that asks the player to look rather than click the labeled answer.

Limits, accepted for the length but still felt:

- `checkPlate()` always says 「答案已記錄」. Early vision and acuity do the same. That is the right narrative lie, and it also means the first half has no hit feel.
- `renderHue()` called `replaceChildren()` on every swap, so the selected swatch blinked and keyboard focus jumped back to the top of the row.
- Horror vision answers are authored labels (`扭曲的東西`, `有東西在窗戶裡`), not a second perception task. Fun is in noticing, and that noticing is saved for stage 5 and the final grid.

### 3. 劇情敘事 — 8

Best axis, and the reason the piece works.

- World is one night lab and one operator. `showInterlude()` quotes the player’s real first answer and then claims the archive stored `71`. That contradiction is the turn.
- `visibilitychange` rewrites `document.title` to 「你把它留在這裡了」 and, on return, 「你回來得很快」 plus `showAttentionNote('你回來了…')`. No camera, no microphone, no account. The intro already says the answers stay in the tab.
- `resolveFinalOutcome()` has a real matrix: report vs ignore, face-echo note, chart note, plate/hue/record thresholds, and a false-pass inside `ending === 'passed'`.
- Copy stays in the medical-disclaimer register (`不是醫療診斷`).

What keeps it from 9: every ending is the same card plus a paragraph. The player is not shown the accuracy the branch claims to use. `recordsScore` (see bugs) even prints the word “undefined” on the reclassified ending, which breaks the voice. There is no stage list before the reveal, so the first two tests feel unframed rather than “clinical on purpose.”

### 4. 聲音效果 — 3

`startAmbient()` builds two sine oscillators at 47 Hz and 49 Hz and sets gain to `0.018`. `sting()` is one sawtooth falling from 155 Hz to 42 Hz, used at the reveal, the jumpscare, and the false pass. The checkbox defaults to off, which is the correct call, and `AudioContext` is only constructed after a click.

That is the entire soundtrack. No layer enters after the mismatch. Wrong answers are silent. Reduced motion does not soften the sawtooth. There is no voice, and there should not be a fake one. As optional BGM it does not yet score the horror.

### 5. 耐玩價值 — 4

`ENDING` ids inside `resolveFinalOutcome()` are a real reason to change one choice and replay: report, ignore, leave the face note, miss the final grid. Hue order, record side, and acuity direction are reshuffled.

After `btn-restart` → `resetGame()`, all of that is gone. Nothing is written to `sessionStorage` or anywhere else. There is no NG+ line, no seen-ending list, and no score comparison. A second run is the first run again. That fits a short story if the first ending lands; it does not reward the accuracy the code already tracks.

Out of scope for this format, and not counted against the score: mods, multiplayer, a public leaderboard.

### 6. 系統優化 — 6

The page is one HTML file, no build, no network call, and it does not throw on the happy path in current Chrome. `prefers-reduced-motion` collapses animations. Buttons are real `<button>`s. The jumpscare uses `100dvh`.

Defects:

- **P0 text bug.** `resolveFinalOutcome()` builds `recordScore` and then interpolates `recordsScore` in the `reclassified` message. The player reads 「封存 undefined」. The branch is reachable: final grid all original, and `plateCorrect < 3` or `hueCorrectRounds < 2` or `recordsCorrect < 3`.
- **Focus loss.** `renderHue()` destroys the buttons that had focus.
- **Empty image request.** `src=""` on `#vision-img`.
- **Timer races.** The false-pass `setTimeout` / `triggerJumpScare` chain is only guarded by `screens.ending.classList.contains('active')`. A restart during the scare mostly survives; it is not cancelled.
- **Layout.** Hue wrap, acuity overflow, and the forced reflow on the last plate. Duplicate theme blocks in `style.css` (dark rules, then a full light override) are extra CSS the player never sees; left as P2.
- **Dead weight.** `images/chart_*.jpg` and `images/balloon_*_rect.jpg` are not referenced by `game.js` or `style.css`. Not deleted here; they may be source art.

No crash loop and no camera permission prompt. Compatibility target remains current desktop Chrome and iOS Safari, not legacy IE.

## Keep

These are the piece. The renovation does not replace them.

1. **Fourth-wall tab title.** `visibilitychange` in `game.js`. Leaving the tab after the mismatch changes the title; coming back is acknowledged in the page, not by a microphone or notification permission.
2. **Gradual uncanny color shift.** Clinical theme first. `body.unsettled` and the 1.2s background transition happen at `revealAnomaly()`, not on the title screen. Reduced motion still gets that slow crossfade; only fast animations are cut. The shift is the art direction, not a bug.
3. **No camera, no mic, no account, no server.** Stated on the title and enforced by the code: input is clicks and `document.hidden` only.
4. **Sound off by default**, and the disclaimer that this is not a vision or color-vision test.
5. **Static open-`index.html` / GitHub Pages** shape. Apache-2.0. No new third-party assets.

## Findings

### P0

| ID | Finding | Player effect |
| --- | --- | --- |
| P0-1 | `recordsScore` typo in `resolveFinalOutcome` | Reclassified ending shows “undefined” |
| P0-2 | Ambient bed is inaudible and does not escalate | Optional sound never becomes part of the mismatch |
| P0-3 | Hue row wraps; selection rebuilds the DOM | Sort feels broken on a phone and drops keyboard focus |
| P0-4 | Empty `src` and no image placeholder | Stage 3 and the archive flash empty frames |

### P1

| ID | Finding | Player effect |
| --- | --- | --- |
| P1-1 | Grade is a boolean, not the distortion meter | Late game looks the same at 30% and 90% |
| P1-2 | Endings do not show the accuracy they use | “Why this ending” is opaque |
| P1-3 | Restart wipes the tab’s only memory | No NG+, no seen-ending list |
| P1-4 | Sound and motion toggles lived only on the title card | Mute meant starting over; the warning over-promised 「可隨時關閉」 |
| P1-5 | Stale `setTimeout` chains | Restart during the false pass can still resolve a scare |

### P2

| ID | Finding | Player effect |
| --- | --- | --- |
| P2-1 | First ~340 lines of `style.css` are overridden by the light theme | No visual change; extra parse |
| P2-2 | Unreferenced `chart_*.jpg` and `*_rect.jpg` | Extra download only if something else points at them |
| P2-3 | No voice, no mod hooks, no cross-device save | Acceptable for this format; not scheduled |

## Renovation roadmap

Aimed at the low axes without adding a second campaign.

1. **Audio (P0-2, P1-4).** Keep the default mute. Synthesize in `AudioContext` (no CDN, no borrowed loops): a calm fifth during calibration, then a detuned low pair plus filtered noise after `revealAnomaly()`, with level tied to `distortion`. UI ticks for confirm / retry / mismatch. If reduced motion or 「閃爍效果」 is off, drop the LFO and the sawtooth sweep. Leave the toggle on screen for the whole sitting.
2. **Picture (P0-3, P0-4, P1-1).** One non-wrapping hue row. CSS tumbling E. Fade images in from a placeholder and preload the files the script actually uses. Drive a vignette and a vision-frame grade from `--grade`. Do not speed up or remove the 1.2s lab-to-horror crossfade.
3. **Narrative surface (story stays a short story).** Intro lists the five stages without naming the substitution. Ending card shows the accuracy already tracked and a tone class per ending family. Fix `recordScore`.
4. **Replay (P1-3).** `sessionStorage` only, key `hue-of-the-fake-session`. Seen ending titles, best archive score, and an epilogue that compares this run’s plate / hue / archive numbers with the previous snapshot. 「帶著殘檔再測」 adds one operator sentence after the mismatch, not before.
5. **Stability (P0-1, P1-5).** One `runToken` for delayed steps so restart cancels the scare. Preserve hue focus. No build step. `index.html` still opens directly.

Explicitly not in this pass: new endings that need new art, voice acting, deleting unused source images, rewriting the duplicated CSS theme, server saves, multiplayer.

## After this change (expected)

| Axis | Before | After | What changed for the player |
| --- | ---: | ---: | --- |
| 畫面表現 | 7 | 8 | Placeholders, single-row hue, sharper E, vignette follows the meter. Art files are the same, so this is not a 9. |
| 遊戲玩法 | 7 | 8 | Hue swaps keep focus; narrow screens scroll one row; the scorecard closes the loop. The route is still linear. |
| 劇情敘事 | 8 | 8 | Stage list, scorecard, and a replay epilogue make the existing branches legible. The plot is unchanged, so the score stays. |
| 聲音效果 | 3 | 7 | Optional clinical bed, post-mismatch unease, answer ticks. Still synthesized, still no voice. |
| 耐玩價值 | 4 | 7 | Same-tab ending list, accuracy epilogue, NG+ line. Dies with the tab, by design. |
| 系統優化 | 6 | 8 | Undefined score fixed, timers cancelled, less hue DOM thrash, no empty `src`. Not device-lab certified. |

## 驗證

Headless Chrome（1280×800 與 390×844）跑完一輪刻意校準失敗、最終四組都選原始影像的路徑，另開一輪「帶著殘檔再測」直到值班室。

- 環境音預設未勾，`AudioContext` 在勾選並按下開始前不會建立。
- `prefers-reduced-motion: reduce` 會取消勾選「閃爍效果」，並加上 `quiet-motion`。
- 390px 寬時，第 4 組 10 個色塊同一列、高度 30px，沒有換行，也沒有橫向溢出。方向鍵可把焦點從第一格移到下一格。
- 視標是三筆畫的 SVG。影像載入後才顯示。
- 結案為「受試者重新分類」，分數卡為色點 0/6、色相 0/4、封存 2/5 或 3/5，內文不再出現 `undefined`。
- 回到標題後看得到上次結案與「帶著殘檔再測」。第二輪的值班室訊息在「71」之後才補上殘檔，沒有提前改標題畫面的臨床口吻。
- 主控台沒有例外。

以上是這份修繕後分數的依據。沒有在實機 iOS Safari 上跑過；針對它做的是 `100dvh`、安全區、合成音只在點擊後建立，以及減少動態時不做音高滑動。
