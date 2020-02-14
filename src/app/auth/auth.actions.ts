import { Action } from '@ngrx/store';

export const SET_AUTHETICATED = '[auth] Set Authenticated';
export const SET_UNAUTHETICATED = '[auth] Set Unauthenticated';

export class SetAuthenticated implements Action {
    readonly type = SET_AUTHETICATED;
}

export class SetUnauthenticated implements Action {
    readonly type = SET_UNAUTHETICATED;
}
export type AuthActions = SetAuthenticated | SetUnauthenticated;
