import { buildSchema } from "graphql";

const schema = buildSchema(`
    type Website {
        id: ID!
        name: String!
        domain: String!
        stars: Int!
        expirationDate: String!
        city: String!
    }
    
    type Query{
        websites(name: String, domain: String, stars: Int, expirationDate: String): [Website]
        websitesPerCity: [CityCount]
        websitesPerStars: [StarsCount]
  }

  type CityCount {
    city: String!
    count: Int!
  }

  type StarsCount {
    stars: Int!
    count: Int!
  }
    
  `)
export default schema;