import client from "../utils/cache.js";

export const cachePosts = async (req, res, next) => {
  try {
    const cacheKey = `posts:${JSON.stringify(req.query)}`;

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("🚀 Returning cached data");
      return res.status(200).json(JSON.parse(cachedData));
    }

    res.sendResponse = res.json;
    res.json = async (body) => {
      await client.setEx(cacheKey, 3600, JSON.stringify(body)); // cache for 1 hour
      res.sendResponse(body);
    };

    next();
  } catch (error) {
    console.error("Cache middleware error:", error);
    next();
  }
};
