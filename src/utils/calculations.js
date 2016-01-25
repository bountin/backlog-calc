/** Number of iterations - higher means slower but more accurate */
const STEPS = 1000;
/** Puffer für realistischen zusätzlichen Backlogumfang */
const BACKLOG_INCREASE_REALISTIC = 0.15;
/** Puffer für pessimistischen zusätzlichen Backlogumfang */
const BACKLOG_INCREASE_PESSIMISTIC = 0.40;
/** Velocity Einbruch-Faktor */
const VELOCITY_REDUCTION = -0.15;
/** Velocity Steigerungsfaktor */
const VELOCITY_INCREASE = 0.15;
/** Minimum probability to count a result as success */
const SUCCESS_THRESHOLD = 0.8;
/** Maximum aggregation of probRel. TODO: Not needed for closed formula. */
const PROB_REL_SUM = ((STEPS - 2) * STEPS) / (6 * (STEPS - 1));

/**
 * Calculates the probability of finishing the project within the given duration.
 *
 * @param {number} backlogSize - The total number of story points in the backlog.
 * @param {number} velocity    - The weekly velocity in story points.
 * @param {number} duration    - The full project duration in days.
 *
 * @returns {number} An estimate on the project success between 0 and 1, higher
 * number means more likely. Any number higher than {@link SUCCESS_THRESHOLD}
 * indicates a probable project success.
 */
export function successProbability(backlogSize, velocity, duration) {
	let probRel = 0;

	// Calculates a fraction of the area under (x * (1 - x))
	// PROB_REL_SUM should be the complete area, which is (1 / 6)
	for (let i = 0; i < STEPS; ++i) {
		probRel += (i / (STEPS - 1)) * (1 - i / (STEPS - 1));

		if (probableDuration(backlogSize, velocity, i / (STEPS - 1)) >= duration) {
			return probRel / PROB_REL_SUM;
		}
	}

	return 1;
}

/**
 * Calculates the most likely duration of the project with the given data.
 *
 * @param {number} backlogSize - The total number of story points in the backlog.
 * @param {number} velocity    - The weekly velocity in story points.
 *
 * @returns {number} An estimate on the real project duration in days. Depending
 * on the success rate, this number can be higher or lower than the actually
 * planned project duration.
 */
export function successDuration(backlogSize, velocity) {
	let probRel = 0;

	// calculates a fraction of the area under x * (1 - x)
	// PROB_REL_SUM should be the complete area, which is (1 / 6)
	for (let i = 0; i < STEPS; ++i) {
		probRel += (i / (STEPS - 1)) * (1 - i / (STEPS - 1));

		const probability = probRel / PROB_REL_SUM;
		if (probability >= SUCCESS_THRESHOLD) {
			return Math.ceil(probableDuration(backlogSize, velocity, i / (STEPS - 1)));
		}
	}
}

/**
 * Estimates whether the specified project will be completed in time.
 *
 * @param {number} backlogSize - The total number of story points in the backlog.
 * @param {number} velocity    - The weekly velocity in story points.
 * @param {number} duration    - The full project duration in days.
 *
 * @returns {boolean}
 */
export function isSuccessful(backlogSize, velocity, duration) {
	return successProbability(backlogSize, velocity, duration) >= SUCCESS_THRESHOLD;
}

/**
 * Calculates the maximum amount of storypoints the backlog could contain within
 * the given duration.
 *
 * @param {number} backlogSize - The total number of story points in the backlog.
 * @param {number} velocity    - The weekly velocity in story points.
 * @param {number} duration    - The full project duration in days.
 *
 * @returns {number} An estimate on the biggest backlog, a team could handle with
 * the given velocity in the given time frame. Unit: Story Points.
 *
 * TODO: Refactor the backlogSize parameter - replace with closed formula.
 */
export function successBacklogSize(velocity, duration) {
	let minBacklogSize = 0;
	let maxBacklogSize = 8; // _must_ be power of 2!

	while (isSuccessful(maxBacklogSize, velocity, duration)) {
		minBacklogSize = maxBacklogSize;
		maxBacklogSize *= 2;
	}

	let step = (maxBacklogSize - minBacklogSize) / 4;
	let backlogSize = (minBacklogSize + maxBacklogSize) / 2;

	while (step >= 1) {
		let sign = isSuccessful(backlogSize, velocity, duration) ? 1 : -1;
		backlogSize += step * sign;
		step /= 2;
	}

	if (!isSuccessful(backlogSize, velocity, duration)) {
		return backlogSize - 1;
	}

	if (isSuccessful(backlogSize + 1, velocity, duration)) {
		return backlogSize + 1;
	}

	return backlogSize;
}

/**
 * Calculates the value for a given probability p within a 3-Point-Estimation.
 *
 * @param {number} opt  - The most optimistic data point
 * @param {number} real - A realistic data point
 * @param {number} pess - The most pessimistic data point
 * @param {number} p    - A value between 0 (optimistic) and 1 (pessimistic)
 *
 * @returns {number}
 */
function threePointValue(opt, real, pess, p) {
	const k = (real - opt) / (pess - opt);
	if (p <= k) {
		return opt + Math.sqrt(p * (real - opt) * (pess - opt));
	} else {
		const x = (p - 1) * (opt - pess) * (pess - real);
		return x < 1E-6 ? pess : pess - Math.sqrt(x);
	}
}

/**
 * Calculates the most probable duration for the specified backlog.
 *
 * @param {number} backlogSize - The total number of story points in the backlog.
 * @param {number} velocity    - The weekly velocity in story points.
 * @param {number} p           - A value between 0 (optimistic) and 1 (pessimistic)
 * @returns {number}
 */
function probableDuration(backlogSize, velocity, p) {
	const backlogSizeOpt = backlogSize;
	const backlogSizeReal = backlogSize * (1 + BACKLOG_INCREASE_REALISTIC);
	const backlogSizePess = backlogSize * (1 + BACKLOG_INCREASE_PESSIMISTIC);

	const velocityOpt = Math.round(velocity * (1 + VELOCITY_INCREASE)) / 7;
	const velocityReal = velocity / 7;
	const velocityPess = Math.round(velocity * (1 + VELOCITY_REDUCTION)) / 7;

	const probableBacklogSize = threePointValue(backlogSizeOpt, backlogSizeReal, backlogSizePess, p);
	const probableVelocity = threePointValue(velocityPess, velocityReal, velocityOpt, 1 - p);

	return probableBacklogSize / probableVelocity;
}
