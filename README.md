# CSE403_RCRSPTeam
We are a team of computer science students working on a Resilient Course Registration System for CSE 403


## Idea of our project:
We are making an app that is building on top of the current registration system of the UW that we hope will improve the experience of registrarting for classes for users. For example, we hope to make the add in code process more streamlined then the current process where you have to ask advisers, then later get the people who you can contact, then contact the person, then wait for a response where you might be asked to give more information, and possibly not end up with the code. As you can see this process is very time consuming and not that nice for the user. We hope to make a more streamlined process that is embedded into the current registration system where you can easily contact the needed people and get quicker responses as it is a one stop shop. As for those who give add codes, given that the request won't be in their emails, which may be hidden within the many thousands of other emails it makes it easier for everybody!

## High level description of our project:
Our project is a product that will make the lives of people at the UW easier through new features such as an automated add code system, a waitlist system, an automated section system, a system that allows users to see the rating and average GPAs for courses and many more features and we'll improve the overall current features of the uw registration system. A user would like to use our system in order to have a easier to use interface. With the current add code system it takes days and even weeks to get an add code as your email could get stuck in the emails of a person that has the add code system. But even before this, you might have some trouble finding a person with the add code. Thus with this system, we find the person who has the add code and you can simply message them with our in-system messaging system for getting add-codes. 


## What does the system do?
This system and project are based on the current registration system at UW and will improve it by adding more features that will make it easier for students, professors, and advisers and improve the whole registration system.


## Goals:
1. Make a tool that is more accessibile for users: The current system doesn't provide all the information needed for registration in one place
2. Make a tool that has a more streamlined add in code process: The add code is time consuming and also it might be challenging for a person who is not familiar
3. Make a tool that expands the capabilities of the current system to improve the UI: The UI can be more user friendly and easy to use
4. Make a tool that is more transparent with users when they are registering: There are some complexities in the current system that our app is going to resolve
5. Make a tool that includes all of the ratings and previous grades of a class: The grade statistics can help user to decide which courses they want to register


## Layout of important components in directory structure:

### github/workflows
- `learn-gtihub-actions.yml` : this is the yml file where you will be able to do automated testing of the codebase 

### client-app: client portion of the code
- `public`: this folder contains all of the images and icons that we will be using for our website 
- `src`: this is the folder that contains the main code that we will be using for the front end 
      - `app`: this folder contains the code for the the parent component in our code (React is the framework we are using, and you make componenets in React)
      - `assets`: this contains the images that we will be using for our website
      - `login`: this contains the code for the login page
      - `registration`: this contains the code for the registration page we are making 
      - Note: there are many more files, but much of the files are either in progress or are there just in case if we need it, we will most likely remove a good portion of them in the final release of our project
        
### reports
- in the reports directory we have stauts_report documentation that contains the overall tasks that team members have done, the overall tasks that we have or will complete, agenda meetings, and status reports  

### Server directory: server portion of the code
-  `src` this is the directory that contains the main server, testing code and database 
      - `app.js`: this is where we have the endpoints of our server
      - `app.test.js`: this is where we contain the testing code for our database 
      - `login.log`: this is where we are login in the logins that people are doing 
      - `registration.db`: this is the database that contains all of the informtion of the people using our system 
      - `server.js`: this is the server that runs the endpoints that we made 

### `Readme`: This contains helpful information for developers and users of our system 



## How to install the software needed for our website 
For this project, you will need to download node, so if you want to use this software make sure to download the latest version of node:
Link to node installation: https://nodejs.org/en/download
Make sure to download the version that is compatible to your system, so if you have a macbook, do the mac installation 
Once the download is complete, you should be able to use node 


## How to obtain the source code
Do `git clone https://github.com/davin12345678910/CSE403_RCRSPTeam.git`


## How to build and test the system

#### Important Notes: This only works on a mac device. We found a solution on a windows but for some reason it doesn't work on all windows

### How to build the system steps (How to run the software):
- 1. Make two terminals
- 2. In one terminal `cd Server` and `cd src`
- 3. Then `npm install`
- 4. Next run this `node server.js`

Once you have completed this step you should be a message in terminal saying that: 
Server started on port 3001

- 6. Next in the other terminal
- 7. Then type `cd client-app`
- 8. Then type `npm install`
- 9. Then run `npm start`

Once these steps are complete. In the second terminal, you should be a lot of stuff 
beign shown on the terminal which is basically npm starting up your server. Soon 
you should be able to see a link to our website at: http://localhost:3000/


### How to use our system:
- overall out system is compatible with major browsers such as google chrome and microsoft edge, please message us if there are any browser limitations 
- currently we have some work that currently is in progress, some of the functionality that is still in progress are...
      - a queueing system to register for courses 
      - a upcoming feature (which we are going to discuss and finalize this week May 15 - May 19)


### How to test the system
- 1. Make a new terminal
- 2. Then `cd Server`
- 4. Download dependencies by doing `npm install` [If you have already done npm install in the build the system steps, you do not need to do this again]
- 5. Then run if you are on a macbook `NODE_OPTIONS=--experimental-vm-modules npx jest` if you are on a windows device use `set NODE_OPTIONS=--experimental-vm-modules && npx jest`


### How to add new test into our codebase:
Steps on how to add tests: 
1. First make sure that you've cloned our repository
2. Next `cd server` && `cd src`
3. now you can find app.test.js
4. Here you can find tests that we've written, and in here, you will want to make a test case which you will make within the describes that contains the tests
5. First you will need to have something that looks like this:
      - 'test("TEST_INFO", async () => {
            // your code
          }, TIMEOUT)`
6. In TEST_INFO you will want to give a title for your tests
7. in the comment //your code, you will want to add in code that will be your test
8. TIMEOUT is where you can add a time out if a test is too long 

Guidlines: 
- make sure to follow google style conventions for javascript 
- make sure to have clear and informative titles for your tests 


## How to build a release of the software:
- There is a public link in which we are currently working on, and will be releasing this week!
      - thing that we hope to do to get the link released
            - Get a public hosting service where we can host our code 
            - Make sure that we can run the server and the front end with the link we are given from the hosting service 
            - check how the latency is, and adjust the code base as needed 


## Use cases that have been completed
- GPA and rating of courses in which a student wants to or possibly take is now displayed on the front end in order to inform users about the
  difficulty of a course and the overall rating of a professor for a course they plan to take
  
  
## Work in progress
Working on adding add code support and also waitlist support


## How to report a bug
When reporting a bug. Follow these steps:
1. if the bug has not been reported create a new issue   
2. Make a title for the bug that is clear 
3. Then list out the steps that cause that bug and be explicit, explaining what it is and what is causing it. 
4. If a bug reoccurs, then we can update the current issue to update the information.
5. Show the expected results and the actual results of the bug
6. Once the bug is fixed, update the issue. And if the bug comes back, go back and see the issue to deal with the bug.

## Known bugs:
1. Currently there is not a specific bug that has arised, we have resolved all current bugs, and are working on new features as of the moment. 


