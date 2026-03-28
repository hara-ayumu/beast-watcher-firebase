import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';

import takagiBoundary from '../constants/takagiBoundary.json';

/**
 * 指定座標が喬木村内かどうかを判定する
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @returns {boolean}
 */
export const isWithinTakagi = (lat, lng) => {
    const pt = point([lng, lat]); // GeoJSONは[lng, lat]順
    return booleanPointInPolygon(pt, takagiBoundary.features[0]);
};
