import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAININGS = '[training] Set Available Trainings';
export const SET_FINISHED_TRAININGS = '[training] Set Finished Trainings';
export const START_TRAINING = '[training] Start Training';
export const STOP_TRAINING = '[training] Stop Training';

export class SetAvailableTrainings implements Action {
    readonly type = SET_AVAILABLE_TRAININGS;
    constructor(public paylaod: Exercise[]) {}
}

export class SetFinishedTrainings implements Action {
    readonly type = SET_FINISHED_TRAININGS;
    constructor(public paylaod: Exercise[]) {}
}
export class StartTraining implements Action {
    readonly type = START_TRAINING;
    constructor(public paylaod: string) {}
}
export class StopTraining implements Action {
    readonly type = STOP_TRAINING;
}

export type TrainingsActions = SetAvailableTrainings | SetFinishedTrainings | StartTraining | StopTraining;
