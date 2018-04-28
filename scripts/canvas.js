var createCanvas = function() {
    var canvas = {};

    var createTarget = function(condition) {
        console.log('condition: ' + condition);
        var target = {};

        if (condition === 'conjunction') {
            target.letter = 'T';
            target.color = 'green';
        } else if (condition === 'feature') {
            var feature = ['letter', 'color'][Math.floor(Math.random() * 2)];

            if (feature === 'letter') {
                target.letter = 'S';
                target.color = ['brown', 'green'][Math.floor(Math.random() * 2)];
            } else {
                target.letter = ['X', 'T'][Math.floor(Math.random() * 2)];
                target.color = 'blue';
            }
        } else {
            console.debug('no such condition');
        }

        return target;
    };

    var createDummyTarget = function() {
        var target = {};
        target.letter = ['X', 'T'][Math.floor(Math.random() * 2)];

        if (target.letter === 'T') {
            target.color = 'brown';
        } else {
            target.color = 'green';
        }

        return target;
    };

    canvas.draw = function(trial_info) {
        var canvas = document.querySelector('#canvas');
        var context = canvas.getContext('2d');
        console.log(context);
        var trial = trial_info['trial'];
        var condition = trial_info['condition'];
        var target;

        if (trial === 'positive') {
            target = createTarget(condition);
        } else {
            target = createDummyTarget();
        }

        context.fillStyle = target.color;
        context.font = "48px monospace";
        context.fillText(target.letter, 50, 100);
    };

    return canvas;
};