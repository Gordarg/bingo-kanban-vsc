// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "bingo-kanban" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('bingo-kanban.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Bingo Kanban!');
	});

	context.subscriptions.push(disposable);




	let disposable2 = vscode.commands.registerCommand('bingo-kanban.board', function () {
		const panel = vscode.window.createWebviewPanel(
			'kanban',
			'Kanban Board',
			vscode.ViewColumn.One,
			{
				enableScripts: true
			}
		);

		let kanbanData = {};
		const filePath = path.join(__dirname, 'kanban.json');
		if (fs.existsSync(filePath)) {
			const rawData = fs.readFileSync(filePath);
			kanbanData = JSON.parse(rawData);
		}

		panel.webview.html = getWebviewContent(kanbanData);

		panel.webview.onDidReceiveMessage(
			message => {
				switch (message.command) {
					case 'save':
						fs.writeFileSync(filePath, JSON.stringify(message.data));
						return;
				}
			},
			undefined,
			context.subscriptions
		);
	});

	context.subscriptions.push(disposable2);



}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}



function getKanbanData() {
	const filePath = path.join(__dirname, 'kanban.json');
	if (fs.existsSync(filePath)) {
		const rawData = fs.readFileSync(filePath);
		const kanbanData = JSON.parse(rawData);
		return kanbanData;
	} else {
		console.error('File not found:', filePath);
		return null;
	}
}

function ensureKanbanData() {
	const filePath = path.join(__dirname, 'kanban.json');
	if (!fs.existsSync(filePath)) {
		const sampleData = {
			"To Do": ["Task 1", "Task 2"],
			"In Progress": ["Task 3"],
			"Done": ["Task 4"]
		};
		fs.writeFileSync(filePath, JSON.stringify(sampleData, null, 2));
	}
}


function getWebviewContent() {
	ensureKanbanData();
	const kanbanData = getKanbanData();
	if (!kanbanData) {
		return 'Error: Kanban data not found';
	}

	let kanbanHtml = '';
	for (let column in kanbanData) {
		let columnHtml = `<div class="column"><h2>${column}</h2>`;
		for (let card of kanbanData[column]) {
			columnHtml += `<div class="card">${card}</div>`;
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
        // Add your JavaScript code here to handle interactivity
        // You can use the vscode API to send messages back to your extension
        // vscode.postMessage({ command: 'save', data: yourData });
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