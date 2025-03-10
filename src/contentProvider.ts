'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { imagePath } from './imagePath';


const textile = require('textile-js');

export function packTextileUri(uri: vscode.Uri) {
	// Temporarily change the URI scheme
	// Pack the original URI in to the 'query' field
	if (uri.scheme === textileContentProvider.textileURI.scheme) {
		// Nothing to do
		return uri;
	}

	return uri.with({ scheme: textileContentProvider.textileURI.scheme, query: uri.toString() });
}

export function unpackTextileUri(uri: vscode.Uri) {
	// Restore original URI scheme from the 'query' field
	if ((uri.scheme !== textileContentProvider.textileURI.scheme) || (!uri.query)) {
		// Not a modified textile URI, nothing to do
		return uri;
	}

	return vscode.Uri.parse(uri.query);
}

export class textileContentProvider implements vscode.TextDocumentContentProvider {
	public static readonly textileURI = vscode.Uri.parse('textile:');

	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
	private _waiting: boolean = false;

	constructor(private context: vscode.ExtensionContext) { }

	public async provideTextDocumentContent(uri: vscode.Uri): Promise<string> {
		let document = await vscode.workspace.openTextDocument(unpackTextileUri(uri));
		let text = imagePath(document.getText(), unpackTextileUri(uri));
		text = text.replace(/\#\[(.*)\]\#/gi, 'h1. $1');
		let body = await textile(text);

		return `<!DOCTYPE html>
			<html>
			<head>
				<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
				<style>
				/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

html, body {
	font-family: var(--vscode-markdown-font-family, -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "Ubuntu", "Droid Sans", sans-serif);
	font-size: var(--vscode-markdown-font-size, 14px);
	padding: 0 26px;
	line-height: var(--vscode-markdown-line-height, 22px);
	word-wrap: break-word;
}

#code-csp-warning {
	position: fixed;
	top: 0;
	right: 0;
	color: white;
	margin: 16px;
	text-align: center;
	font-size: 12px;
	font-family: sans-serif;
	background-color:#444444;
	cursor: pointer;
	padding: 6px;
	box-shadow: 1px 1px 1px rgba(0,0,0,.25);
}

#code-csp-warning:hover {
	text-decoration: none;
	background-color:#007acc;
	box-shadow: 2px 2px 2px rgba(0,0,0,.25);
}

body.scrollBeyondLastLine {
	margin-bottom: calc(100vh - 22px);
}

body.showEditorSelection .code-line {
	position: relative;
}

body.showEditorSelection .code-active-line:before,
body.showEditorSelection .code-line:hover:before {
	content: "";
	display: block;
	position: absolute;
	top: 0;
	left: -12px;
	height: 100%;
}

body.showEditorSelection li.code-active-line:before,
body.showEditorSelection li.code-line:hover:before {
	left: -30px;
}

.vscode-light.showEditorSelection .code-active-line:before {
	border-left: 3px solid rgba(0, 0, 0, 0.15);
}

.vscode-light.showEditorSelection .code-line:hover:before {
	border-left: 3px solid rgba(0, 0, 0, 0.40);
}

.vscode-light.showEditorSelection .code-line .code-line:hover:before {
	border-left: none;
}

.vscode-dark.showEditorSelection .code-active-line:before {
	border-left: 3px solid rgba(255, 255, 255, 0.4);
}

.vscode-dark.showEditorSelection .code-line:hover:before {
	border-left: 3px solid rgba(255, 255, 255, 0.60);
}

.vscode-dark.showEditorSelection .code-line .code-line:hover:before {
	border-left: none;
}

.vscode-high-contrast.showEditorSelection .code-active-line:before {
	border-left: 3px solid rgba(255, 160, 0, 0.7);
}

.vscode-high-contrast.showEditorSelection .code-line:hover:before {
	border-left: 3px solid rgba(255, 160, 0, 1);
}

.vscode-high-contrast.showEditorSelection .code-line .code-line:hover:before {
	border-left: none;
}

img {
	max-width: 100%;
	max-height: 100%;
}

a {
	text-decoration: none;
}

a:hover {
	text-decoration: underline;
}

a:focus,
input:focus,
select:focus,
textarea:focus {
	outline: 1px solid -webkit-focus-ring-color;
	outline-offset: -1px;
}

hr {
	border: 0;
	height: 2px;
	border-bottom: 2px solid;
}

h1 {
	padding-bottom: 0.3em;
	line-height: 1.2;
	border-bottom-width: 1px;
	border-bottom-style: solid;
}

h1, h2, h3 {
	font-weight: normal;
}

h1 code,
h2 code,
h3 code,
h4 code,
h5 code,
h6 code {
	line-height: auto;
}

table {
	border-collapse: collapse;
}

table > thead > tr > th {
	text-align: left;
	border-bottom: 1px solid;
}

table > thead > tr > th,
table > thead > tr > td,
table > tbody > tr > th,
table > tbody > tr > td {
	padding: 5px 10px;
}

table > tbody > tr + tr > td {
	border-top: 1px solid;
}

blockquote {
	margin: 0 7px 0 5px;
	padding: 0 16px 0 10px;
	border-left-width: 5px;
	border-left-style: solid;
}

code {
	font-family: Menlo, Monaco, Consolas, "Droid Sans Mono", "Courier New", monospace, "Droid Sans Fallback";
	font-size: 1em;
	line-height: 1.357em;
}

body.wordWrap pre {
	white-space: pre-wrap;
}

pre:not(.hljs),
pre.hljs code > div {
	padding: 16px;
	border-radius: 3px;
	overflow: auto;
}

/** Theming */

pre code {
	color: var(--vscode-editor-foreground);
	tab-size: 4;
}


.vscode-light pre {
	background-color: rgba(220, 220, 220, 0.4);
}

.vscode-dark pre {
	background-color: rgba(10, 10, 10, 0.4);
}

.vscode-high-contrast pre {
	background-color: rgb(0, 0, 0);
}

.vscode-high-contrast h1 {
	border-color: rgb(0, 0, 0);
}

.vscode-light table > thead > tr > th {
	border-color: rgba(0, 0, 0, 0.69);
}

.vscode-dark table > thead > tr > th {
	border-color: rgba(255, 255, 255, 0.69);
}

.vscode-light h1,
.vscode-light hr,
.vscode-light table > tbody > tr + tr > td {
	border-color: rgba(0, 0, 0, 0.18);
}

.vscode-dark h1,
.vscode-dark hr,
.vscode-dark table > tbody > tr + tr > td {
	border-color: rgba(255, 255, 255, 0.18);
}
/*
https://raw.githubusercontent.com/isagalaev/highlight.js/master/src/styles/vs2015.css
*/
/*
 * Visual Studio 2015 dark style
 * Author: Nicolas LLOBERA <nllobera@gmail.com>
 */


.hljs-keyword,
.hljs-literal,
.hljs-symbol,
.hljs-name {
	color: #569CD6;
}
.hljs-link {
	color: #569CD6;
	text-decoration: underline;
}

.hljs-built_in,
.hljs-type {
	color: #4EC9B0;
}

.hljs-number,
.hljs-class {
	color: #B8D7A3;
}

.hljs-string,
.hljs-meta-string {
	color: #D69D85;
}

.hljs-regexp,
.hljs-template-tag {
	color: #9A5334;
}

.hljs-subst,
.hljs-function,
.hljs-title,
.hljs-params,
.hljs-formula {
	color: #DCDCDC;
}

.hljs-comment,
.hljs-quote {
	color: #57A64A;
	font-style: italic;
}

.hljs-doctag {
	color: #608B4E;
}

.hljs-meta,
.hljs-meta-keyword,
.hljs-tag {
	color: #9B9B9B;
}

.hljs-variable,
.hljs-template-variable {
	color: #BD63C5;
}

.hljs-attr,
.hljs-attribute,
.hljs-builtin-name {
	color: #9CDCFE;
}

.hljs-section {
	color: gold;
}

.hljs-emphasis {
	font-style: italic;
}

.hljs-strong {
	font-weight: bold;
}

/*.hljs-code {
	font-family:'Monospace';
}*/

.hljs-bullet,
.hljs-selector-tag,
.hljs-selector-id,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo {
	color: #D7BA7D;
}

.hljs-addition {
	background-color: var(--vscode-diffEditor-insertedTextBackground, rgba(155, 185, 85, 0.2));
	color: rgb(155, 185, 85);
	display: inline-block;
	width: 100%;
}

.hljs-deletion {
	background: var(--vscode-diffEditor-removedTextBackground, rgba(255, 0, 0, 0.2));
	color: rgb(255, 0, 0);
	display: inline-block;
	width: 100%;
}


/*
From https://raw.githubusercontent.com/isagalaev/highlight.js/master/src/styles/vs.css
*/
/*

Visual Studio-like style based on original C# coloring by Jason Diamond <jason@diamond.name>

*/

.vscode-light .hljs-function,
.vscode-light .hljs-params {
	color: inherit;
}

.vscode-light .hljs-comment,
.vscode-light .hljs-quote,
.vscode-light .hljs-variable {
	color: #008000;
}

.vscode-light .hljs-keyword,
.vscode-light .hljs-selector-tag,
.vscode-light .hljs-built_in,
.vscode-light .hljs-name,
.vscode-light .hljs-tag {
	color: #00f;
}

.vscode-light .hljs-string,
.vscode-light .hljs-title,
.vscode-light .hljs-section,
.vscode-light .hljs-attribute,
.vscode-light .hljs-literal,
.vscode-light .hljs-template-tag,
.vscode-light .hljs-template-variable,
.vscode-light .hljs-type {
	color: #a31515;
}

.vscode-light .hljs-selector-attr,
.vscode-light .hljs-selector-pseudo,
.vscode-light .hljs-meta {
	color: #2b91af;
}

.vscode-light .hljs-doctag {
	color: #808080;
}

.vscode-light .hljs-attr {
	color: #f00;
}

.vscode-light .hljs-symbol,
.vscode-light .hljs-bullet,
.vscode-light .hljs-link {
	color: #00b0e8;
}


.vscode-light .hljs-emphasis {
	font-style: italic;
}

.vscode-light .hljs-strong {
	font-weight: bold;
}
				</style>
			</head>
			<body class="vscode-body">
				${body}
			</body>
			</html>`;
	}

	get onDidChange(): vscode.Event<vscode.Uri> {
		return this._onDidChange.event;
	}

	public update(uri: vscode.Uri) {
		if (!this._waiting) {
			this._waiting = true;
			setTimeout(() => {
				this._waiting = false;
				this._onDidChange.fire(uri);
			}, 300);
		}
	}
}
