import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import '/imports/api/tasksMethods';
import '/imports/api/tasksPublications';

const SEED_USERNAME = 'meteorite';
const SEED_PASSWORD = 'password';

const SEED_TASKS = [
  { text: 'Review sprint requirements', category: 'Work' },
  { text: 'Configure local Meteor environment', category: 'Work' },
  { text: 'Update MongoDB schema for categories', category: 'Work' },
  { text: 'Fix authentication publication bug', category: 'Urgent' },
  { text: 'Test drag-and-drop functionality', category: 'Urgent' },
  { text: 'Read Meteor security documentation', category: 'Other' },
  { text: 'Prepare feature demo', category: 'Personal' },
  { text: 'Complete learning goals for the week', category: 'Personal' },
];

const insertTask = async (task, user, order) => {
  await TasksCollection.insertAsync({
    text: task.text,
    category: task.category,
    createdAt: new Date(),
    userId: user._id,
    order,
  });
};

Meteor.startup(async () => {
  let user = await Accounts.findUserByUsername(SEED_USERNAME);

  if (!user) {
    await Accounts.createUserAsync({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
    user = await Accounts.findUserByUsername(SEED_USERNAME);
  }

  // Remove orphaned tasks from earlier runs where userId was not set correctly
  await TasksCollection.removeAsync({
    $or: [{ userId: { $exists: false } }, { userId: null }],
  });

  const userTaskCount = await TasksCollection.find({ userId: user._id }).countAsync();

  if (userTaskCount === 0) {
    await Promise.all(
      SEED_TASKS.map((task, index) => insertTask(task, user, index))
    );
  }
});
