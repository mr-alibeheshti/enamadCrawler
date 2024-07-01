import Website,{IWebsite} from "../models/websites";
const resolvers = {
    Websites:async(args:{name?: string; domain?: string; stars?: number; expirationDate?: string })=>{
        const filter : any ={};
        if(args.name) filter.name = args.name;
        if(args.domain) filter.domain = args.domain
        if(args.stars !== undefined) filter.stars = args.stars
        if(args.expirationDate) filter.expirationDate = args.expirationDate
        return Website.find(filter)
    },
    websitesPerCity:async ()=>{
        return Website.aggregate([
            {$group:{_id:"$city",count:{$sum : 1}}},
            {$project:{_id:0,city:'$_id',count:1}}
        ]);
    },
        websitesPerStars: async () => {
        return Website.aggregate([
          { $group: { _id: '$stars', count: { $sum: 1 } } },
          { $project: { _id: 0, stars: '$_id', count: 1 } }
        ]);
      }
}
export default resolvers;