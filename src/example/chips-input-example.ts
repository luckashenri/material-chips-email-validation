import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER, SEMICOLON} from '@angular/cdk/keycodes';
import {ChangeDetectionStrategy, Component, ElementRef, computed, inject, model, signal, viewChild} from '@angular/core';
import {MatChipEditedEvent, MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { JsonPipe, NgClass } from '@angular/common';
import { ValidateEmailPipe } from './validate-email.pipe';

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
    ValidateEmailPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsInputExample {
  userInput = viewChild<ElementRef>('userInput')
  auto = viewChild<MatAutocomplete>('auto');

  readonly addOnBlur = false;

  readonly separatorKeysCodes = [ENTER, COMMA, SEMICOLON] as const;
  readonly users = signal<User[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  readonly currentUser = model<string | User | null>(null);

  readonly allUsers: User[] = MOCK_USERS;

  readonly filteredUsers = computed(() => {

    const currentUser = this.currentUser();

    if (typeof currentUser === 'string') {      
      return this.allUsers.filter(user => user.name!.toLowerCase().includes(currentUser) || user.email!.toLowerCase().includes(currentUser))
    } else if (currentUser != null) {
      return this.allUsers.filter(user => user.email!.toLowerCase().includes(currentUser?.email))
    } else {
      return this.allUsers.slice()
    }

  });

  ongoinUser: User | null = null;

  hitEnter() {
    console.log('hitEnter');
  }

  add(event: MatChipInputEvent): void {
    console.log('add', event);
    
    const value = (event.value || '').trim();

    const hasUserOption = this.allUsers.find(el => el.email === value);
    console.log('hasUserOption', hasUserOption);

    if (hasUserOption) {
      console.log('here');
      this.users.update(users => [...users, hasUserOption]);
      
      event.chipInput!.clear();
      this.clearText();
      return;
    }

    // Add  user
    if (value) {
      this.users.update(users => [...users, this.buildUser(value)]);
    }

    // Clear the input value
    event.chipInput!.clear();
    this.clearText();
  }

  remove(user: User): void {
    console.log('remove', user);

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
    console.log('edit', user, event);

    const value = event.value.trim();

    // Remove user if it no longer has a name
    if (!value) {
      this.remove(user);
      return;
    }

    // Edit existing user
    this.users.update(users => {
      const index = users.indexOf(user);

      const hasUserOption = this.auto()?.options.find(el => el.value.email === value);
      console.log('hasUserOption', hasUserOption);

  
      if (user.id == null && hasUserOption) {
        console.log('here');
        users[index] = hasUserOption.value;
        
        hasUserOption.select();
        return users;
      }

      if (index >= 0) {
        users[index].name = value;
        users[index].email = value;

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
    
    const user = this.allUsers.find(el => el.id === event.option.value?.id);

    console.log('user', user);

    if (!user) {
      this.clearText();
      return;
    }

    this.users.update(users => [...users, user!]);

    event.option.deselect();
    this.clearText();
  }

  onChangeOngoingUser(event: any) {
    console.log('onChangeOngoingUser', event.target.value);
    const value = event.target.value;

    if (this.ongoinUser == null) this.ongoinUser = {name: '', email: ''};

    this.ongoinUser!.name = value;
    this.ongoinUser!.email = value;
  }

  clearText() {
    console.log('clearText', this.userInput());
    this.userInput()!.nativeElement.value = '';
    this.currentUser.set(null);
  }
}

/**  Copyright 2024 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at https://angular.io/license */