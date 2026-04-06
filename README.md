# Beast Watcher（Firebase版）

## 概要

小規模自治体向けの野生動物目撃情報共有システムのMVP。
喬木村（長野県下伊那郡）をモデルケースとして、住民や事業所従事者などからの目撃情報の投稿・管理者によるレビュー・地図上での公開機能を実装。

> ⚠️ 本アプリはポートフォリオ用のMVPです。喬木村の公式サービスではありません。

## デモ

**URL**: https://beast-watcher-firebase.vercel.app

管理者画面を体験する場合は、ログイン画面の「デモアカウントでログイン」ボタンをご利用ください。

## 背景

2025年に飯田市の「いいだWebマップ」で野生動物の目撃情報が公開されていることを知り、
自身が訪れた沢城湖の近くでクマが出没していたことを後から知った経験から、
目撃情報のリアルタイムな共有の重要性を実感しました。

一方で、喬木村には同様の情報公開サービスが存在せず、
目撃情報の報告窓口も統一されていないと思われました。
住民が投稿し、役場職員が承認する形であれば、
小規模自治体でも低コストで運用可能な情報共有の仕組みが作れると考え、開発に着手しました。

## 主な機能

### 利用者画面

- 承認済みの目撃情報を地図上に表示
- 地図上で目撃地点を選択して投稿（匿名・アカウント不要）
- 利用規約（初回同意必須）・投稿方法の案内

### 管理者画面

- 投稿一覧のステータス別表示（未承認 / 承認済み / 却下済み）
- 投稿の承認 / 却下（レビューコメント記録可）
- レビュー時に投稿地点のエリア内外判定可（GeoJSON）
- テーブルの行選択で地図と連動操作可（該当投稿）

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フロントエンド | React 18 (Vite) |
| スタイリング | Tailwind CSS v4 |
| バックエンド | Firebase (Firestore / Authentication) |
| 地図 | Google Maps JavaScript API (@react-google-maps/api) |
| 地理判定 | turf.js (Point-in-Polygon) + 国土数値情報 GeoJSON |
| ホスティング | Vercel |

## 設計方針

### ディレクトリ構成

```
src/
├── components/          # 汎用UIコンポーネント（DataGrid, Tabs, LoadingBase）
├── errors/              # カスタムエラークラス（ServiceError, ValidationError）
├── features/
│   ├── auth/            # 認証（Firebase Auth, ProtectedRoute）
│   ├── common/          # 共通ローディングコンポーネント
│   ├── sightings/       # 目撃情報機能
│   │   ├── admin/       #   管理者側（AdminMap, ReviewConfirmModal 等）
│   │   ├── public/      #   利用者側（Map, AddSightingForm 等）
│   │   ├── constants/   #   定数・GeoJSON
│   │   ├── services/    #   Firestore操作
│   │   └── validation/  #   バリデーション・エリア判定
│   └── utils/           # 共通ユーティリティ（errorMapper）
├── layouts/             # ヘッダー等レイアウトコンポーネント
└── pages/               # ページコンポーネント（Home, Admin）
```

### データ設計

投稿データは2つのFirestoreコレクションで管理し、
未承認・却下済みの投稿を利用者画面に表示しないことで誤情報の拡散を防止するとともに、
管理者専用情報（レビュワー、コメント等）の漏洩を防止。

- **sightings_master**: 全投稿データ（管理者のみ参照可）
- **sightings_published**: 承認済みデータのみ（一般公開用）

承認・却下時はFirestoreトランザクションで master と published の整合性を保証。

### セキュリティルール

Firestoreのセキュリティルールは [`firestore.rules`](./firestore.rules) を参照。

| コレクション | 操作 | 許可対象 |
|-------------|------|---------|
| `sightings_master` | 作成 | 全員（アカウント不要） |
| `sightings_master` | 読み取り・更新 | 管理者のみ |
| `sightings_master` | 削除 | 禁止 |
| `sightings_published` | 読み取り | 全員 |
| `sightings_published` | 書き込み | 管理者のみ |

Firestoreセキュリティルールでもフロントと同様のバリデーションを実施（動物種・座標範囲・目撃日時の範囲・詳細文字数）。  
フロントの定数ファイル（`sightingTypes.js` / `sightingStatus.js` / `validationConstants.js`）との同期が必要。

### エラーハンドリング

- カスタムエラークラス（ServiceError / ValidationError）でエラーの種別を分類
- errorMapper でFirebaseのエラーコードをユーザー向けの日本語メッセージに変換
- サービス層でエラーを捕捉し、UI層にはユーザー向けメッセージのみを伝達

## セットアップ

### 必要なもの

- Node.js
- Firebaseプロジェクト（Firestore / Authentication 有効化済み）
- Maps JavaScript APIキー

### 環境変数

プロジェクトルートに `.env` を作成し、以下を設定：

```
VITE_APP_ENV=development
VITE_GOOGLE_MAPS_API_KEY=（Maps JavaScript APIキー）
VITE_FIREBASE_API_KEY=（Firebase APIキー）
VITE_FIREBASE_AUTH_DOMAIN=（Firebase Auth ドメイン）
VITE_FIREBASE_PROJECT_ID=（Firebase プロジェクトID）
VITE_FIREBASE_APP_ID=（Firebase アプリID）
```

### 起動

```bash
npm install
npm run dev
```

## Laravel版について

本リポジトリはMVP（Firebase版）です。  
Firebase版でフロントと基本的なフロー（投稿→レビュー）を確立した後、バックエンドをLaravel（REST API）+ Supabase（PostgreSQL）に移行したバージョンを別リポジトリで開発予定。

**Firebase版からの変更点：**

| 項目 | Firebase版（本リポジトリ） | Laravel版（開発予定） |
|------|--------------------------|---------------------|
| バックエンド | Firebase | Laravel（REST API） |
| DB | Firestore（NoSQL） | Supabase（PostgreSQL） |
| 認証（管理者） | Firebase Auth | Laravel Sanctum 等 |
| 認証（利用者） | なし（匿名投稿） | LINEログイン等 |
| 管理機能 | レビュー（承認・却下、コメント） | 投稿の編集・管理、ユーザー管理 |
| DataGrid | ステータス切替のみ | 並び替え・ページネーション・検索 |
| ホスティング | Vercel | Vercel（フロント）+ Render 等（API） |
