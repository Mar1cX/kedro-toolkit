import * as vscode from 'vscode';
import { parse, stringify } from 'yaml';

export function activate(context: vscode.ExtensionContext) {

  const paramsAutocomplete = vscode.languages.registerCompletionItemProvider('python', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
      const nonQuotesParamsItem = new vscode.CompletionItem('params');
      nonQuotesParamsItem.kind = vscode.CompletionItemKind.Keyword;
      nonQuotesParamsItem.commitCharacters = [':'];
      nonQuotesParamsItem.documentation = new vscode.MarkdownString('Press `:` to get `params:`');

      return [
        nonQuotesParamsItem
      ];
    }
  });

  const configAutocomplete = vscode.languages.registerCompletionItemProvider('yaml', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
      const configItem = new vscode.CompletionItem('type');
      configItem.kind = vscode.CompletionItemKind.Keyword;
      configItem.commitCharacters = [':'];
      configItem.documentation = new vscode.MarkdownString('Press `:` to get `type:`');

      return [
        configItem,
      ];
    }
  });

  const mapParametersListByFile = async(file: vscode.Uri):  Promise<vscode.CompletionItem[]> => {
    try {
      const document = await vscode.workspace.openTextDocument(file.path);

      return Object.keys(parse(document.getText())).map(keyValue => {
        return new vscode.CompletionItem(keyValue, vscode.CompletionItemKind.Method);
      });
    } catch (err) {
      console.log(err);

      return [];
    }
  };

  const retrieveDefinedParametersList = async(): Promise<vscode.CompletionItem[]> => {
    try {
      const config = vscode.workspace.getConfiguration('findParametersFiles');
      const files = await vscode.workspace.findFiles(<string>config.get('parametersFileIncludeGlob'), <string>config.get('fileExcludeGlob'), <number>config.get('maximumFilesAmount'));
      const promiseParameters = files.map(file => mapParametersListByFile(file));

      return Promise.all(promiseParameters).then((parameters) => {
        return ([] as vscode.CompletionItem[]).concat.apply([], parameters);
      }).catch(() => {
        console.error;
        return [];
      });
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const paramsListAutocomplete = vscode.languages.registerCompletionItemProvider('python', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken, context: vscode.CompletionContext) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);

        if (!linePrefix.endsWith('params:')) {
          return undefined;
        }

        return retrieveDefinedParametersList();
      }
    },
    ':'
  );

	const catalogListAutocomplete = vscode.languages.registerCompletionItemProvider('yaml', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('type:')) {
					return undefined;
				}

				return [
					new vscode.CompletionItem(' pandas.CSVDataSet', vscode.CompletionItemKind.Method),
				];
			}
		},
		':' // triggered whenever a 'type:' is being typed
	);

  context.subscriptions.push(paramsAutocomplete, configAutocomplete, paramsListAutocomplete, catalogListAutocomplete);
}
