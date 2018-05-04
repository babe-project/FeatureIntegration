var intro = {
    // introduction title
    "title": "Welcome!",
    // introduction text
    "text": "Thank you for participating in our study. In this study you will look for letters among other letters. You will respond using the keyboard.",
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
    "text": "Each trial will start with a <b>'get ready' screen</b> in which you will be told what to look for on the next screen, the so-called <b>target</b>. You will then proceed to the <b>image screen</b> where you see a picture, containing colored letters. The target is either a green T, the letter S (no matter what its color is) or any letter (no matter which) of color blue. There is either exactly one target on the image screen, or there is no target. Your task is to <b>report as quickly and accurately as possible whether the target is on the screen or not</b>. <p> Use your keyboard to respond whether the target is present or absent from the screen. Place your left index finger on the F key and your right index finger on the J key. You will <b>respond to a present stimulus with the key (F or J) that corresponds to your dominant hand</b>. <p> Try to respond as fast as you can while remaining accurate. The first few trials are <b>practice trials</b>. You will receive <b>feedback</b> after each trial, telling you how fast you were and whether your answer was correct. Please <b>stay focused</b> during the whole experiment. You can take breaks for as long as you like while on the 'get ready' screen.",
    // instuction's slide proceeding button text
    "buttonText": "Go to practice session",
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

var pauseScreenPractice = {
    trials: 1,
    render: function(CT) {
        var trial_info = exp.trial_info.practice_trials[CT]
        if (trial_info.condition === 'feature') {
            var lookfor = "'S' or any blue letter";
        } else {
            var lookfor = "green 'T'";
        }
        var viewTemplate = $('#pauseScreen-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            lookfor: lookfor,
			f: exp.global_data.f,
        	j: exp.global_data.j
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
        var trial_info = exp.trial_info.practice_trials[CT]
        if (trial_info.condition === 'feature') {
            var description = "'S' or any blue letter";
        } else {
            var description = "green 'T'";
        }
        var viewTemplate = $("#practice-view").html();
        $('#main').html(Mustache.render(viewTemplate, {
        title: this.title,
        description: description,
        f: exp.global_data.f,
        j: exp.global_data.j,
        countdown: ''
        }));

        console.log(trial_info['trial']);

        function displayCountdown(number) {
            $('#countdown').text(number)
        }

        displayCountdown(2)
        setTimeout(function() {displayCountdown(1)}, 1000)
        setTimeout(function() {displayCountdown('+')}, 2000)
        setTimeout(function() {displayCountdown('')}, 3000);

        // creates the picture
        var canvas = createCanvas();
        var startingTime;
        var keyPressed, correctness;

        setTimeout(function() {
            canvas.draw(trial_info)
            startingTime = Date.now();
            $('body').on('keyup', handleKeyUp);
        }, 3000);
        console.log(trial_info['trial']);

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

            if ((trial_info.trial === 'negative' && exp.global_data[key] === 'absent') ||
                (trial_info.trial === 'positive' && exp.global_data[key] === 'present')) {
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
                size: trial_info.size,
                condition: trial_info.condition,
                trial: trial_info.trial,
                f: exp.global_data.f,
                j: exp.global_data.j,
                keyPressed: keyPressed,
                correctness: correctness,
                RT: RT
            };

            exp.trial_data.push(trial_data);
			exp.practice_progress ++;
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


var pauseScreenMain = {
    trials: 1,
    render: function(CT) {
        var trial_info = exp.trial_info.main_trials[CT]
        if (trial_info.condition === 'feature') {
            var lookfor = "'S' or any blue letter";
        } else {
            var lookfor = "green 'T'";
        }
        var viewTemplate = $('#pauseScreen-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            lookfor: lookfor,
			f: exp.global_data.f,
        	j: exp.global_data.j
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


var main = {
    trials : 1,
    render : function(CT) {
        var viewName = 'main';
        var trial_info = exp.trial_info.main_trials[CT];
        if (trial_info.condition === 'feature') {
            var description = "'S' or any blue letter";
        } else {
            var description = "green 'T'";
        }
	// fill variables in view-template
        var viewTemplate = $('#main-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
        description: description,
        f: exp.global_data.f,
        j: exp.global_data.j
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
        var keyPressed, correctness;
		var filled = exp.currentMainTrial * (180 / exp.main_trial_count);
        var startingTime;

        // update the progress bar
        $('#filled').css('width', filled);

        setTimeout(function() {
            canvas.draw(trial_info)
            startingTime = Date.now();
            $('body').on('keyup', handleKeyUp);
        }, 3000);
        console.log(trial_info['trial']);

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

            if ((trial_info.trial === 'negative' && exp.global_data[key] === 'absent') ||
                (trial_info.trial === 'positive' && exp.global_data[key] === 'present')) {
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
                size: trial_info.size,
                condition: trial_info.condition,
                trial: trial_info.trial,
                f: exp.global_data.f,
                j: exp.global_data.j,
                keyPressed: keyPressed,
                correctness: correctness,
                RT: RT
            };

            exp.trial_data.push(trial_data);
			exp.main_progress ++;
        };

    }
};


var feedbackPractice = {
    render: function(CT) {
        viewTemplate = $('#feedbackPractice-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            // get correctness and RT from most recent trial
            correctness: exp.trial_data[exp.trial_data.length - 1].correctness,
            RT: exp.trial_data[exp.trial_data.length - 1].RT
        }));

		// update the progress bar
		var filled = exp.practice_progress * (180 / exp.practice_trial_count);
        $('#filled').css('width', filled);
		
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

var feedbackMain = {
    render: function(CT) {
        viewTemplate = $('#feedbackPractice-view').html();
        $('#main').html(Mustache.render(viewTemplate, {
            // get correctness and RT from most recent trial
            correctness: exp.trial_data[exp.trial_data.length - 1].correctness,
            RT: exp.trial_data[exp.trial_data.length - 1].RT
        }));

		// update the progress bar
		var filled = exp.main_progress * (180 / exp.main_trial_count);
        $('#filled').css('width', filled);
		
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
    "text": "Please fill in the following information. Leaving a comment is optional.",
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
            exp.global_data.education = $('#education').val();
            exp.global_data.languages = $('#studentID').val();
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
