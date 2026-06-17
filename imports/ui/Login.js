import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './Login.html';

Template.login.onCreated(function loginOnCreated() {
  this.errorMessage = new ReactiveVar('');
});

Template.login.helpers({
  errorMessage() {
    return Template.instance().errorMessage.get();
  },
});

Template.login.events({
  'submit .login-form'(event, instance) {
    event.preventDefault();

    const { target } = event;
    const username = target.username.value.trim();
    const password = target.password.value;

    instance.errorMessage.set('');

    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        instance.errorMessage.set(
          error.reason || 'Login failed. Try meteorite / password.'
        );
      }
    });
  },
});
