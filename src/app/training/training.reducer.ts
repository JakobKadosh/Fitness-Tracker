import {
    SET_AVAILABLE_TRAININGS,
    SET_FINISHED_TRAININGS,
    START_TRAINING,
    STOP_TRAINING,
    TrainingsActions
} from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
    availableExcersises: Exercise[];
    finishedExercises: Exercise[];
    activeTraining: Exercise;
}
export interface State extends fromRoot.State {
    training: TrainingState;
}


const initialState: TrainingState = {
    availableExcersises: [],
    finishedExercises: [],
    activeTraining: null
};

export function trainingsReducer(state = initialState, action: TrainingsActions) {
    switch (action.type) {
        case SET_AVAILABLE_TRAININGS:
            return {
                ...state,
                availableExcersises: action.paylaod
            };
        case SET_FINISHED_TRAININGS:
            return {
                ...state,
                finishedExercises: action.paylaod
            };
        case START_TRAINING:
            return {
                ...state,
                activeTraining: {...state.availableExcersises.find(ex => ex.id ===  action.paylaod)}
            };
        case STOP_TRAINING:
            return {
                ...state,
                activeTraining: null
            };
        default:
            return state;
    }
}

export const getTrainingState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExcersises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);
