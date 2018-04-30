var intro = {
    // introduction title
    "title": "Welcome!",
    // introduction text
    "text": "Thank you for participating in our study. In this study, you will see pictures and click on buttons.",
    // introduction's slide proceeding button text
    "buttonText": "Begin experiment",
    // render function renders the view
    render: function() {

        viewTemplate = $('#intro-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            button: this.buttonText
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    // for how many trials should this view be repeated?
    trials: 1
}

var instructions = {
     // instruction's title
    "title": "Instructions",
    // instruction's text
    "text": "On each trial, you will see a question and two response options. Please select the response option you like most. We start with two practice trials.",
    // instuction's slide proceeding button text
    "buttonText": "Go to practice trial",
    render: function() {

        viewTemplate = $("#instructions-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            button: this.buttonText
        }));

        $('#dominant-hand').on('change', function() {
            $('#next').removeClass('nodisplay');
        });

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.global_data.dominantHand = $('#dominant-hand').val();

            if (exp.global_data.dominantHand === 'right') {
                exp.global_data.j = 'present';
                exp.global_data.f = 'absent';
            } else  {
                exp.global_data.f = 'present';
                exp.global_data.j = 'absent';
            }
            exp.findNextView();
        });

    },
    trials: 1
}

var pauseScreen = {
    render: function() {
        var viewTemplate = $('#pauseScreen-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            countdown: 'pause'
        }));
        var handleKeyUp = function(e) {
            if (e.which === 74) {
                keyPressed = 'j';
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else if (e.which === 70) {
                keyPressed = 'f';
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else if (e.which === 32) {
                keyPressed = 'space';
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else {
                console.debug('some other key pressed');
            }
        };

        $('body').on('keyup', handleKeyUp);
    }
}

var practice = {
    "title": "Practice trial",

    render: function (CT) {
        if (exp.trial_info.practice_trials[CT].condition === 'feature') {
            var description = 'look for: letter S or a blue letter';
        } else {
            var description = 'look for for: green T';
        }
        var viewTemplate = $("#practice-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
        title: this.title,
        description: description,
        f: exp.global_data.f,
        j: exp.global_data.j,
        countdown: ''
        }));

        function displayCountdown(number) {
            $('#countdown').text(number)
        }

        displayCountdown(2)
        setTimeout(function() {displayCountdown(1)}, 1000)
        setTimeout(function() {displayCountdown('+')}, 2000)
        setTimeout(function() {displayCountdown('')}, 3000)

        // creates the picture
        var canvas = createCanvas();
        var startingTime = Date.now();
        var keyPressed, correctness;

        setTimeout(function() {
            canvas.draw(exp.trial_info.practice_trials[CT])
            $('body').on('keyup', handleKeyUp);
        }, 3000);
        console.log(exp.trial_info.practice_trials[CT]['trial']);

        var handleKeyUp = function(e) {
            if (e.which === 74) {
                keyPressed = 'j';
                correctness = isCorrect('j');
                recordData();
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else if (e.which === 70) {
                keyPressed = 'f';
                correctness = isCorrect('f');
                recordData();
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else {
                console.debug('some other key pressed');
            }
        };



        var isCorrect = function(key) {
            var correctness;

            if ((exp.trial_info.practice_trials[CT].trial === 'negative' && exp.global_data[key] === 'absent') ||
                (exp.trial_info.practice_trials[CT].trial === 'positive' && exp.global_data[key] === 'present')) {
                correctness = 'correct';
            } else {
                correctness = 'incorrect';
            }

            return correctness;
        };

        var recordData = function() {
            var RT = Date.now() - startingTime; // measure RT before anything else

            trial_data = {
                trial_type: "practice",
                trial_number: CT+1,
                size: exp.trial_info.practice_trials[CT].size,
                condition: exp.trial_info.practice_trials[CT].condition,
                trial: exp.trial_info.practice_trials[CT].trial,
                f: exp.global_data.f,
                j: exp.global_data.j,
                keyPressed: keyPressed,
                correctness: correctness,
                RT: RT - 3000 // subtract time before stimulus is shown
            };

            exp.trial_data.push(trial_data);
        };
    },

    trials: 1
};

var beginMainExp = {
    "text": "Now that you have acquainted yourself with the procedure of the task, the actual experiment will begin.",
    render: function() {

        viewTemplate = $('#begin-exp-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            text: this.text
        }));

        // moves to the next view
        $('#next').on('click', function(e) {
            exp.findNextView();
        });

    },
    trials: 1
}


