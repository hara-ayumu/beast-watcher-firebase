/**
 * バリデーションエラー専用クラス
 * - フォームやデータ検証で発生するエラー
 * - ユーザーに具体的な修正方法を示すメッセージを持つ
 * 
 * @example
 * throw new ValidationError('動物の種類を選択してください', 'animal_type');
 */
export class ValidationError extends Error {
    /**
     * @param {string} message - ユーザーに表示するエラーメッセージ
     * @param {string} [field=null] - エラーが発生したフィールド名
     * @param {Object} [errors=null] - 複数フィールドのエラー情報
     */
    constructor(message, field = null, errors = null) {
        super(message);
        this.name = 'ValidationError';
        this.isValidation = true;
        this.field = field;
        this.errors = errors;

        // Error.captureStackTrace が利用可能な環境（V8エンジン等）でスタックトレースを記録
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ValidationError);
        }
    }
}
