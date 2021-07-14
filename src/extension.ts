import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
		console.log('Congratulations, your extension "kedro-toolkit" is now active!');

	context.subscriptions.push(vscode.commands.registerCommand('kedro-toolkit.helloWorld', () => {
		vscode.window.showInformationMessage('Hello from Kedro Toolkit!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('kedro-toolkit.askQuestion', async() => {
		const answer = await vscode.window.showInformationMessage('How are your day?', 'good', 'bad');

		if (answer === 'bad') {
			vscode.window.showInformationMessage("That's too bad");
		} else {
			console.log({ answer });
		}
	}));
}

export function deactivate() {}
