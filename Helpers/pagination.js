
 function paginationResults (model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        console.log("page -- >",page);
        console.log("limit -- >",limit);

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
        console.log("limit -- >",limit);
        console.log("result --- >   ",results)

        try {
            results.results = await model.find().limit(limit).skip(startIndex).exec();
            console.log("results.results -- > ",results.results);
            res.paginationResults = results;
            console.log("res.pagination ---- >   ",res.paginationResults);
            next();  
        } catch (error) {
            res.status(500).json({ message: error.message});
        }
        
    }
}

module.exports = paginationResults;