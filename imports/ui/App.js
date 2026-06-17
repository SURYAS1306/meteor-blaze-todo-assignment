import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { TasksCollection } from '../db/TasksCollection';
import { TASK_CATEGORIES } from '../api/taskCategories';
import './App.html';
import './Task.js';
import './Login.js';

const HIDE_COMPLETED_STRING = 'hideCompleted';
const SELECTED_CATEGORY_STRING = 'selectedCategory';
const IS_LOADING_STRING = 'isLoading';
const ALL_CATEGORIES_VALUE = '';

const getUser = () => Meteor.user();
const isUserLogged = () => !!getUser();

const getTasksFilter = (instance) => {
  const hideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
  const selectedCategory = instance.state.get(SELECTED_CATEGORY_STRING);

  const filter = {};

  if (hideCompleted) {
    filter.isChecked = { $ne: true };
  }

  if (selectedCategory) {
    filter.category = selectedCategory;
  }

  return filter;
};

Template.mainContainer.onCreated(function mainContainerOnCreated() {
  this.state = new ReactiveDict();
  this.state.set(SELECTED_CATEGORY_STRING, ALL_CATEGORIES_VALUE);

  this.autorun(() => {
    if (!Meteor.userId()) {
      this.state.set(IS_LOADING_STRING, false);
      return;
    }

    const handle = this.subscribe('tasks');
    this.state.set(IS_LOADING_STRING, !handle.ready());
  });
});

Template.mainContainer.events({
  'click #hide-completed-button'(event, instance) {
    const currentHideCompleted = instance.state.get(HIDE_COMPLETED_STRING);
    instance.state.set(HIDE_COMPLETED_STRING, !currentHideCompleted);
  },
  'click .user'() {
    Meteor.logout();
  },
  'click .category-filter-button'(event, instance) {
    const { category } = event.currentTarget.dataset;
    instance.state.set(SELECTED_CATEGORY_STRING, category);
  },
});

Template.mainContainer.helpers({
  tasks() {
    if (!Meteor.userId()) {
      return [];
    }

    const instance = Template.instance();

    return TasksCollection.find(getTasksFilter(instance), {
      sort: { order: 1, createdAt: 1 },
    }).fetch();
  },
  hideCompleted() {
    return Template.instance().state.get(HIDE_COMPLETED_STRING);
  },
  incompleteCount() {
    if (!isUserLogged()) {
      return '';
    }

    const user = getUser();
    const incompleteTasksCount = TasksCollection.find({
      userId: user._id,
      isChecked: { $ne: true },
    }).count();

    return incompleteTasksCount ? `(${incompleteTasksCount})` : '';
  },
  isUserLogged() {
    return isUserLogged();
  },
  getUser() {
    return getUser();
  },
  isLoading() {
    return Template.instance().state.get(IS_LOADING_STRING);
  },
  categoryFilters() {
    const instance = Template.instance();
    const selectedCategory = instance.state.get(SELECTED_CATEGORY_STRING);

    return [
      { label: 'All', value: ALL_CATEGORIES_VALUE, isActive: !selectedCategory },
      ...TASK_CATEGORIES.map((category) => ({
        label: category,
        value: category,
        isActive: selectedCategory === category,
      })),
    ];
  },
});

Template.form.helpers({
  categories() {
    return TASK_CATEGORIES;
  },
});

Template.form.events({
  'submit .task-form'(event) {
    event.preventDefault();

    const { target } = event;
    const text = target.text.value;
    const category = target.category.value;

    Meteor.call('tasks.insert', text, category);

    target.text.value = '';
    target.category.value = TASK_CATEGORIES[0];
  },
});
