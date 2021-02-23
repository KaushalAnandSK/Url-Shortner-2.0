
 function paginationResults (model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {};

        if(endIndex < model.length) {
            results.next = {
                page: page+1,
                limit: limit
            }
        }

        if(startIndex > 0){
            results.previous = {
                page: page -1,
                limit: limit
            }
        }

        try {
            results.results = await model.find().sort({created_at: -1}).limit(limit).skip(startIndex).exec();
            res.paginationResults = results;
            next();  
        } catch (error) {
            res.status(500).json({ message: error.message});
        }
    }
}

module.exports = paginationResults;