import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ENV } from './env.js'

export const aj = arcjet({
  key: ENV.ARCJET_KEY,
  characteristics: {
    ip: ["ip.src"]
  },

   rules: [
    shield({
      mode: "LIVE",
    }),
     
      detectBot({
      mode: "LIVE", 
      
        allow: [
        "CATEGORY:SEARCH_ENGINE"
      ], 
      }),
      
      tokenBucket({
      mode: "LIVE",
      refillRate: 5, 
      interval: 10, 
      capacity: 15, 
    }),
  ],
});



