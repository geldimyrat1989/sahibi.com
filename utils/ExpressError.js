//in this file we will define class that extends from built in Error class:
class ExpressError extends Error
{
    constructor(message, statusCode)
    {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}

//and we export this class to use:
module.exports = ExpressError;