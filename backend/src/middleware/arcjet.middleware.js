import { aj } from "../config/arcjet.js";



export const arcjetMiddleware = async (req, res, next) => {
  try
  {
    const decision = await aj.protect(req, {
      requested: 1
    })

    if (decision.isDenied())
    {
     if (decision.reason.isRateLimit())
     {
       return res.status(429).json({
        error: "Too many requests",
        message: "Rate limit exceeded"
      })
     } else if (decision.reason.isBot()) {
      return res.status(403).json({
        error: "Bot access denied",
        message: "Automated requests are not allowed"
      })
     } else {
      return res.status(403).json({
        error: "Forbidden",
        message: "Blocked by Arcjet"
      })
     }
     
    }

    if (decision.results.some(result => result.reason.isBot() && result.reason.isSpoofed()))
    {
      return res.status(403).json({
        error: "Spoofed bot detected",
        message: "Malicious bot detected"
      })
    }

    next();
    
  } catch (err) {
    console.error(err);
    next()
  }
};