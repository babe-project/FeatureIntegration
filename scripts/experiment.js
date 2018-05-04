// customize the experiment by specifying a view order and a trial structure
exp.customize = function() {

	// record current date and time in global_data
    this.global_data.startDate = Date();
    this.global_data.startTime = Date.now();

    // specify view order
    this.views_seq = [intro,
                      instructions,
//                      loop([pauseScreenPractice, practice, feedbackPractice], 2),
//                      beginMainExp,
                      loop([pauseScreenMain, main, feedbackMain], 6),
                      postTest,
                      thanks];

    // prepare information about trials (procedure)
    // randomize main trial order, but keep practice trial order fixed

	// enumerateTrials() gives a random shuffle of all 16 possible conditions
	// make sure that these are enough for the number of trials implied by views_seq;
	// otherwise the experiment will crash with an error!
    this.trial_info.main_trials = _.shuffle(enumerateTrials()); 
    this.trial_info.practice_trials = _.shuffle(enumerateTrials());
	
	// manually specify how many trials (of each type) there are;
	// this is important for the progress bar
	this.practice_trial_count = 2
	this.main_trial_count = 6
	// counter for the progress bars
	this.main_progress = 0
	this.practice_progress = 0

};
