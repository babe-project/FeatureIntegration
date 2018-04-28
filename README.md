# Replication of Experiment I of Treisman & Gelade (1980)

This implementation builds on the [minimal template](https://github.com/babe-project/MinimalTemplate) (in the version of commit 715be35a327c54f3f6ae07320d4c622ad2970721), using [_babe](https://babe-project.github.io/babe_site/).

## Cloning and running the experiment

```
# clone the repo, e.g.:
git clone https://github.com/babe-project/FeatureIntegration.git

# go to 'FeatureIntegration'

# open 'index.html' in the browser to see the experiment
```

## Description of the experiment

### Design

Participants see displays of colored letters. Displays vary in *size*, i.e., the total number of colored letters. Participants are asked to search the display for a target which is specified by a verbal description before the visual display is shown. The target is in the display (so-called *positive trials*) or it is not (so-called *negative trials*). If they find the target, participants press a response button (either J or F) with their dominant/writing hand; if they are convinced that the target is absent from the display, they press the button (J or F) associated with their non-dominant hand. Participants are instructed to be as accurate and as fast as possible. After each trial, they see a feedback screen showing whether the last answer was correct, the reaction time for the last trial, as well as their current percentage of correct answers and the current mean reaction time over all trials so far.

There are two types of theoretically interesting conditions. On *feature trials* participants look for a target which distinguishes itself in a single feature dimension (color or letter type) from all of the present *distractors*. On *conjunction trials*, the target shares one feature (color or letter type) with all the distractors, but is distinguished as the only element that has both features at the same time.

### Materials

Visual displays consist of colored letters. Distractors are the same for both feature trials and conjunction trials, namely brown T's and green X's. The size of a display is either 1, 5, 15 or 30. On positive trials, where the target is in the display, the distractors (if there are any) consists in equal proportion of brown T's and green X's. On negative trials, there is a random choice to fill up the display with an additional brown T or an additional green X.

In feature trials, participants are instructed to search for a blue letter or the letter S. So the single target in any positive feature trial is a random choice of: (i) a blue T, (ii) a blue X, (iii) a brown S, or (iv) a green S. (There is always only one target and participants should click the button as soon as they have found it, but participants are not told that they will be looking for a blue letter in the next trial, not a letter S; they will always be instructed to look for either a blue letter or a letter S.)

In condition trials, the target is always a green T.

On each trial letters are placed on completely random positions on a grid. (E.g.: associate the whole canvas with cells, number them according to their position, draw the required number of positions (without replacement) and place the letters there.)

### Procedure

Participants must first answer whether their dominant hand is left or right. If it is right, they should press button J when they have found the target, and F otherwise. If their dominant hand is left, they should respond with the reverse assignment of buttons.

After explaining the task, there will be XX practice trials in which already feedback on response accuracy and speed is given. Then there are YY main trials, before a final post-test survey.

Practice and main trials are exactly identical. On each trial, participants see a *pause screen* (with just "PAUSE") on the screen. By clicking either F, J or SPACE (or, alternatively, any button whatsoever), they proceed to a *"get ready" screen* with a count down, starting at 2, then after one second showing 1, then showing a fixation cross for another second in the middle of the where the display (canvas) will appear next. Reaction times are measured form the onset of the visual display. After a button response, participants go the *feedback screen* where they see whether their last answer was correct and what their reaction time was. After a button click, they go to the next round starting with a *pause screen*.
