import { parse } from 'csv-parse/sync';
import fs from 'fs';

export const parseCSV = (filePath: string) => {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
    });
};