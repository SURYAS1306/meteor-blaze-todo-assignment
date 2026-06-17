# Simple Todos — Meteor.js + Blaze

A full-stack to-do application built with **Meteor 3** and **Blaze**, based on the official [Meteor Blaze Simple Todos tutorial](https://blaze-tutorial.meteor.com/simple-todos/), extended with task categories and drag-and-drop reordering for a technical internship assignment.

## Overview

This project demonstrates proficiency with Meteor.js and Blaze by implementing a complete, authenticated to-do app with MongoDB persistence, reactive UI updates, secured publications/methods, and two assignment enhancements:

- **Task categories** — Work, Personal, Urgent, Other
- **Drag-and-drop reordering** — with `order` persisted in MongoDB

## Features

### Core (Tutorial)
- Create, complete, and delete tasks
- Hide / show completed tasks
- User authentication with username and password
- Per-user task ownership
- Secured MongoDB publications and Meteor methods
- Reactive Blaze templates, helpers, and events

### Assignment Enhancements
- **Categories** — assign a category when creating a task
- **Category badges** — displayed beside each task
- **Category filtering** — filter the task list by category
- **Drag-and-drop reordering** — reorder tasks via the handle (`≡`); order persists after page refresh

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Meteor 3.4 |
| UI | Blaze (Spacebars templates) |
| Database | MongoDB (embedded with Meteor) |
| Auth | `accounts-password` |
| State | `reactive-dict` |
| Bundler | Rspack |

## Prerequisites

- [Meteor](https://docs.meteor.com/install.html) installed (`meteor --version`)
- Node.js (bundled with Meteor)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/SURYAS1306/meteor-blaze-todo-assignment.git
cd meteor-blaze-todo-assignment
meteor npm install
```

### 2. Run the application

```bash
meteor
# or
npm start
```

Open **http://localhost:3000** in your browser.

### 3. Log in

A demo account is created automatically on first startup:

| Field | Value |
|---|---|
| Username | `meteorite` |
| Password | `password` |

### 4. Sample tasks

On first run, 7 sample tasks are seeded for the demo user (only when that user has no existing tasks):

| Category | Tasks |
|---|---|
| **Work** | Review Meteor Blaze internship assignment requirements; Implement category badges and filters in Blaze templates |
| **Urgent** | Fix tasks publication failing after authentication; Resolve drag-and-drop order persistence issue |
| **Other** | Read Meteor methods and security documentation |
| **Personal** | Configure local Meteor and MongoDB development environment; Complete Blaze Simple Todos tutorial walkthrough |

To reset and re-seed sample tasks:

```bash
rm -rf .meteor/local/db
meteor
```

## Usage

1. **Log in** with the demo credentials above.
2. **Add a task** — enter text, choose a category from the dropdown, and click **Add Task**.
3. **Complete a task** — check the checkbox beside a task.
4. **Delete a task** — click the **×** button.
5. **Filter by category** — use the category buttons below the form.
6. **Hide completed** — click **Hide Completed** to show only pending tasks.
7. **Reorder tasks** — drag a task using the **≡** handle; refresh the page to confirm order persists.
8. **Log out** — click your username in the top-right corner.

## Task Data Model

Each task document in MongoDB stores:

| Field | Type | Description |
|---|---|---|
| `text` | String | Task description |
| `category` | String | One of: Work, Personal, Urgent, Other |
| `createdAt` | Date | When the task was created |
| `userId` | String | Owner (authenticated user) |
| `order` | Number | Position for drag-and-drop sorting |
| `isChecked` | Boolean | Completion status (optional) |

## Project Structure

```
meteor-blaze-todo-assignment/
├── client/
│   ├── main.html          # HTML entry point
│   ├── main.js            # Client entry point
│   └── main.css           # Application styles
├── server/
│   └── main.js            # Server startup, user & task seeding
├── imports/
│   ├── api/
│   │   ├── taskCategories.js    # Category constants
│   │   ├── tasksMethods.js      # Meteor methods (CRUD + reorder)
│   │   └── tasksPublications.js # Task publication
│   ├── db/
│   │   └── TasksCollection.js   # MongoDB collection
│   └── ui/
│       ├── App.html / App.js    # Main layout, form, filters
│       ├── Task.html / Task.js  # Task item + drag-and-drop
│       └── Login.html / Login.js
└── package.json
```

## Security

- `autopublish` and `insecure` packages are **not** used
- Tasks are published only to the authenticated owner
- All mutations go through validated Meteor methods on the server
- Task ownership is verified before update, delete, or reorder

## Meteor Methods

| Method | Description |
|---|---|
| `tasks.insert` | Create a new task with text and category |
| `tasks.remove` | Delete a task |
| `tasks.setIsChecked` | Toggle task completion |
| `tasks.reorder` | Update task order after drag-and-drop |

## Assignment Requirements Checklist

- [x] Complete Simple Todos application (tutorial foundation)
- [x] Task categories: Work, Personal, Urgent, Other
- [x] Task fields: `text`, `category`, `createdAt`, `userId`
- [x] Category dropdown when creating tasks
- [x] Category badge displayed beside every task
- [x] Filtering by category
- [x] Drag-and-drop task reordering
- [x] Order persisted in MongoDB via `order` field
- [x] Order survives page refresh
- [x] Simple, clean UI
- [x] Blaze templates, helpers, and events

## Scripts

```bash
npm start          # Run the app (meteor run)
npm test           # Run tests once
npm run test-app   # Run full-app tests in watch mode
```

## Reference

- [Meteor Blaze Tutorial — Simple Todos](https://blaze-tutorial.meteor.com/simple-todos/)
- [Meteor 3 Documentation](https://docs.meteor.com/)
- [Blaze Documentation](https://blazejs.org/)

## Author

Surya Srinivasan

Built as part of a Meteor.js / Blaze technical assessment, demonstrating authentication, category management, filtering, and drag-and-drop task reordering using Meteor 3 and Blaze.
