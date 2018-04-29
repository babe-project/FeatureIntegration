var createCanvas = function() {
    var canvas = {};
    // contains the letters position
    var coordsCollection = [];

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

    var createNoTarget = function() {
        var target = {};
        target.letter = ['X', 'T'][Math.floor(Math.random() * 2)];

        if (target.letter === 'T') {
            target.color = 'brown';
        } else {
            target.color = 'green';
        }

        return target;
    };

    var generateCoords = function() {
        var min = 50;

        var maxWidth = $('#canvas').width() - 40;
        var maxHeight = $('#canvas').height() - 40;
        var xPos = Math.floor(Math.random() * (maxWidth - min)) + min;
        var yPos = Math.floor(Math.random() * (maxHeight - min)) + min;
        return {xPos: xPos, yPos: yPos};
    };

    var checkCoords = function(xPos, yPos) {
        for (var i=0; i<coordsCollection.length; i++) {
            if (((xPos + 50) > coordsCollection[i]["xPos"])
                && ((xPos - 50) < coordsCollection[i]["xPos"])
                && ((yPos + 50) > coordsCollection[i]["yPos"])
                && ((yPos - 50) < coordsCollection[i]["yPos"])) {
                return false;
            };
        };
        
        return true;
    };

    var positionLetter = function() {
        var coords = generateCoords();
        if (checkCoords(coords["xPos"], coords["yPos"])) {
            coordsCollection.push(coords);
        } else {
            positionLetter();
        };
    };

    var getPositions = function(size) {
        while (coordsCollection.length <= size) {
            positionLetter();
        };

        return coordsCollection;
    };

    canvas.draw = function(trial_info) {
        var trial = trial_info['trial'];
        var condition = trial_info['condition'];
        var size = trial_info['size'];
        var canvas = document.querySelector('#canvas');
        var context = canvas.getContext('2d');
        var coords = getPositions(trial_info['size'] - 1);
        var target;
        console.log(coords.length);

        if (trial === 'positive') {
            target = createTarget(condition);
        } else {
            target = createNoTarget();
        }

        for (var i=0; i<(size - 1); i++) {
            var pos = Math.floor(Math.random() * coords.length);
            var c = coords[pos];
            coords.splice(pos, 1);

            if (i < (size - 1) / 2) {
                context.fillStyle = 'brown';
                context.font = '28px sans-serif';
                context.fillText('T', c['xPos'], c['yPos']);
            } else {
                context.fillStyle = 'green';
                context.font = '28px sans-serif';
                context.fillText('X', c['xPos'], c['yPos']);
            }
        }

        // draw the target (or dummy target)
        context.fillStyle = target.color;
        context.font = '28px sans-serif';
        context.fillText(target.letter, coords[0]['xPos'], coords[0]['yPos']);
    };

    return canvas;
};