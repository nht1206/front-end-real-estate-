import { Router } from '@angular/router';
import { SubmitPostingForm } from './../../../../actions/post.action';
import { Direction } from './../../../../models/direction';
import { LoadDirectionAction } from './../../../../actions/direction.action';
import { LoadCategoryAction } from './../../../../actions/category.action';
import { LoadRegionAction } from './../../../../actions/region.action';
import { AppState } from 'src/app/models/app-state';
import { Store } from '@ngrx/store';
import { User } from './../../../../models/user';
import { Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { state } from '@angular/animations';
import { Region } from 'src/app/models/region';
import { Category } from 'src/app/models/category';
import { Post } from 'src/app/models/post';

@Component({
  selector: 'app-posting-form',
  templateUrl: './posting-form.component.html',
  styleUrls: ['./posting-form.component.css'],
})
export class PostingFormComponent implements OnInit {
  postingForm: FormGroup;
  user$: Observable<User>;
  regions$: Observable<Array<Region>>;
  categories$: Observable<Array<Category>>;
  direction$: Observable<Array<Direction>>;
  currentPostingPost$: Observable<Post>;
  constructor(
    private formBuilder: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.currentPostingPost$ = store.select(
      (app) => app.post.currentPostingPost
    );
    this.user$ = store.select((app) => app.auth.user);
    this.regions$ = store.select((app) => app.region.list);
    this.categories$ = store.select((app) => app.category.list);
    this.direction$ = store.select((app) => app.direction.list);
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadRegionAction());
    this.store.dispatch(new LoadCategoryAction());
    this.store.dispatch(new LoadDirectionAction());
    this.postingForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(50)]],
      condition: [true],
      address: ['', [Validators.required, Validators.maxLength(100)]],
      region: [],
      area: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+(,)?[0-9]+$'),
          Validators.min(0),
        ],
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]+$'),
          Validators.min(0),
        ],
      ],
      deal: [null],
      content: ['', [Validators.required, Validators.maxLength(65535)]],
      user: [],
      category: [],
      postType: [],
      direction: [],
      userType: [true],
      viewCount: [0],
    });
    this.currentPostingPost$.subscribe((post) => {
      if (post) {
        this.postingForm.patchValue(post);
      }
    });
    this.regions$.subscribe((regions) => {
      if (regions) {
        this.postingForm.patchValue({
          region: regions[0],
        });
      }
    });
    this.categories$.subscribe((categories) => {
      if (categories) {
        this.postingForm.patchValue({
          category: categories[0],
        });
      }
    });
    this.direction$.subscribe((directions) => {
      if (directions) {
        this.postingForm.patchValue({
          direction: directions[0],
        });
      }
    });
    this.user$.subscribe((user) => {
      if (user) {
        this.postingForm.patchValue({
          user,
        });
      }
    });
  }
  submitForm(): void {
    if (this.postingForm.valid) {
      this.store.dispatch(new SubmitPostingForm(this.postingForm.value));
      this.router.navigateByUrl('/confirm');
    }
  }
}
