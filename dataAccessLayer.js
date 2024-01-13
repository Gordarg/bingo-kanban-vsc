const vscode = require('vscode');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

class DataAccessLayer {
    constructor(filePath) {
        this.filePath = filePath;
    }

    getKanbanData() {
        if (!fs.existsSync(this.filePath)) {
            vscode.window.showInformationMessage(`File not found: ${this.filePath}`);
            return null;
        }
        const rawData = fs.readFileSync(this.filePath);
        return JSON.parse(rawData);
    }

    ensureKanbanData() {
        if (fs.existsSync(this.filePath)) return;
        const sampleData = {
            "To Do": [{ id: uuidv4(), task: "Task 1" }, { id: uuidv4(), task: "Task 2" }],
            "In Progress": [{ id: uuidv4(), task: "Task 3" }],
            "Done": [{ id: uuidv4(), task: "Task 4" }]
        };
        fs.writeFileSync(this.filePath, JSON.stringify(sampleData, null, 2));
    }

    saveKanbanData(kanbanData) {
        fs.writeFileSync(this.filePath, JSON.stringify(kanbanData, null, 2));
    }

    deleteTask(taskId) {
        let kanbanData = this.getKanbanData();
        for (let columnName in kanbanData) {
            kanbanData[columnName] = kanbanData[columnName].filter(task => task.id !== taskId);
        }
        this.saveKanbanData(kanbanData);
        vscode.window.showInformationMessage(`Deleted task: ${taskId}`);
    }
}

module.exports = DataAccessLayer;