import * as vscode from 'vscode';

let debounceTimer: NodeJS.Timeout | undefined;
let autoPeekEnabled = true; // 自动跟随开关

export function activate(context: vscode.ExtensionContext) {

    // 光标变化触发
    const disposableSelection = vscode.window.onDidChangeTextEditorSelection(async (e) => {
        if (!autoPeekEnabled) return; // 开关判断
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => triggerDefinition(e.textEditor), 200);
    });
    context.subscriptions.push(disposableSelection);

    // 快捷键命令切换开关
    const disposableCommand = vscode.commands.registerCommand('peekToSide.toggleAutoPeek', () => {
        autoPeekEnabled = !autoPeekEnabled;
        vscode.window.showInformationMessage(
            `Auto Peek is now ${autoPeekEnabled ? 'Enabled' : 'Disabled'}`
        );
        // 如果开启，立即显示当前光标定义
        if (autoPeekEnabled && vscode.window.activeTextEditor) {
            triggerDefinition(vscode.window.activeTextEditor);
        }
    });
    context.subscriptions.push(disposableCommand);

    // 激活时显示当前光标定义
    if (vscode.window.activeTextEditor) {
        triggerDefinition(vscode.window.activeTextEditor);
    }

    // 核心逻辑封装
    async function triggerDefinition(editor: vscode.TextEditor) {
        const pos = editor.selection.active;
        const doc = editor.document;
        try {
            const defs = await vscode.commands.executeCommand(
                'vscode.executeDefinitionProvider',
                doc.uri,
                pos
            ) as vscode.Location[];

            if (defs && defs.length > 0) {
                vscode.window.showTextDocument(defs[0].uri, {
                    viewColumn: vscode.ViewColumn.Two,
                    preserveFocus: true,
                    selection: defs[0].range
                });
            } else {
                console.log('No definition found for current symbol.');
            }
        } catch (err) {
            console.error('Auto peek error:', err);
        }
    }
}

export function deactivate() {}
