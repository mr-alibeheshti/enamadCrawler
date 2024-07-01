import express from 'express';
import mongoose from 'mongoose';
import { graphql } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema';
import resolvers from './resolvers/resolvers';
import { exportCSV } from './utils/csvExport';
import { Request, Response } from 'express';
import Website from './models/websites';

const app = express();
const PORT = process.env.PORT || 4000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/enamad-data', {
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to DataBase , Now You Can Search Data :)');
});

// GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

// Endpoint to get websites per star and then execute websitesPerCity query
app.get('/websitespercity', async (req: Request, res: Response) => {
  const query = `
    query {
      websitesPerCity {
        city
        count
      }
    }
  `;

  try {
    const result = await graphql({
      schema,
      source: query,
      rootValue: resolvers,
    });
    if (result.errors) {
      res.status(500).json(result.errors);
    } else {
      res.json(result.data);
    }
  } catch (error) {
    res.status(500).send('Error executing query');
  }
});

// Endpoint to get websites per star and then execute websitesByStars query
app.get('/websitesperstar', async (req: Request, res: Response) => {
  const query = `
    query {
      websitesPerStars {
        stars
        count
      }
    }
  `;

  try {
    const result = await graphql({
      schema,
      source: query,
      rootValue: resolvers,
    });
    if (result.errors) {
      res.status(500).json(result.errors);
    } else {
      res.json(result.data);
    }
  } catch (error) {
    res.status(500).send('Error executing query');
  }
});

// CSV export endpoint
app.get('/v1/export-csv', async (req: Request, res: Response) => {
  const fields = req.query.fields ? (req.query.fields as string).split(',') : [];
  if (fields.length === 0) {
    return res.status(400).send('Fields query parameter is required');
  }
  try {
    const filePath = await exportCSV(fields);
    res.download(filePath);
  } catch (error) {
    res.status(500).send('Error exporting CSV');
  }
});

// Endpoint to get all websites with filtering
app.get('/', async (req: Request, res: Response) => {
  try {
    const { name, domain, stars, expirationDate,city } = req.query;

    const filter: any = {};
    if (name) filter.name = name;
    if (domain) filter.domain = domain;
    if(city) filter.city = city;
    if (stars) filter.stars = Number(stars);
    if (expirationDate) filter.expirationDate = expirationDate;

    const websites = await Website.find(filter).select('-__v');
    res.json({ count: websites.length, data: websites });
} catch (error) {
    console.error('Error retrieving websites:', error);
    res.status(500).send('Error retrieving websites');
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
