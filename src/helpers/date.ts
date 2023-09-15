export namespace DateHelper {
    export const getNowDate = (): {
        year: number,
        month: number,
        day: number,
    } => {
        const now = new Date();
        return {
            year: now.getUTCFullYear(),
            month: now.getUTCMonth() + 1,
            day: now.getUTCDate(),
        };
    };

    export const getNowThai = (): string => {

        const { DateTime } = require('luxon');

        // กำหนดโซนเวลาของประเทศไทย
        const timeZone = 'Asia/Bangkok';

        // ดึงเวลาปัจจุบันของประเทศไทย
        const currentTime = DateTime.now().setZone(timeZone).setLocale('th').toFormat('dd MMM yyyy เวลา HH:mm');

        return currentTime;
    }

}