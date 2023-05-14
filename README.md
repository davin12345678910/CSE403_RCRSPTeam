# CSE403_RCRSPTeam
We are a team of computer science students working on a Resilient Course Registration System for CSE 403


## Idea of our project:
We are making an app that is building on top of the current registration system of the UW that we hope will improve the experience of registrarting for classes for users. For example, we hope to make the add in code process more streamlined then the current process where you have to ask advisers, then later get the people who you can contact, then contact the person, then wait for a response where you might be asked to give more information, and possibly not end up with the code. As you can see this process is very time consuming and not that nice for the user. We hope to make a more streamlined process that is embedded into the current registration system where you can easily contact the needed people and get quicker responses as it is a one stop shop. As for those who give add codes, given that the request won't be in their emails, which may be hidden within the many thousands of other emails it makes it easier for everybody!


## What does the system do?
TODO


## Goals:
1. Make a tool that is more accessibile for users: The current system doesn't provide all the information needed for registration in one place
2. Make a tool that has a more streamlined add in code process: The add code is time consuming and also it might be challenging for a person who is not familiar
3. Make a tool that expands the capabilities of the current system to improve the UI: The UI can be more user friendly and easy to use
4. Make a tool that is more transparent with users when they are registering: There are some complexities in the current system that our app is going to resolve
5. Make a tool that includes all of the ratings and previous grades of a class: The grade statistics can help user to decide which courses they want to register


## Layout of the repository:
###    Server directory: server portion of the code
-  `Server.java` : this is the java file that contains all of the Server code that we will need

###    Client directory: client portion of the code
-  `index.js`: This is file which boostraps the whole application and because it's a react application all the components will be loaded inside this file
###    Webpages: this is the place where we will have the layout of each of the pages
-  **Class Webpage** : this is the place where we will have all of the code for the layout of the class webpage <br/>
-  **MainPage Webpage** : this is the place where we will have all of the code for the layout of the MainPage webpage <br/>
-  **SearchEngine Webpage** : this is the place where we will have all of the code for the layout of the SearchEngine webpage <br/>
-  **Submission Webpage** : this is the place where we will have all of the code for the layout of the Submission webpage <br/>
      Note: for each of these Webpages you want to have a css file where you will have all of the code for the formatting and the
        style of the webpage. And we will have a javascript file where we will have all of the functionality as well as the code
        that will build up the html of the webpage


## How to build and test the system

#### Notes: This only works on a mac device.We found a solution on a windows but for some reason it doesn't work on all windows

### How to build the system steps:
- 1. Install Node at: https://nodejs.org/en/download
- 2. Make two terminals
- 3. In one terminal `cd Server` and `cd src`
- 4. Then `npm install`
- 5. Next run this `node server.js`

Once you have completed this step you should be a message in terminal saying that: 
Server started on port 3001

- 6. Next in the other terminal
- 7. Then type `cd client-app`
- 8. Then type `npm install`
- 9. Then run `npm start`

Once these steps are complete. In the second terminal, you should be a lot of stuff 
beign shown on the terminal which is basically npm starting up your server. Soon 
you should be able to see a link to our website at: http://localhost:3000/

### How to test the system
- 1. Make a new terminal
- 2. Then `cd server` and `cd src`
- 4. Download dependencies by doing `npm install` [If you have already done npm install in the build the system steps, you do not need to do this again]
- 5. Then run if you are on a macbook `NODE_OPTIONS=--experimental-vm-modules npx jest` if you are on a windows device use `set NODE_OPTIONS=--experimental-vm-modules && npx jest`


## Use cases that have been completed
- GPA and rating of courses in which a student wants to or possibly take is now displayed on the front end in order to inform users about the
  difficulty of a course and the overall rating of a professor for a course they plan to take
  
## Work in progress
TODO


## How to report a bug
TODO

