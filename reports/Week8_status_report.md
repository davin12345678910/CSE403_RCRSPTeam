# Week 8 status report for Sahil

## Team report:
### Status update:
1. We have completed the add in code system for the front end and the back end
   - Note: on the tuesday deadline the add code system was not 100% functional, but now it's functionality should be working as expected 100%
2. We have worked on the backend for the add code system and have also added in
   a messaging system, but the use of the messaging system is still in the desicion
   making process
3. We are also working on a queueing system which has its endpoints completed
   but the completion for the front end of the queueing system is still in progress


### Agenda for tuesday's meeting:
1. We will be discussing the refactoring of the endpoints as there is a lot of
   redundancy in the code
2. We will also be talking about any additional endpoints in which we will need to add in
3. We will be discussing the new use case in which we will be having which will be replacing the use case in which Azaan had

## Contributions of team memebers:

### Davin Win Kyi:

what I did:
- I worked on the endpoints, tables and the test for the add code and message table endpoints
- I worked on the documentation of our project in the readme

what I learned:
I learned that there is a lot of refactoring to do for the endpoints we have, and that we should plan to start refactoring the code that we have for the endpoints


What I had trouble on:
I had trouble working on the endpoints in which we had for the add code for a bit,
but figured out that it was an issue in the placement of the endpoint. There
was a line of code that needed to be before it, and without it the endpoints that
we wrote would not work


What I am stuck on:
Currently, we are stuck on what we should do for Azaan's use case, but will be discussing this in the team meeting in which we will be having on thursday


### Azaan Khalfe
what I did:

what I learned:

What I had trouble on:

What I am stuck on:


### Ahmed Helow

what I did:


what I learned:


What I had trouble on:


What I am stuck on:


### Chairnet Muche
what I did:

what I learned:

What I had trouble on:

What I am stuck on:



### Foad Shariat
what I did:


what I learned:


What I had trouble on:


What I am stuck on:


### Sol Zamora
what I did:
I designed and implemented a waitlist system for courses. Students can add themselves to a course waitlist queue if the course is full. Once a spot opens up, the top queued student is automatically added to the course.

what I learned:
I learned you can make PRIMARY KEYS of column tuples in SQL. This way, each individual column of a table can have repeats of the same entry, but no row can have the same pair of entries as another.

What I had trouble on:
I had trouble figuring out the most efficient way to implement a queue in SQL. Further, I'm also having trouble implementing a system that checks for scheduling conflicts when a student attempts to register for courses that have conflicting time schedules.

What I am stuck on:
I'm stuck on handling the edge cases for the waitlist. Instances such as removing a student from the database should also remove the student from all classes, triggering a waitlist event to add another student to a course. Implementing this will require a refactorization of the backend code.


## Plans for next week:
1. We will be working on the use cases in which we have yet to complete
2. making sure to refactor the endpoints as much of the code in the endpoints is redundant
- we will also be discussing this with Sahil
