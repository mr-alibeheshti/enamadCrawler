import { createObjectCsvWriter } from 'csv-writer';
import Website from '../models/websites';
export const exportCSV = async (fields: string[]): Promise<string> => {
  const websites = await Website.find().select(fields.join(' '));
  console.log(websites);
  const csvWriter = createObjectCsvWriter({
    path: 'data.csv',
    header: fields.map(field => ({ id: field, title: field }))
  });

  await csvWriter.writeRecords(websites.map(site => site.toObject()));
  return 'data.csv'
};
