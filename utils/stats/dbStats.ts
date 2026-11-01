import mongoose, { Model } from "mongoose";

const DAY_MS = 24 * 60 * 60 * 1000;
const TZ = "Asia/Tehran";

const dayFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: TZ });


const getDailyCounts = async <T>(Model: Model<T>, days = 30) => {

   const now = Date.now();


   const sinceId = mongoose.Types.ObjectId.createFromTime(
      Math.floor((now - days * DAY_MS) / 1000)
   );

   const rows: { _id: string; count: number }[] = await Model.aggregate(
      [
         { $match: { _id: { $gte: sinceId } } },
         {
            $group: {
               _id: {
                  // for each group -> we will have an '_id' which is creatd from 'date' of creation in form of 'Y-M-D'
                  $dateToString: {
                     // format of 'output' of this operator
                     // so the created '_id' will be in this format
                     format: "%Y-%m-%d",
                     // $toDate -> extracts a 'Date' from field '_id'
                     date: { $toDate: "$_id" },
                     // Tiemzone of Dates
                     timezone: TZ,
                  },
               },
               // $sum: 1  ->  each group has a separate accumulator (count) which starts from '0', 
               // with each new member of group, the accumulator is added to the value
               // we have in '$sum' (0 + $sum + $sum + ... -> count)
               count: { $sum: 1 },
            },
         },
      ]
   );

   // We use Map, because in last part that we create 'Array' of items
   // we need to find the corresponding 'count' for each 'date', to assign to that item
   // this helps us to search faster
   const map = new Map(rows.map((r) => [r._id, r.count]));

   // ** Note: above DB-query, only creates items for the 'days that had registerations'
   // so it doesnt contain all of 'dates' of 30-past days as '_id' fields.
   // so we create another Array with Array.from(), and create 'dates' and assign
   // corresponding 'count' values form DB-results
   // the days which are not considered in DB-result, will have 'count: 0'
   return Array.from({ length: days }, (_, i) => {

      // we used 'datFormatter' (Intl.DateTimeFormat()), because the 'Date'
      // that we create here for each item, must be compatible with the date-format
      // of DB-results (%Y-%m-%d)  ->  so we used 'en-CA' format that formats date in this form
      // also dateFormatter sets the same 'timezone' (TZ) that we used in DB-query
      const date = dayFormatter.format(new Date(now - (days - 1 - i) * DAY_MS));

      return { date, count: map.get(date) ?? 0 };
   });
}


export {
   getDailyCounts,
}