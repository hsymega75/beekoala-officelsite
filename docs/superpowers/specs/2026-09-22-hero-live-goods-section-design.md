# ヒーロー表示修正・Live見出し変更・GOODSセクション追加

## 背景・目的

本番公開に向けた最終調整として、3点の小さな修正・追加を行う。

## 変更内容

### 1. ヒーロータイトルの改行を削除

`index.html:346` の `BEE<br/>KOALA` から `<br/>` を削除し `BEE KOALA` に変更する。現状はモバイル・デスクトップともに強制改行で「BEE」「KOALA」が縦に並んでしまっているため、1行表示（横並び）にする。

### 2. Liveセクション見出しの文言変更

`index.html:537` の見出し「NEXT GIGS」を「LIVE SCHEDULE」に変更する。

### 3. GOODSセクションの新設（SUZURI連携）

SUZURI（https://suzuri.jp/BEEKOALA）で販売中のグッズをサイト内で打ち出すため、静的なCTAバナー形式の新セクションを追加する。

- **配置:** `<section id="member">` と `<section id="live">` の間に `<section id="goods">` を新設
- **中身:** 既存のカードデザイン（白背景・`border-4 border-punk-black`・`solid-shadow`）を踏襲した1枚のCTAカード
  - ラベル: 「OFFICIAL GOODS」
  - 見出し: 「SUZURIでグッズ販売中」
  - ボタン: 「SHOP ON SUZURI」— `https://suzuri.jp/BEEKOALA` を新規タブで開く（`target="_blank" rel="noopener noreferrer"`）
- **ナビ更新:** デスクトップnav（PHILOSOPHY / MEDIA / MEMBER の並び）に「GOODS」を追加し `#goods` にスクロールする。モバイルドロップダウンメニューにも同様に追加する
- **フッター更新:** 既存の「MERCHANDISE」リンク（現状 `href="#"`）を同じSUZURI URLに更新し、`target="_blank" rel="noopener noreferrer"` を付与する

## スコープ外

- SUZURI APIを使った商品情報の動的取得・商品画像の表示（今回は静的CTAバナーのみ）
- SUZURI以外の外部ECサイトとの連携

## 検証方法

- ブラウザでモバイル幅・デスクトップ幅の両方で「BEE KOALA」が1行で表示されることを確認
- Liveセクションの見出しが「LIVE SCHEDULE」になっていることを確認
- GOODSセクションが表示され、ボタンをクリックすると新規タブで https://suzuri.jp/BEEKOALA が開くことを確認
- デスクトップnav・モバイルメニュー双方に「GOODS」リンクがあり、クリックでGOODSセクションにスクロールすることを確認
- フッターの「MERCHANDISE」リンクが同じくSUZURIへ新規タブで遷移することを確認
