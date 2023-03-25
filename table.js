// This is a modified and reformatted version of https://github.com/nodejs/node/blob/v18.x/lib/internal/cli_table.js

import { stripVTControlCharacters as plainText } from "node:util";

const c = {
	horizontal: '─',
	rowMiddle: '┼',
	topLeft: '┌',
	topRight: '┐\n',
	bottomLeft: '└',
	bottomRight: '┘',
	leftMiddle: '├',
	rightMiddle: '┤\n',
	topMiddle: '┬',
	bottomMiddle: '┴',
	left: '│ ',
	right: ' │\n',
	middle: ' │ ',
};

const renderRow = (row, columnWidths, justifyRight) => {
	let result = c.left;
	for (let i = 0; i < row.length; i++) {
		const cell = row[i];
		//const needed = (columnWidths[i] - plainText(cell).length) / 2;
		//result += " ".repeat(needed) + cell + " ".repeat(Math.ceil(needed));
		const fill = " ".repeat(columnWidths[i] - plainText(cell).length);
		result += justifyRight[i] ? fill + cell : cell + fill;
		if (i !== row.length - 1)
			result += c.middle;
	}
	result += c.right;
	return result;
};

/**
* @param {string[]} head An array containing the headers for each column.
* @param {string[][]} rows An array where each entry contains the value in each column within a particular row from left to right.
* @param {boolean[]} justifyRight An array of booleans, one for each column, where each boolean determines whether to justify to the right for that column (default is left).
*/
export const drawTable = (head, rows, justifyRight) => {
	const columnWidths = head.map(h => plainText(h).length);

	/*for (const row of rows) {
		for (let i = 0; i < column.length; i++) {
			columnWidths[i] = Math.max(columnWidths[i], plainText(row[i]).length);
		}
	}*/

	const dividers = columnWidths.map(i => c.horizontal.repeat(i + 2));

	let result = c.topLeft + dividers.join(c.topMiddle) + c.topRight
		+ renderRow(head, columnWidths, justifyRight)
		+ c.leftMiddle + dividers.join(c.rowMiddle) + c.rightMiddle;

	for (const row of rows)
		result += renderRow(row, columnWidths, justifyRight);

	result += c.bottomLeft + dividers.join(c.bottomMiddle) + c.bottomRight;

	return result;
};

/**
* @param {[string, string][]} entries The entries of the table as an array of key-value pairs.
* @param {number} width The inner width of the table.
*/
export const drawSimpleTable = (entries, width) => {
	let result = c.topLeft + c.horizontal.repeat(width + 2) + c.topRight;

	for (const [key, value] of entries) {
		result += c.left + key + " ".repeat(width - plainText(key + value).length) + value + c.right;
	}

	result += c.bottomLeft + c.horizontal.repeat(width + 2) + c.bottomRight + "\n";

	return result;
};
