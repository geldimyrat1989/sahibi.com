This is going to be my first big Project with Authentication, Authorization, CRUD, operations envolved.
1_step I implemented basic CRUD.
2_step I did Basic styling with Bootstrap, and added ejs-mate package to create layouts to style dynamically.
3_step Errors we created utils/cacthAsync & utils/ExpressError.js files and using them in our main app.js to wrap async functions for catching any errors, and passing them to our middleware at the bottom to handle those errors.
Then we npm i joi package to make requirement schema that will help us to check for validation of the user input forms.
4_step in this step we tackled reviews process, we implemented full CRUD with reviews so that user can leave a review to particular product and rating. and can delete one review at a time. If product deleted also reviews will be deleted accordingly. 
5_step in this step We npm installed express-session for sending cookies to a browser to remember some information about particular activities on particular browser. And npm installed connect-flash for flashing error and success messages to a user so he/she nows about creating and deleting some objects. And we break up our app.js file to a seperate files in routes directory so we can access them with help of middleware by exporting from routes and importing in app.js file. it will help us to clean our app.js file and it will be easier to access routes.
6_step In this step we will tackle basic authentication by using npm i passport passport-local passport-local-mongoose.
They will help us do things a lot easier and more secure, they will hash password.
7_step In this step we build Autherization. This way each user will get access only if they own a product.
The user won't be able to delete or edit other users' products. And same with reviews the user will get access to delete only if the user owns particular review.