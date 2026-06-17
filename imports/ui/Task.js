import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import './Task.html';

let draggedTaskId = null;

Template.task.helpers({
  categoryClass() {
    return this.category.toLowerCase();
  },
});

Template.task.events({
  'click .toggle-checked'() {
    Meteor.call('tasks.setIsChecked', this._id, !this.isChecked);
  },
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'dragstart .drag-handle'(event) {
    draggedTaskId = this._id;
    event.originalEvent.dataTransfer.effectAllowed = 'move';
    event.currentTarget.closest('.task-item').classList.add('dragging');
  },
  'dragend .drag-handle'(event) {
    event.currentTarget.closest('.task-item').classList.remove('dragging');
    draggedTaskId = null;
  },
  'dragover .task-item'(event) {
    event.preventDefault();
    event.originalEvent.dataTransfer.dropEffect = 'move';
    event.currentTarget.classList.add('drag-over');
  },
  'dragleave .task-item'(event) {
    event.currentTarget.classList.remove('drag-over');
  },
  'drop .task-item'(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('drag-over');

    const targetId = this._id;

    if (draggedTaskId && draggedTaskId !== targetId) {
      Meteor.call('tasks.reorder', draggedTaskId, targetId);
    }
  },
});
