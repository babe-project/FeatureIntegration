// customize the experiment by specifying a view order and a trial structure
exp.customize = function() {

	// record current date and time in global_data
    this.global_data.startDate = Date();
    this.global_data.startTime = Date.now();

    // specify view order
    this.views_seq = [intro,
		      instructions,
                      loop([pauseScreen, practice, feedback], 2),
                      beginMainExp,
                      loop([pauseScreen, main, feedback], 2),
                      postTest,
                      thanks];

    // prepare information about trials (procedure)
    // randomize main trial order, but keep practice trial order fixed

    this.trial_info.main_trials = main_trials;
    this.trial_info.practice_trials = practice_trials;

};
