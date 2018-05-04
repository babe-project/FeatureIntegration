// trial generation
function generateTrial() {
    var size = _.sample([1, 5, 15, 30]);
    var trial = _.sample(['positive', 'negative']);
    var condition = _.sample(['conjunction', 'feature']);
    return {size: size, trial: trial, condition: condition};
};


function generateTrials(n) {
    var trials = [];
    for (var i = 0; i < n; i++) {
        trials.push(generateTrial());
    }
    return trials;
};

// produces one complete set of all 16 conditions
function enumerateTrials() {
	var sizeList = [1, 5, 15, 30];
    var trialList = ['positive', 'negative'];
    var conditionList = ['conjunction', 'feature'];
	var trials = [];
	for (var i = 0; i < sizeList.length; i++) {
		for (var j = 0; j < trialList.length; j++) {
			for (var k = 0; k < conditionList.length; k++) {
				trials.push({size: sizeList[i],
							trial: trialList[j],
							condition: conditionList[k]});
			}
		}	
	}
	return trials;
}
