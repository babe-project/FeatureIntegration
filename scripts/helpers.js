// insert any functions that are useful throughout the experiment here
var shuffleComb = function(comb) {
    // while this one is trivial, this just to show that we CAN define a function here
    return _.shuffle(comb);
};


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
