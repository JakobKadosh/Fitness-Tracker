import { UIActions, START_LOADING, STOP_LOADING } from './ui.actions';

export interface State {
    isLaoding: boolean;
}
const initialState: State = {
    isLaoding: false
};

export function uiReducer(state = initialState, action: UIActions) {
    switch (action.type) {
        case START_LOADING:
            return {
                isLaoding: true
            };
        case STOP_LOADING:
            return {
                isLaoding: false
            };
        default:
            return state;
    }
}

export const getIsLaoding = (state: State) => state.isLaoding;
