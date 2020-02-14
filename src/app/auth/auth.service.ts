import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';

@Injectable()
export class AuthService {

    constructor(private router: Router,
                private afAuth: AngularFireAuth,
                private trainingService: TrainingService,
                private uiService: UIService,
                private store: Store<{ui: fromRoot.State}>) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.store.dispatch(new Auth.SetAuthenticated());
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancellSubscriptions();
                this.store.dispatch(new Auth.SetUnauthenticated());
                this.router.navigate(['/login']);
            }
        });
    }
    registerUser(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.afAuth
        .createUserWithEmailAndPassword(authData.email, authData.password)
        .then(() => {
            this.store.dispatch(new UI.StopLoading());

            this.uiService.showSnackBar('Registered Successfully', null, 4500);
        }).catch(err => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(err.message, null, 4500);
        });
    }
    login(authData: AuthData) {
        this.store.dispatch(new UI.StartLoading());
        this.afAuth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(() => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar('Login Successfully', null, 4500);
        })
        .catch(err => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackBar(err.message, null, 4500);
        });
    }
    logout() {
        this.afAuth.signOut();
        this.uiService.showSnackBar('Logged out.', null, 4500);
    }

}
