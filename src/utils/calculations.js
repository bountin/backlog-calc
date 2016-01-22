export default function successfulProject(startDate, endDate, velocity, backlogSize) {
	// parameters, fixed for now
	var blSizeReal = 0.4; // Puffer für realistischen zusätzlichen Backlogumfang
	var blSizePess = 3.0; // Puffer für pessimistischen zusätzlichen Backlogumfang
	var velRed = -0.15; // Velocity Einbruch-Faktor
	var velAdd = 0.15; // Velocity Steigerungsfaktor
	var minPercent = 0.8;
	var p = reliableScrumProbabilityByDuration(
		backlogSize,
		backlogSize * (1 + blSizeReal),
		backlogSize * (1 + blSizePess),
		Math.round(velocity * (1 + velAdd)) / 7,
		velocity / 7,
		Math.round(velocity * (1 + velRed)) / 7,
		endDate.diff(startDate, 'days')
	);
	return p >= minPercent;
}

const STEPS = 1000;

function v3P(O, r, P, W) {
	var k = ((r - O) / (P - O));
	if (W <= k) {
		return O + Math.sqrt(W * (r - O) * (P - O));
	} else {
		if ((Math.pow(P, 2) - W * (P - O) * (P - r) + (r - O) * (P - r) - 2 * P * r + Math.pow(r, 2)) < 1E-06) {
			return P;
		} else {
			return P - Math.sqrt(Math.pow(P, 2) - W * (P - O) * (P - r) + (r - O) * (P - r) - 2 * P * r + Math.pow(r, 2));
		}
	}
}

function reliableScrumProbabilityByDuration(backlogSizeOpt,
                                            backlogSizeReal,
                                            backlogSizePess,
                                            velocityOpt,
                                            velocityReal,
                                            velodityPess,
                                            time) {
	var probRel = 0, probRel100 = ((STEPS - 2) * STEPS) / (6 * (STEPS - 1));
	for (var i = 0; i < STEPS; ++i) {
		probRel += (i / (STEPS - 1)) * (1 - i / (STEPS - 1));
		var duration = v3P(backlogSizeOpt, backlogSizeReal,
				backlogSizePess, (i / (STEPS - 1))) /
			v3P(velodityPess, velocityReal,
				velocityOpt, (1 - (i / (STEPS - 1))));
		if (duration >= time) return probRel / probRel100;
	}
	throw "Invalid State, no Probability for given Duration found";
}
