import { ERROR_CODES } from '../sightings/constants/errorCodes';
import { ERROR_MESSAGES } from '../sightings/constants/errorMessages';

/**
 * Errorオブジェクト（またはanything）をUI表示用の日本語メッセージに変換する
 * @param {any} err 受け取るエラー（serviceからthrowされるError、または未知の値）
 * @returns {string} UIに表示する日本語メッセージ（定数から必ず返す）
 */
export const mapErrorToUiMessage = (err) => {
    let code = ERROR_CODES.UNKNOWN_ERROR;

    if (err && typeof err === 'object' && 'code' in err) {
        code = err.code;
    }
    return ERROR_MESSAGES[code] || ERROR_MESSAGES[ERROR_CODES.UNKNOWN_ERROR];
};