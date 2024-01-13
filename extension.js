// Import required modules
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync } = require('child_process');
const { v4: uuidv4 } = require('uuid');
const DataAccessLayer = require('./dataAccessLayer');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Create file watcher
    const fileWatcher = vscode.workspace.createFileSystemWatcher(filePath);
    fileWatcher.onDidChange(getWebviewContent);
    context.subscriptions.push(fileWatcher);

    // Log activation message
    console.log('Congratulations, your extension "bingo-kanban" is now active!');

    // Register commands
    registerBoardCommand(context);
    registerFindTodosAndWipsCommand(context);
}

// This method is called when your extension is deactivated
function deactivate() { }

// Define file path
const filePath = path.join(vscode.workspace.rootPath, 'kanban.json');

// Initialize data access layer
const dal = new DataAccessLayer(filePath);

// Function to get webview content
const getWebviewContent = () => {
    dal.ensureKanbanData();
    const kanbanData = dal.getKanbanData();
    if (!kanbanData) return 'Error: Kanban data not found';

    let kanbanHtml = '';
    for (let column in kanbanData) {
        let columnHtml = `<div class="column"><h2>${column}</h2>`;
        for (let card of kanbanData[column]) {
            columnHtml += `<div class="card">
                <h4>${card.task}</h4>
                <time>${new Date(card.modifiedDate).toLocaleDateString()}</time>
                <span>${card.username}</span>
                <button onclick="deleteCard('${card.id}')">Delete</button>
            </div>`;
        }
        columnHtml += '</div>';
        kanbanHtml += columnHtml;
    }

    // Return the full HTML
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kanban Board</title>
        <style>
            .kanban-board {
                display: flex;
                justify-content: space-between;
                gap: 20px;
            }
            .column {
                flex: 1;
                border: 1px solid #ccc;
                padding: 10px;
                border-radius: 5px;
            }
            .card {
                background-color: #eee;
                margin-bottom: 10px;
                padding: 5px;
                border-radius: 3px;
            }
        </style>
        <script>
        const vscode = acquireVsCodeApi();
        
        function deleteCard(id) {
            vscode.postMessage({ command: 'delete', id: id });
        }

        function updateCard(id) {
            //todo: Add your update logic here
            vscode.postMessage({ command: 'update', id: id });
        }
        </script>
    </head>
    <body>
        <h1>Kanban Board</h1>
        <div class="kanban-board">
            ${kanbanHtml}
        </div>
    </body>
    </html>`;
}

// Register board command
function registerBoardCommand(context) {
    let disposable = vscode.commands.registerCommand('bingo-kanban.view', () => {
        const panel = vscode.window.createWebviewPanel(
            'kanban',
            'Kanban Board',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        dal.ensureKanbanData();
        const kanbanData = dal.getKanbanData();
        panel.webview.html = getWebviewContent(kanbanData);

        panel.webview.onDidReceiveMessage(
            message => {
                vscode.window.showInformationMessage(`Processing: ${message.command}`);
                switch (message.command) {
                    case 'delete':
                        dal.deleteTask(message.id);
                        panel.webview.html = getWebviewContent(dal.getKanbanData());
                        return;
                    case 'update':
                        // Add your update logic here
                        return;
                }
            },
            undefined,
            context.subscriptions
        );
    });
    context.subscriptions.push(disposable);
}

// Register find todos and wips command
function registerFindTodosAndWipsCommand(context) {
    let disposable = vscode.commands.registerCommand('bingo-kanban.add', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const text = editor.document.getText();
        const lines = text.split('\n');

        let todos = [];
        let wips = [];

        lines.forEach(line => {
            const todoIndex = line.indexOf('todo:');
            if (todoIndex !== -1) {
                const todo = line.slice(todoIndex + 'todo:'.length).trim();
                todos.push(todo);
            }

            const wipIndex = line.indexOf('wip:');
            if (wipIndex !== -1) {
                const wip = line.slice(wipIndex + 'wip:'.length).trim();
                wips.push(wip);
            }
        });

        dal.ensureKanbanData();
        let kanbanData = dal.getKanbanData();

        const fileStats = fs.statSync(editor.document.fileName);
        const modifiedDate = fileStats.mtime;

        let username;
        try {
            username = execSync('git config user.name', { encoding: 'utf8' }).trim();
        } catch (error) {
            username = os.userInfo().username;
        }

        todos = todos.map(todo => ({ id: uuidv4(), task: todo, modifiedDate: modifiedDate, username: username }));
        wips = wips.map(wip => ({ id: uuidv4(), task: wip, modifiedDate: modifiedDate, username: username }));

        kanbanData['To Do'] = [...new Set([...kanbanData['To Do'] || [], ...todos])];
        kanbanData['In Progress'] = [...new Set([...kanbanData['In Progress'] || [], ...wips])];

        dal.saveKanbanData(kanbanData);
    });
    context.subscriptions.push(disposable);
}

module.exports = {
    activate,
    deactivate
}