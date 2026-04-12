# LeetCode Rating Viewer

一款顯示 LeetCode 題目對應週賽分數的 Chrome Extension，除了顯示題目分數外，如果那題有知名博主[灵茶山艾府 [0x3F]](https://space.bilibili.com/206214)寫的題解，也會顯示對應題解的連結。

## 安裝

1. git clone 這個 repo：`git clone https://github.com/WithGJR/leetcode-rating-viewer`。
2. 開啟擴充功能管理員：在 Chrome 網址列輸入 `chrome://extensions/`。
3. 啟用開發者模式：開啟頁面右上角的「開發人員模式」。
4. 載入擴充功能：點擊「載入未封裝項目」，選擇剛剛 clone 下來的資料夾位置即可完成安裝(**注意：安裝後請重新整理 LeetCode 頁面以利腳本生效。**)

## 功能

1. 於 LeetCode [問題列表頁面](https://leetcode.com/problemset/)會顯示題目對應的分數（但不會顯示0x3f題解連結）
2. 只有進入某個 LeetCode 問題頁面時，才會顯示題目對應的分數以及題解連結。

## 致謝

1. 感謝灵茶山艾府 [0x3F]提供的優質算法題解。
2. 本工具使用的難度分數與題解對應資料皆由 [huxulm/lc-rating](https://github.com/huxulm/lc-rating) 提供，感謝 huxulm 大佬的開源貢獻。