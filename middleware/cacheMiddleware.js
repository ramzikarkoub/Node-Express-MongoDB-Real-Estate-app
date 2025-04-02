import redisClient from "../utils/cache.js";

export const cachePosts = async (req, res, next) => {
  try {
    const cacheKey = `posts:${JSON.stringify(req.query)}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      console.log("🚀 Returning cached data");
      return res.status(200).json(JSON.parse(cachedData));
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      await redisClient.setEx(cacheKey, 3600, JSON.stringify(body)); // ✅ Correct variable
      res.sendResponse(body);
    };

    next();
  } catch (error) {
    console.error("Cache middleware error:", error);
    next();
  }
};
