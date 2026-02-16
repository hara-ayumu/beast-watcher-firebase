/**
 * サービスレイヤーエラー専用クラス
 * - DB操作、API通信、システムエラーなど
 * - ユーザーには汎用メッセージを表示
 * - 開発者向けに詳細情報を保持
 * 
 * @example
 * throw new ServiceError(ERROR_CODES.CREATE_SIGHTING_FAILED, originalError);
 */
export class ServiceError extends Error {
    /**
     * @param {string} code - エラーコード（ERROR_CODES から）
     * @param {Error} [originalError=null] - 元のエラーオブジェクト
     * @param {Object} [context=null] - エラー発生時のコンテキスト情報
     */
    constructor(code, originalError = null, context = null) {
        super(code);
        this.name = 'ServiceError';
        this.code = code;
        this.originalError = originalError;
        this.context = context;

        // 開発環境でのみ元のエラーをログ出力
        if (import.meta.env.VITE_APP_ENV === 'development' && originalError) {
            console.error(`[ServiceError] ${code}`, originalError);
        }

        // Error.captureStackTrace が利用可能な環境（V8エンジン等）でスタックトレースを記録
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ServiceError);
        }
    }
}
