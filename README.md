This is going to be my first big Project with Authentication, Authorization, CRUD, operations envolved.
1_step I implemented basic CRUD.
2_step I did Basic styling with Bootstrap, and added ejs-mate package to create layouts to style dynamically.
3_step Errors we created utils/cacthAsync & utils/ExpressError.js files and using them in our main app.js to wrap async functions for catching any errors, and passing them to our middleware at the bottom to handle those errors.
Then we npm i joi package to make requirement schema that will help us to check for validation of the user input forms.
4_step in this step we tackled reviews process, we implemented full CRUD with reviews so that user can leave a review to particular product and rating. and can delete one review at a time. If product deleted also reviews will be deleted accordingly. 