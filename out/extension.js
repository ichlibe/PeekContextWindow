"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
let debounceTimer;
let autoPeekEnabled = false; // 自动跟随开关
function activate(context) {
    // 光标变化触发
    const disposableSelection = vscode.window.onDidChangeTextEditorSelection(async (e) => {
        if (!autoPeekEnabled)
            return;
        // 只在鼠标点击时触发
        if (e.kind !== vscode.TextEditorSelectionChangeKind.Mouse) {
            return;
        }
        if (debounceTimer)
            clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => triggerDefinition(e.textEditor), 200);
    });
    context.subscriptions.push(disposableSelection);
    // 快捷键命令切换开关
    const disposableCommand = vscode.commands.registerCommand('peekToSide.toggleAutoPeek', () => {
        autoPeekEnabled = !autoPeekEnabled;
        vscode.window.showInformationMessage(`Auto Peek is now ${autoPeekEnabled ? 'Enabled' : 'Disabled'}`);
        // 如果开启，立即显示一次
        if (autoPeekEnabled && vscode.window.activeTextEditor) {
            triggerDefinition(vscode.window.activeTextEditor);
        }
    });
    context.subscriptions.push(disposableCommand);
    // 激活时可选：不自动执行，避免一打开就触发
}
async function triggerDefinition(editor) {
    const pos = editor.selection.active;
    const doc = editor.document;
    try {
        const defs = (await vscode.commands.executeCommand('vscode.executeDefinitionProvider', doc.uri, pos));
        if (defs && defs.length > 0) {
            const target = defs[0];
            await vscode.window.showTextDocument(target.uri, {
                viewColumn: vscode.ViewColumn.Two,
                preserveFocus: true,
                selection: target.range
            });
        }
        else {
            console.log('No definition found for current symbol.');
        }
    }
    catch (err) {
        console.error('Auto peek error:', err);
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map