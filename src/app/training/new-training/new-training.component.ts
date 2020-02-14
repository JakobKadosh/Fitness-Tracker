import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import 'firebase/firestore';
import {  Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { Exercise } from '../exercise.model';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {

  exercises$: Observable<Exercise[]>;
  isLaoding$: Observable<boolean>;


  constructor(private trainingService: TrainingService,
              private store: Store<fromTraining.State>
              ) { }

  ngOnInit() {
   this.isLaoding$ = this.store.select(fromRoot.getIsLoading);
   this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
   this.fetchExercises();
  }
  fetchExercises() {
    this.trainingService.fetchAvailableExercises();

  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

}
