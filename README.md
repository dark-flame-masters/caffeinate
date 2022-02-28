# Caffeinate ☕

## Proposal Details
<ul>
  <li> <strong>project title:</strong> Caffeinate</li>
  
  <li> <strong>team members:</strong> Yara Radwan, Jan Garong, Meixuan Lu</li>
  
  <li> <strong>description of the web application:</strong><br/>
  Caffeinate is an organizational and journaling application, intended to act as a one-stop sanctuary for a user.
  Users will be able to write entries in their own personalized journal, take daily surveys to articulate and assess how their day is/was going,
  and organize their tasks using a virtual agenda. Users can also view their analytics, which illustrate trends in their survey responses.
  Furthermore, all users will have their own virtual tree to foster, which grows based on the positivity of their journal entries.
  The target demographic for our application is everyone of all ages; Everyone needs a place to talk about their day and their worries without
  fear of being judged -- and the only person that won’t do that is their own selves. Caffeinate serves as a platform for users to vent to themselves,
  express their emotions, and organize their day(s), all of which have the potential to make a positive contribution to their mental health.</li>

  <li> <strong>description of the key features that will be completed by the beta version:</strong>
    <ul>
      <li>User Authentication
        <ul>     
          <li>Sign up/Sign in</li>
          <li>Sign out</li>
          <li>Reset password (if forgotten) via one-time recovery code </li>
        </ul>
      </li>
      <li>Journal Entries
        <ul>
          <li>Create a journal entry</li>
          <li>View previous journal entries</li>
        </ul>
      </li>
      <li>Daily Survey
        <ul>
          <li>1-5 scale provided to rate each day</li>
          <li>Targeted short-answer questions based on rate of day (i.e if you rated the day as 5/5, it will ask the user what made them feel so happy, etc…)</li>
          <li>View previous survey entries</li>
        </ul>
      </li>
      <li>Scheduler
        <ul>
          <li>Daily agenda ("what to do today")</li>
          <li>Email reminders on time sensitive events 15 minutes before (using a third party email API)</li>
        </ul>
      </li>
    </ul>
  </li>
  
  <li> <strong>description of the additional features that will be complete by the final version:</strong>
   <ul>
      <li>Analytics
        <ul>     
          <li>Word Cloud for journal entry (using https://github.com/jasondavies/d3-cloud)</li>
          <li>Line graph for the 1-5 scale (using chart.js) to display trends in daily mood</li>
          <li>Tree (use images) that grows based on the n latest journal entries. The tree will grow/shrink depending on the word 
          sentiment of the retrieved journal entries. We only consider the most recent journals to construct the tree.</li>
        </ul>
      </li>
      <li>Decorate Journal Entries
        <ul>
          <li>Stickers to put on journal entry</li>
          <li>A set of basic stickers are provided</li>
        </ul>
      </li>
    </ul>
  </li>
  
  <li> <strong>description of the technology stack that you will use to build and deploy it:</strong>
    <ul>
      <li>Frontend - React (Javascript)</li>
      <li>Backend - Nest.js (Typescript)</li>
      <li>Database - MongoDB</li>
      <li>Deployment - Amazon Web Services</li>
    </ul>
  </li>
  
  <li> <strong>description of the top 5 technical challenges:</strong>
    <ol>
      <li>learning MongoDB</li>
      <li>learning React</li>
      <li>learning Nest.js</li>
      <li>implementing the Sticker Placement feature (will require using/storing coordinates)</li>
      <li>integrating third party APIs</li>
    </ol>
  </li>
</ul>
