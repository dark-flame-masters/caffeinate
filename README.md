 
# Caffeinate
 
## Project URL
 
**Task:** Provide the link to your deployed application. Please make sure the link works.
https://caffeinate.page/
 
## Project Video URL
 
**Task:** Provide the link to your youtube video. Please make sure the link works.
https://www.youtube.com/watch?v=4CSzuH5X3oY 
 
## Project Description
 
**Task:** Provide a detailed description of your app

Caffeinate is an organizational and journaling application, intended to act as a one-stop sanctuary for a user. Users can sign up, sign in and sign out seamlessly via Google (gmail). 

Once signed in/up to Caffeinate, users have the availability to play some calming background noise (of water and birds) while they navigate the app, and pause/play it at any time (and on any page) they like.

Users can write entries in their own personalized journal, with a few emojis available at their disposal. Users can view all their journal entries, which will also feature the predicted sentiment of a given entry.

Users can take daily surveys to articulate and assess how their day is/was going. Users will be allowed to submit up to one survey a day (however for the purposes of this project we have reduced the timeout to 10 seconds), as well as view all their previous survey entries. 

Users can organize their tasks using a virtual agenda. They can add a todo item with or without a deadline. If a deadline is set at least 10 minutes from the time of creating the todo, they will receive an email reminder (to the gmail account that they have signed up with) 10 minutes prior to the deadline they set. Users can view their existing todos, and complete or incomplete a given todo, as well as completely delete a todo if they want to totally remove it (note: if the user deletes or completes a todo that had a deadline before the reminder time, they will not receive the email reminder anymore).

Users can also view their analytics, which illustrate trends in their journal and survey responses. For journals, users can view a word cloud composed from all their journal entries (excluding any exceedingly long words, emojis, and non-alphanumeric words). They can also view a doughnut graph that details the ratios of their journal sentiments over the last 30 journal entries. For surveys, users can view a line graph that depicts the trend in their survey ratings to reflect on trends in their “daily” moods.

Finally, all users will have their own virtual tree to foster, which grows based on the ratings of their daily surveys. For the purposes of the project, when logged in, the last (up to) 5 surveys from the last (minimum) 5 minutes since the tree status was last updated are collected and averaged out. If the average is high, the tree will grow by one stage (and stop once it has completely grown). If the average is low, the tree will “deteriorate” by one stage (and stop once it becomes completely underdeveloped). Users can visualize how they have been feeling over the past “week” by looking at their tree and checking on its development.

If users click on the “Caffeinate” logo at the top left of the site (once signed in), they will be redirected to the credits section which lists all the resources used in full, as well as the details of the tech-stack and creators (us :). Users will see a homemade error popup if something goes wrong unexpectedly, or if they attempt to complete an “illegal” action (e.g viewing journal entries if they haven’t made a single one, submitting survey responses containing illegal characters, etc…).
 
## Development
 
**Task:** Leaving deployment aside, explain how the app is built. Please describe the overall code design and be specific about the programming languages, framework, libraries and third-party api that you have used.

For backend, the language is Typescript and the main framework is NestJS and we use GraphQL for API. The Database we use is MongoDB and we use mongoose for modeling. For our architecture, we used resolvers as classes that handle the query requests, and service classes to perform the server logic. We also used Mongoose Models to interact with our MongoDB database and modules to encapsulate the purposes of each class. For libraries, we use “natural” to detect the sentiment of the user’s journal.We also used “nodemailer” for the feature of sending emails while “@nestjs/schedule” is for scheduling the emails.

For frontend, the language is Javascript (and CSS for styling) and the framework is React.js. Third party React libraries, such as Material-UI (for some miscellaneous components such as Button and TextField), react-wordcloud for the Analytics word cloud, react-chart-js (and chart.js) for the Analytics doughnut and line graphs, react-howler for the background music, react-google-login for Google sign in/up/out, day.js for data within the Agenda deadline section. The frontend is sectioned into components (the pages), styling (all the css styling), and media (all ui/ux media such as icons, the homemade tree drawings, and the background music mp3). We used React hooks throughout, instead of React components or classes.

## Deployment
 
**Task:** Explain how you have deployed your application.
To make our application simple to deploy, we decided to have the application that runs the server run both the frontend with static pages and the backend API.
We deployed our application with Docker on the AWS EC2 Virtual Machine. Each part of the application, which includes the Nginx reverse proxy, MongoDB, and the server itself are all containerized and interact with each other on the virtual machine.

Prior to application deployment on the EC2 instance, we configured the nginx proxy and certbot to do the challenges in order to retrieve the SSL certificates for our application. We also used and configured Google Domains so that the domains are pointing at the IP address of our application. Once we are done, we are able to deploy the app securely on HTTPS.

Since we are always making changes on the app during the project, we used GitHub Actions and GitHub Secrets to created a CI/CD workflow that on every push to the main branch, will:
* Take down all current volumes.
* Free up space by deleting unused volumes.
* Set environment variables by extracting the environment variables from GitHub Secrets.
* Run the production version of docker-compose.
 
 
## Maintenance
 
**Task:** Explain how you monitor your deployed app to make sure that everything is working as expected.

To monitor our app, we console logged any internal server errors in the backend, and view logs of each container by sshing into the AWS EC2 instance and running `docker logs <container-id>`. We are also able to see the contents of the MongoDB database also by logging in using MongoDB Compass.

## Challenges
 
**Task:** What is the top 3 most challenging things that you have learned/developed for your app? Please restrict your answer to only three items.
 
1. Using GraphQL API and TypeScript. The reason is that the framework is very different from Restful API and does not have some of the features. The Context is a bit difficult to get started and make it work with sessions and guards. Also the return types of the mutations need detailed specification and there are also a lot of details that need to be paid attention to to make the query or mutation work. Figuring out how to format GraphQL queries for axios (in the frontend) took some time to learn as well.
   
2. Deployment - As this was our first time deploying a web application, complete with SSL certificates and an NGINX proxy (outside of using Netlify/Heroku/Firebase which does it for you), it was very new to me on how to set it up, as well as configure it with the Docker containers deployed on the virtual machine.
   
3. Third Party APIs - Integrating third party services into our application was also new to us. It was our first time using the Google OAuth2 API along with nodemailer and gmail to send emails to the user for the scheduler. When using the Google OAuth2 API, we had to modify the frontend and backend so that the frontend is able to get the access token of the corresponding google account, and the backend is able to verify the access token on user-specific endpoints.For the scheduler, we will send emails to the user email, which is retrieved from google authentication and sent to gmail, which is also a third-party email server. And we also need to schedule the time of sending that email.
 
## Contributions
 
**Task:** Describe the contribution of each team member to the project. Please provide the full name of each team member (but no student number).

* Meixuan Lu: Backend development
* Jan Garong: DevOps, Backend development and designed the trees.
* Yara Radwan: Frontend development (including designing + styling)
 
# One more thing?

**Task:** Any additional comment you want to share with the course staff?

If you click the “Caffeinate” logo at the top left of the page after sign-in/up, it will direct you to our credits page.
