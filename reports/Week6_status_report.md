# Week 6 status report for Sahil

## Team report:
### Status update:
- As an update we have compelted the CI and automated testing infrastructure of our code base.
- We have also completed a basic webpage outline for our website and have completed a good
  portion of the webpages for our website
- We have also completed most of the endpoints for one table in our codebase and we hope to do the
  same for the rest of the tables which should be easy since they are quite repetitive
- We have decided on a weekly meeting time

### Agenda for tuesday's meeting
1. We will be discussing the main changes we have to the CI and the server, and keep both
   subteams up to date in terms of what each team has accomplished and has completed
2. We will discuss any more needed endpoints that we will be needing for our frontend developers
3. We will be discussing the layout of the webpages that the front end team has came up with and we
   will ssee if there is any disagreement in terms of the webpages in which the front end
   team has made
4. We will be discussing any bugs or conflicts that have arisen in the codebase or any failures
   on the CI


## Contributions of team memebers:

### Davin Win Kyi:

what I did:
I learned how to set up test automation for node.js. I also learned how to use jest and supertest
which was the way in which we did the test automation. I also learned how to use github actions
which i never really used, and now i see the usefulness it has for projects

what I learned:
I learned that setting up the CI isn't always easy, and even if you have done it for something before
the setup might not be the same since you might be using new or different languages and automated
testing.

What I had trouble on:
I had trouble figuring out this exception where we had the CI run forever, but we have luckily figured
out the issue. The issue mainly had to do with the fact that we had an issue with two testing directories
in the front end and the back end, and since the front end was not implemented we got issues with the
test not stopping. And this was mainly because we had yet to setup the test for the front end.

What I am stuck on:
I am currently working on the front end testing infrastructure which we have decided to have as selenium
since it is one of the most reliable and has a lot of resources about it online.


### Azaan Khalfe
What I did:
I helped with the CI test automation, where I helped create some basic SQL tests and other tests for the endpoints. We used jest and supertest for the testing framework in node.js.


What I learned:
I learned that even if the tests work locally, setting up a CI infrastructure is difficult. I learned how to write tests in node.js with jest and how GitHub actions use a YAML file to test the code online, where we can choose when the code is tested. 


What I had trouble on:
I had trouble debugging the YAML file since the tests were running locally, but I didn’t really understand the purpose of the YAML file, so I researched about it. Also, the GitHub actions were taking 2 hours to run, so we had to improve and debug it so it did not take this long.


What I am stuck on:
I am stuck on fully flushing out the backend and having the code be connected through the backend and frontend. So I will meet with my group and focus on this so we have it function before the Alpha release. 


### Ahmed Helow

What I did:
I helped with designing our backend as well as implementing the base code for it. I also helped with writing some test cases and setting up github actions for our CI testing, in which it run the tests every time someone of the group pushes to the repository.


what I learned:
I learned about CI testing for the first and how useful it is in working environments, as well as creating sql tables in node.js and using them in our testing.


what I had trouble on:
I had trouble setting up github actions and CI testing. Tests were passing locally but not on github actions, but we ended up figuring it out.


what I am stuck on:
I am currently trying to figure out the best ways and methods to write tests for our backend.



### Chairnet Muche
What I did: I contributed to the front-end aspect of the document and performed revisions and writing on other sections as needed. I added some components to RegistrationPage to demonstrate its functionality when students input their UW email and password, it should open up a new tap for a registration page.  Currently, I am focused on developing the front-end component of the project and adding new components by adding new pages for different purposes.

what I learned: I learned how the layout of our project works, and how to create a new tab for different components.

what I had trouble on: I had trouble with how to run the back-end side of our project in that had to download the need files in order to run it and pass all of the tests.

what I am stuck on: I am still stuck on the way to style the web pages for our website. I need more time to implement the front end in that we need to come up with a great background style for different tabs when the students click on them. For example, we need to come up with coloring of the page when the student clicks on the registration page.

### Foad Shariat
What I did:
I helped with the front-end elements needed for the project. I also helped with the design details in the document. I have seeded the react app with the basic components and have started working on the front-end design.

what I learned:
I learned about the MVC and tried to see if we could use soft of the software components in MVC as one of our
software components. I learned how much React can improve the front-end elements, how other components must be included within the design, and can fully improve the overall front-end.

what I had trouble on:
I had trouble finding the needed endpoints for our API since there are so many things that we need, where I had trouble picking the library to use

what I am stuck on:
I am still struggling to find the best design for the webpages, I am stuck on seeing if we need more libraries to improve the front end.


### Sol Zamora
What I did:
I helped designed the backend infrastructure, writing tests for it, and debugging the failing tests. I also helped setting up the github actions for our CI testing, which was producing an unexpected delay. Lastly, I also helped writing the documentation for testing environment.

what I learned:
I learned that JavaScript can be used to build a reliable backend. At first, I was planning on writing the serverside code in Java since it's the language I'm most familiar with and is commonly used for backend services. However, this would result in problems later down the line when trying to transfer data from the frontend to the backend, which would've been written in different languages. Fortunately, Davin suggested that we instead code the backend in JavaScript and save ourselves the hassle, which has worked out great!

what I had trouble on:
I had trouble installing some of the dependencies required to execute the code on my machine. Several of my teammates use a different machine than I, and this resulted in different dependencies being required to run the test suite.

what I am stuck on:
I am stuck on writing deeper and more involved tests for the test suite. I am still new to JavaScript, so I'm trying to learn the syntax for development and testing as we go.


## Plans for next week:
1. We wil have compeleted all of the endpoints for the API
2. We will have compelted all of the test that are needed for the API and the backend as needed
3. We will have compelted the functionality of the webpages in which we will have for the website in
   which we are working with
