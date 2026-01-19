import { SIGHTING_STATUS } from './sightingStatus';

export const STATUS_MARKER_ICONS = {
    [SIGHTING_STATUS.PENDING]: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
    [SIGHTING_STATUS.APPROVED]: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
    [SIGHTING_STATUS.REJECTED]: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
};

export const POST_PLAN_POINT_MARKER_ICON = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';