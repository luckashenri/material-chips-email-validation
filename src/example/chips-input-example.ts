import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {ChangeDetectionStrategy, Component, computed, inject, model, signal} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { JsonPipe, NgClass } from '@angular/common';

export interface User {
  email: string;
  id?: string;
  name?: string;
}

export const MOCK_USERS = [
  {
    id: '1',
    name: 'Amanda Waller',
    email: 'amanda@waller.com'
  },
  {
    id: '2',
    name: 'Harry Potter',
    email: 'harry@potter.com'
  },
  {
    id: '3',
    name: 'John Wick',
    email: 'john@wick.com'
  },
  {
    id: '4',
    name: 'Willy Wonka',
    email: 'willy@wonka.com'
  },
  {
    id: '5',
    name: 'Sarah Connor',
    email: 'sarah@connor.com'
  }
]

/**
 * @title Chips with input
 */
@Component({
  selector: 'chips-input-example',
  templateUrl: 'chips-input-example.html',
  styleUrl: 'chips-input-example.css',
  standalone: true,
  imports: [
    NgClass,
    MatFormFieldModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    MatAutocompleteModule,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsInputExample {
  readonly addOnBlur = false;

  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly users = signal<User[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  readonly currentUser = model('');

  readonly allUsers: User[] = MOCK_USERS;
  readonly filteredUsers = computed(() => {
    const currentUser = this.currentUser().toLowerCase();
    return currentUser
      ? this.allUsers.filter(user => user.email.includes(currentUser))
      : this.allUsers.slice();
  });


  add(event: MatChipInputEvent): void {
    console.log('add', event);
    
    const value = (event.value || '').trim();

    // Add our user
    if (value) {
      this.users.update(users => [...users, this.buildUser(value)]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(user: User): void {
    this.users.update(users => {
      const index = users.indexOf(user);
      if (index < 0) {
        return users;
      }

      users.splice(index, 1);
      this.announcer.announce(`Removed ${user.name}`);
      return [...users];
    });
  }

  edit(user: User, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove user if it no longer has a name
    if (!value) {
      this.remove(user);
      return;
    }

    // Edit existing user
    this.users.update(users => {
      const index = users.indexOf(user);
      if (index >= 0) {
        users[index].name = value;
        return [...users];
      }
      return users;
    });
  }

  buildUser(email: string): User {
    console.log('buildUser', name);

    return {
      email,
      name: email
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log('selected', event);
    
    this.users.update(users => [...users, this.buildUser(event.option.viewValue)]);
    this.currentUser.set('');
    event.option.deselect();
  }
}


/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */