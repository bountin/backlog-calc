
import moment from 'moment';

export function validateProjectDates (startDate, endDate) {
    return endDate.isAfter(startDate);
}

export function validateBacklogSize(backlogSize, weeklyPoints) {
    return backlogSize > 0 && weeklyPoints > 0 && weeklyPoints < backlogSize;
}
