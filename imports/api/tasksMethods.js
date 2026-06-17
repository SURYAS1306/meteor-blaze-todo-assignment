import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { TasksCollection } from '../db/TasksCollection';
import { isValidCategory } from './taskCategories';

const getNextOrder = async (userId) => {
  const lastTask = await TasksCollection.findOneAsync(
    { userId },
    { sort: { order: -1 } }
  );

  return lastTask ? lastTask.order + 1 : 0;
};

const assertTaskOwnership = async (taskId, userId) => {
  const task = await TasksCollection.findOneAsync({ _id: taskId, userId });

  if (!task) {
    throw new Meteor.Error('Access denied.');
  }

  return task;
};

Meteor.methods({
  async 'tasks.insert'(text, category) {
    check(text, String);
    check(category, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if (!text.trim()) {
      throw new Meteor.Error('Task text is required.');
    }

    if (!isValidCategory(category)) {
      throw new Meteor.Error('Invalid category.');
    }

    await TasksCollection.insertAsync({
      text: text.trim(),
      category,
      createdAt: new Date(),
      userId: this.userId,
      order: await getNextOrder(this.userId),
    });
  },

  async 'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    await assertTaskOwnership(taskId, this.userId);
    await TasksCollection.removeAsync(taskId);
  },

  async 'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    await assertTaskOwnership(taskId, this.userId);

    await TasksCollection.updateAsync(taskId, {
      $set: { isChecked },
    });
  },

  async 'tasks.reorder'(draggedId, targetId) {
    check(draggedId, String);
    check(targetId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized.');
    }

    if (draggedId === targetId) {
      return;
    }

    const tasks = await TasksCollection.find(
      { userId: this.userId },
      { sort: { order: 1, createdAt: 1 } }
    ).fetchAsync();

    const orderedIds = tasks.map((task) => task._id);
    const fromIndex = orderedIds.indexOf(draggedId);
    const toIndex = orderedIds.indexOf(targetId);

    if (fromIndex < 0 || toIndex < 0) {
      throw new Meteor.Error('Task not found.');
    }

    orderedIds.splice(fromIndex, 1);
    orderedIds.splice(toIndex, 0, draggedId);

    await Promise.all(
      orderedIds.map((id, index) =>
        TasksCollection.updateAsync(id, { $set: { order: index } })
      )
    );
  },
});
