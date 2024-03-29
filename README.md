# PROGRESS tracker app

Progress tracker is a hybrid mobile app made with React Native and Expo.

> Note: This project was created in order to advance front-end and cross-platform mobile app development skills. It is by no means finished. However, all implemented functionalities are fully operational in a debugging environment.

## About
This app let's you track progress of your tasks by providing the percentage of completed subtasks. In order to do this, subtasks are given weight values, depending on the effort needed to complete them (the weight of each subtask defaults to 1, if not provided otherwise).  

## User Interface

### How to add a new task?
1. Press Add button in the bottom right of the screen.
2. Fill the task with required data: title, description, due date (All fields are optional).
3. Add existing labels or create new ones.
4. Press 'ADD' button or the tick at the top right corner to create task, or press cross at the top left - to discard.

![Adding a new task](assets/s_add_task.png)

### How to add subtasks?
1. Select the task from main menu.
2. Press Add button in the bottom right of the screen.
3. Name the subtask.
4. Add weight to subtask (natural number).
5. Press 'Save' button.

![Adding subtasks](assets/s_add_subtasks.png)

### How to manage tasks?
* To **sort** tasks, press on the label next to the sorting arrows and choose the sorting condition.
* To change **sorting order** press the sorting arrows icon.
* To **pin**/**unpin**, **edit** or **delete** task, press the three dots icon on a chosen task.

![Managing tasks](assets/s_task_screen.png)