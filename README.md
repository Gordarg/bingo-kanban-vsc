
# Bingo Kanban

Bingo Kanban is a Visual Studio Code extension that helps developers manage their tasks directly in their codebase. It converts code comments into Kanban cards, providing a visual overview of the tasks and their progress.

## Features

- **Find Todos and WIPs**: Finds todos and work-in-progress (WIP) comments in the active text editor and adds them to the Kanban data.
- **Kanban Board**: Displays a Kanban board in a webview, with columns for "To Do", "In Progress", and "Done". Each task has "Delete" and "Update" buttons.
- **Add Tasks**: Adds a new task to a column by clicking the plus button next to the column name.
- **Delete Tasks**: Deletes a task from any column.
- **Update Tasks**: Updates a task in any column (you'll need to implement this feature based on your specific needs).

## Installation

### From Marketplace
1. Launch VS Code Quick Open (Ctrl+P), paste the following command, and press enter.
2. `ext install Gordarg.bingo-kanban`

### From source
1. Clone this repository: `git clone https://github.com/Gordarg/bingo-kanban-vsc.git`
2. Open the cloned repository in Visual Studio Code.
3. Press `F5` to run the extension in a new Extension Development Host window.

## Usage

1. Open a file in Visual Studio Code.
2. Run the `bingo-kanban.add` command to find todos and WIPs in the active text editor and add them to the Kanban data.
3. Run the `bingo-kanban.board` command to display the Kanban board.
4. Use the "Delete" and "Update" buttons to delete and update tasks, respectively.
5. Use the plus button next to each column name to add a new task to that column.

## Contributing

Contributions are welcome! Please read our contributing guidelines to get started.

### How to contribute?

```
sudo apt install nodejs
sudo apt install npm
# From scratch?
npm install -g yo generator-code --force
yo code
```

### To export your extension

```
npm install -g vsce
vsce package
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Credits

- [Mohammad R. Tayyebi](https://tyyi.net), [Gordarg](https://gordarg.com)
- [Bing AI](https://chat.bing.com)