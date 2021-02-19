//here we define a function that will catch async errors:
module.exports = func =>
{
    return (req, res, next) =>
    {
        func(req, res, next).catch(next);
    }
}