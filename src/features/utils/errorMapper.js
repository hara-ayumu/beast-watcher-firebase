import { ValidationError, ServiceError } from '../../errors';

import { ERROR_CODES } from '../sightings/constants/errorCodes';
import { ERROR_MESSAGES } from '../sightings/constants/errorMessages';

/**
 * Firebase エラーを解析してユーザー向けのメッセージに変換
 * @param {Error} error - Firebase から投げられたエラー
 * @returns {string} - ユーザー向けメッセージ
 */
const parseFirebaseError = (error) => {
    if (!error || !error.code) {
        return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
    }

    const errorCode = error.code;

    // Firestore セキュリティルール関連のエラー
    const firestoreErrors = {
        'permission-denied': 'アクセス権限がありません。',
        'unauthenticated': 'ログインが必要です。',
        'not-found': 'データが見つかりませんでした。',
        'already-exists': 'データが既に存在します。',
        'resource-exhausted': 'リクエスト制限を超えました。時間をおいて再度お試しください。',
        'failed-precondition': 'データの整合性チェックに失敗しました。',
        'aborted': '処理が中断されました。再度お試しください。',
        'out-of-range': '入力値が範囲外です。',
        'internal': 'サーバー内部エラーが発生しました。',
        'unavailable': 'サービスが一時的に利用できません。',
        'deadline-exceeded': 'タイムアウトしました。再度お試しください。',
    };

    // Authentication 関連のエラー
    const authErrors = {
        'auth/invalid-email': 'メールアドレスの形式が正しくありません。',
        'auth/user-disabled': 'このアカウントは無効化されています。',
        'auth/user-not-found': 'ユーザーが見つかりません。',
        'auth/wrong-password': 'パスワードが正しくありません。',
        'auth/email-already-in-use': 'このメールアドレスは既に使用されています。',
        'auth/weak-password': 'パスワードが弱すぎます。',
    };

    const message = firestoreErrors[errorCode] || 
                    authErrors[errorCode] || 
                    ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];

    // 開発環境でのみログ出力
    const isDev = import.meta.env.VITE_APP_ENV === 'development';
    if (isDev && !firestoreErrors[errorCode] && !authErrors[errorCode]) {
        console.warn('未知のFirebaseエラー:', errorCode, error.message);
    }

    return message;
};

/**
 * Errorオブジェクト（またはanything）をUI表示用の日本語メッセージに変換する
 * @param {any} err 受け取るエラー（serviceからthrowされるError、または未知の値）
 * @returns {string} UIに表示する日本語メッセージ（定数から必ず返す）
 */
export const mapErrorToUiMessage = (err) => {
    // ValidationError: 入力不備を優先的に返す
    if (err instanceof ValidationError) {
        return err.message;
    }

    // ServiceError: 内部にラップされた元エラー（SDK由来等）があればそちらを解析
    if (err instanceof ServiceError) {
        if (err.originalError && err.originalError.code) {
            const firebaseMessage = parseFirebaseError(err.originalError);
            if (firebaseMessage !== ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]) {
                return firebaseMessage;
            }
        }

        return ERROR_MESSAGES[err.code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
    }

    // 文字列が直接throwされた場合
    if (typeof err === 'string') {
        return err;
    }

    // 外部SDKエラー（Firebase等）が直接渡された場合の処理
    if (err && typeof err === 'object' && err.code) {
        const firebaseMessage = parseFirebaseError(err);
        if (firebaseMessage !== ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR]) {
            return firebaseMessage;
        }
        if (ERROR_MESSAGES[err.code]) {
            return ERROR_MESSAGES[err.code];
        }
    }

    // 標準のErrorオブジェクト: メッセージがあればそれを返す
    if (err && typeof err === 'object' && err.message) {
        return err.message;
    }

    return ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
};

/**
 * ValidationError からフィールド情報を取得
 * - UI側でエラーフィールドをハイライトするために使用
 * @param {any} err - 判定対象のエラー
 * @returns {Object|null} - { field: string, errors: Object } または null
 */
export const getValidationDetails = (err) => {
    if (err instanceof ValidationError) {
        return {
            field: err.field,
            errors: err.errors
        };
    }
    return null;
};
