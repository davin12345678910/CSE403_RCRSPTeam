# Week 8 status report for Sahil

## Team report:
### Status update:
1. We have completed the main endpoints that are needed for our registration system
2. We have completed our first user story, a user story where users are able to see the
   GPA and ratings of a professor and a course
3. We have finished the basic front end structure for our website
4. We have also completed the testing of all the main endpoints in which we had in mind


### Agenda for tuesday's meeting:
1. We will be discussing new endpoints we will need in order to save the courses and the
   sections in which a student has signed up for, which we did not have the time to do
2. We will be discussing the front end componenets in which we will need to build for future
   user stories that we have yet to implement
3. We will distributing tasks for the two points mentioned above


## Contributions of team memebers:

### Davin Win Kyi:

what I did:
I worked on the main endpoints that we needed to complete for our registration system.
I also worked on the edge cases that we had for the front end

what I learned:
I learned about yml files more, as we did run into more issues as we added in more
endpoints that had more requirments
I also learned about CORs errors and why they occur

What I had trouble on:
I had trouble figuring out the CORs error, but luckily our team was able to figure it out
at the neck of time


What I am stuck on:
We were stuck on figuring a way to make our system compatible with windows, which
we did not learn until one of our friends with a windows device wanted to try out our system


### Azaan Khalfe
what I did:
I worked on the endpoints for setting up the database, connecting to the database and getting the request from the query. I also worked on the tests and the CI

what I learned:
I learned more about node.js and how to test javascript using jest and how important using the CI is.

What I had trouble on:
i had trouble debugging for node.js since I am not familiar with java script and I have to troubleshoot a lot and look a lot of the documentation and other resources

What I am stuck on:
I have trouble on expanding the code and what the future plan should be.

### Ahmed Helow

what I did:
Implemented several endpoints to get data from our database and send them back to the front end for display. I also implemented a log endpoint that tracks users' activity based on when they log into our system. Worked also on testing out endpoints and our queries.


what I learned:
I learned how to implement endpoints and how to send requests from the frontend to the backend and send back needed data based on the endpoint.


What I had trouble on:
I had trouble learning node.js and front end frameworks since I wasn't familiar with that language.


What I am stuck on:
I am having trouble implementing new features for our system, I think we need to design and plan our next feature and how we are going to implement it.


### Chairnet Muche
what I did:
I mostly focused on the front-end aspects of the project with creating different pages as well as preparing the registration page. Additionally, I contributed to the document, where  I help with video editing and slide preparation.

what I learned:
I learned that it very crucial to understand what the back-end does so that I can use it to display
the front-end.

What I had trouble on:
My front-end partner and I faced some difficulty in showing the class rating system in the registration page. However, by helping each other, we managed to get it done.

What I am stuck on:
I'm still thinking about the CSS part for the pages, because we need to make it look appealing for students or users when they log in. And so, I'm considering what to do next by researching and learning what looks good on a website.



### Foad Shariat
what I did:
I worked on the Login and registration page. I connected the login page to use the login endpoint
and the registration page to use the getClass endpoint. We showed the user info in the registration page
by using the getPerson endpoint. I also populated both tables in modal and the table in the registration page


what I learned:
I learned how to get connected and use each endpoint's data in the front end. I also learned how to use
the modal in bootstrap and how to populate the table in the modal and the registration page.

What I had trouble on:
First I had trouble to understand how fetching the data works in the front end. I also had trouble to
understand how to use the modal in bootstrap and how to populate the table in the modal and the registration page.

What I am stuck on:
I'm stuck on how to add security to the frontend and how to prevent CORS errors from happening.
Frontend should handle edge cases to prevent attacks.


### Sol Zamora
what I did:
I worked more on the backend. I created a new data table that includes people, emails, passwords, and salts I then had to refactor all of the backend code to account for this new data table. I also implemented code to sign in new users into the databases as well as code for checking their credentials and logging them in.
Lastly, I fixed some bugs in the test suite and added some new ones to check the correctness of the newly implemented functions.

what I learned:
I learned more of the syntax of JavaScript, which I'm still very unfamiliar with. I also learned how to implement a hashing and salting function to secure the privacy of passwords.

What I had trouble on:
I had trouble refactoring all of the code after changing the structure of the SQL database. I had to modify every function we had already implemented to work with the new data tables.

What I am stuck on:
I'm stuck on modifying the server configuration to prevent CORS errors from happening. The frontend and backend are both working correctly independently, but are failing when working together. This error is proving difficult to debug.



## Plans for next week:
1. We will have completed a majority of the use cases that we planned to complete
2. We will add in endpoints that will be needed for our next use cases
3. We will work on the endpoint that is required for the use cases
4. Work on fixing the use case that Azaan made