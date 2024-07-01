import { createObjectCsvWriter } from 'csv-writer';
import Website from '../models/websites';
import { isUtf8 } from 'buffer';

export const exportCSV = async (fields: string[]): Promise<string> => {
  const websites = await Website.find().select(fields.join(' '));
  const csvWriter = createObjectCsvWriter({
    path: 'data.csv',
    encoding :'utf-8',
    header: fields.map(field => ({ id: field, title: field }))
  });

  await csvWriter.writeRecords(websites.map(site => site.toObject()));
  return 'websites.csv';
};