var main = {
	trials : 1,
    render : function(CT) {
        if (exp.trial_info.main_trials[CT].condition === 'feature') {
            var description = 'look for: letter S or a blue letter';
        } else {
            var description = 'look for for: green T';
        }
		// fill variables in view-template
        var viewTemplate = $('#main-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
        description: description,
        f: exp.global_data.f,
        j: exp.global_data.j
        }));

        // creates the picture
        var canvas = createCanvas();
        var startingTime = Date.now();
        var keyPressed, correctness;
        var filled = CT * (180 / exp.views_seq[exp.currentViewCounter].trials);

        canvas.draw(exp.trial_info.main_trials[CT]);
        // update the progress bar
        $('#filled').css('width', filled);

        var handleKeyUp = function(e) {
            if (e.which === 74) {
                keyPressed = 'j';
                correctness = isCorrect('j');
                recordData();
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else if (e.which === 70) {
                keyPressed = 'f';
                correctness = isCorrect('f');
                recordData();
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else {
                console.debug('some other key pressed');
            }
        };

        $('body').on('keyup', handleKeyUp);

        var isCorrect = function(key) {
            var correctness;

            if ((exp.trial_info.main_trials[CT].trial === 'negative' && exp.global_data[key] === 'absent') ||
                (exp.trial_info.main_trials[CT].trial === 'positive' && exp.global_data[key] === 'present')) {
                correctness = 'correct';
            } else {
                correctness = 'incorrect';
            }

            return correctness;
        };

        var recordData = function() {
            var RT = Date.now() - startingTime; // measure RT before anything else

            trial_data = {
                trial_type: "main",
                trial_number: CT+1,
                size: exp.trial_info.main_trials[CT].size,
                condition: exp.trial_info.main_trials[CT].condition,
                trial: exp.trial_info.main_trials[CT].trial,
                f: exp.global_data.f,
                j: exp.global_data.j,
                keyPressed: keyPressed,
                correctness: correctness,
                RT: RT
            };

            exp.trial_data.push(trial_data);
        };

    }
};


var feedback = {
    render: function(CT) {
        viewTemplate = $('#feedback-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            // get correctness and RT from most recent trial
            correctness: exp.trial_data[exp.trial_data.length - 1].correctness,
            RT: exp.trial_data[exp.trial_data.length - 1].RT
        }));

        var handleKeyUp = function(e) {
            if (e.which === 74) {
                keyPressed = 'j';
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else if (e.which === 70) {
                keyPressed = 'f';
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else if (e.which === 32) {
                keyPressed = 'space';
                $('body').off('keyup', handleKeyUp);
                exp.findNextView();
            } else {
                console.debug('some other key pressed');
            }
        };

        $('body').on('keyup', handleKeyUp);
    },
    trials : 1
}



var postTest = {
    "title": "Additional Info",
    "text": "Answering the following questions is optional, but will help us understand your answers.",
    "buttonText": "Continue",
    render : function() {

        viewTemplate = $('#post-test-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            title: this.title,
            text: this.text,
            buttonText: this.buttonText
        }));

        $('#next').on('click', function(e) {
            // prevents the form from submitting
            e.preventDefault();

            // records the post test info
            exp.global_data.age = $('#age').val();
            exp.global_data.gender = $('#gender').val();
            exp.global_data.education = $('#education').val();
            exp.global_data.languages = $('#languages').val();
            exp.global_data.comments = $('#comments').val().trim();
            exp.global_data.endTime = Date.now();
            exp.global_data.timeSpent = (exp.global_data.endTime - exp.global_data.startTime) / 60000;

            // moves to the next view
            exp.findNextView();
        })

    },
    trials: 1
};

var thanks = {
    "message": "Thank you for taking part in this experiment!",
    render: function() {

        viewTemplate = $('#thanks-view').html();

        // what is seen on the screen depends on the used deploy method
		//    normally, you do not need to modify this
        if ((config_deploy.is_MTurk) || (config_deploy.deployMethod === 'directLink')) {
            // updates the fields in the hidden form with info for the MTurk's server
            $('#main').html(Mustache.render(viewTemplate, {
                thanksMessage: this.message,
            }));
        } else if (config_deploy.deployMethod === 'Prolific') {
            var prolificURL = 'https://prolific.ac/submissions/complete?cc=' + config_deploy.prolificCode;

            $('main').html(Mustache.render(viewTemplate, {
                thanksMessage: this.message,
                extraMessage: "Please press the button below<br />" + '<a href=' + prolificURL +  ' class="prolific-url">Finished!</a>'
            }));
        } else if (config_deploy.deployMethod === 'debug') {
            $('main').html(Mustache.render(viewTemplate, {}));
        } else {
            console.log('no such config_deploy.deployMethod');
        }

        exp.submit();

    },
    trials: 1
}
