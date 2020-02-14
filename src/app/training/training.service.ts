import { Exercise } from './exercise.model';
import { Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable()
export class TrainingService {
    private fbSubs: Subscription[] = [];
    userMail: string;
    constructor(private db: AngularFirestore,
                private uiService: UIService,
                private afAuth: AngularFireAuth,
                private store: Store<{ ui: fromTraining.State }>) {
        this.afAuth.authState.subscribe(user => {
            if (user) { this.userMail = user.email; }
        });
    }

    fetchAvailableExercises() {
        this.store.dispatch(new UI.StartLoading());
        this.fbSubs.push(this.db.collection('exercises')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        name: doc.payload.doc.data()['name'],
                        duration: doc.payload.doc.data()['duration'],
                        calories: doc.payload.doc.data()['calories'],
                        videoUrl: doc.payload.doc.data()['videoUrl']
                    };
                }, err => {
                    this.uiService.showSnackBar(err.message, null, 4500);
                });
            }).subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetAvailableTrainings(exercises));
            }, error => {
                this.store.dispatch(new UI.StopLoading());
                console.error(error);
                this.uiService.showSnackBar('Fetching available exercises faild. Try again later.', null, 4500);
                this.store.dispatch(new Training.SetAvailableTrainings(null));
            }));
    }
    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId));
        this.uiService.showSnackBar('Start!! NO PAIN NO GAIN!!', null, 4500);
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveTraining).pipe(take(1))
            .subscribe(ex => {
                this.addDataToDB({
                    ...ex,
                    date: new Date(),
                    state: 'Completed',
                    userMail: this.userMail
                });
                this.store.dispatch(new Training.StopTraining());
                this.uiService.showSnackBar('Well Done!!', null, 4500);
            });
    }
    cancelExercise(progress: number) {

        this.store.select(fromTraining.getActiveTraining).pipe(take(1))
            .subscribe(ex => {
                this.addDataToDB({
                    ...ex,
                    duration: ex.duration * (progress / 100),
                    calories: ex.calories * (progress / 100),
                    userMail: this.userMail,
                    date: new Date(),
                    state: 'Cancelled'
                });
            });
        this.store.dispatch(new Training.StopTraining());
        this.uiService.showSnackBar('Why R U being so lazy ?! Your\'e stronger then you think!', null, 4500);

    }
    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db.collection('finishedExercises', ref => ref.where('userMail', '==', this.userMail))
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
            }, error => {
                this.uiService.showSnackBar(error.message, null, 4500);
            }));
    }
    cancellSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }
    private addDataToDB(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }

}
