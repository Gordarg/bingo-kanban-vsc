# Changelog

All notable changes to the "Bingo Kanban" extension will be documented in this file.

AI Generated

## [0.0.2] - 2024-01-13
### Added
- Implemented `addNewTask` function to add a new task to a column.
- Added a plus button in front of each column name in the webview to create a new task.
- Added a toast notification when a task is deleted.
- Added `DataAccessLayer` class to handle all operations on the Kanban data.
- Implemented `deleteTask` function to delete a task from a column.

### Changed
- Refactored `registerFindTodosAndWipsCommand` function to use the data access layer's methods.
- Updated `deleteTask` function to delete a task from any column.
- Updated `getWebviewContent` function to include delete and update buttons for each task.

## [0.0.1] - 2024-01-13
### Added
- Initial release of the "Bingo Kanban" extension.
- Implemented `registerFindTodosAndWipsCommand` function to find todos and wips in the active text editor and add them to the Kanban data.
- Implemented `getWebviewContent` function to generate the HTML for the webview.