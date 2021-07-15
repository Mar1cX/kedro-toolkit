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
				if (!linePrefix.endsWith('type: ')) {
					return undefined;
				}

        // TODO: Completion should work even when typing is starting not from type, but from package
        // For example: writing api. should display APIDataSet as a dropdown option

				return [
          new vscode.CompletionItem('api.APIDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('biosequence.BioSequenceDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('dask.ParquetDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('email.EmailMessageDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('geopandas.GeoJSONDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('holoviews.HoloviewsWriter', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('json.JSONDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('matplotlib.MatplotlibWriter', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('networkx.NetworkXDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.CSVDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.ExcelDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.AppendableExcelDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.FeatherDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.GBQTableDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.HDFDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.JSONDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.ParquetDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.SQLQueryDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pandas.SQLTableDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pickle.PickleDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('pillow.ImageDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('plotly.PlotlyDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('spark.SparkDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('spark.SparkHiveDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('spark.SparkJDBCDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('tensorflow.TensorFlowModelDataset', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('text.TextDataSet', vscode.CompletionItemKind.Method),
          new vscode.CompletionItem('yaml.YAMLDataSet', vscode.CompletionItemKind.Method)
				];
			}
		},
		' ' // triggered whenever a 'type:' is being typed
	);


	const apiDatasetAutocomplete = vscode.languages.registerCompletionItemProvider('yaml', {
    provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
				const linePrefix = document.lineAt(position).text.substr(0, position.character);
				if (!linePrefix.endsWith('api.')) {
					return undefined;
				}

				return [
          new vscode.CompletionItem('APIDataSet', vscode.CompletionItemKind.Method),
				];
			}
		},
		'.' // triggered whenever a '.' is being typed
	);

  context.subscriptions.push(paramsAutocomplete, configAutocomplete, paramsListAutocomplete, catalogListAutocomplete, apiDatasetAutocomplete);
}
