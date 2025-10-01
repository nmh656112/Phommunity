# Phommunity
Photo&amp;Video-sharing Social Network APP
## Set up
### 1. Get the App
clone the repo
### 2. Install all needed packages
Run following commands under src file (phommunity_app/src) in terminal: <br/>
```
npm install
```
### 3. Run the Client and Server

First, create needed key files in the specific location:<br />

1. Mongodb<br />

   Create a file named as "mongodbKeys.json" under the folder of the server with the following content:<br />

   ```json
   {
       "username":"<username offered by the credentials form>",
       "password":"<password offered by the credentials form>"
   }
   
   ```

   <br />

2. S3 Cloud Storage

   Create a file named as "keys.json" under the folder of  ` /client/src/assets` with the following content:<br />

   ```json
   {
       "ID":"<ID offered by the credentials form>",
       "SECRET":"<SECRET offered by the credentials form>"
   }
   ```

   <br />

After the key files has been created correctly, you could start the application by entering the client folder and server folder separately and open 2 terminals based on these two folders.<br />In Both terminal, run the following command to start both the client and server: <br/>
```
npm start
```
<img width="757" alt="image" src="https://github.com/minghuin/testRepo/blob/master/application%20booting.png?raw=true">
<br/>

*Now Phommunity will be automatically start on browser, it may takes several seconds on mac and one minute on windows. Enjoy your journey!*

## Phommunity User Manual
New user to Phommunity would see welcome page: <br/>
<br/>
<img width="1279" alt="image" src="https://user-images.githubusercontent.com/89489897/197070163-08022180-0056-4000-a01e-c63bdc0c6ecf.png">
<br/>
<br/>
Through clicking login or signup icon on top right, user can jump to login page and registration page: <br/>
<br/>
<img width="1279" alt="image" src="https://user-images.githubusercontent.com/89489897/197073901-ead10495-db04-42ae-9658-13fdfa0c6cc2.png">
<br/>
<br/>
<img width="1276" alt="image" src="https://user-images.githubusercontent.com/89489897/197074205-e5069f24-af9e-4830-8d87-c30aaa68eb80.png">
<br/>
<br/>
User can jump back to welcome page through clicking Phommunity icom on top left. <br/>

### User Login/Activity Feed/User Follow&Unfollow/User Profile Page
Here are some demo account, user can log in to them to start demoing phommunity: <br/><br/>
**user_name: yuxinhu**<br/>
**password: 123dsdffe**<br/>
<br/>
**user_name: ruizhang**<br/>
**password: few09234**<br/>
<br/>
**user_name: minghuini**<br/>
**password: abc123456**<br/>

After login of yuxinhu's account, homepage would display recommendation posts from the users followed by the current account, which is, indeed, the activity feed: <br/><br/>
<img width="1276" alt="image" src="https://user-images.githubusercontent.com/89489897/197075124-ac41f5ae-dfc0-4533-b601-588bf879dc2f.png">

User can click other users' avatar or username and then jump into the profile page of other user. In this page, user could follow/unfollow this user: 
<img width="1269" alt="image" src="https://user-images.githubusercontent.com/89489897/197075433-e498e0b6-8dae-4c0a-945c-77c9680d3b2b.png">

<br/>

In this case, if the demo user unfollowed the user ruizhang, ruizhang's post will not appear in the activity feed page, which is indeed the homepage<br/>

### Create Post/ Photo/Video upload
User can alse click profile icon on top right and then jump into self profile page, and make new post through clicking new post button: <br/><br/><img width="1268" alt="image" src="https://user-images.githubusercontent.com/89489897/197075619-2860d374-493a-4c52-acd1-734388ca6eaf.png">
<br/>

<br/>
<img width="1270" alt="image" src="https://user-images.githubusercontent.com/89489897/197075685-8412e984-b0e5-48b3-9de2-b4b8e97367c2.png">
<br/><br/>
<img width="1275" alt="image" src="https://user-images.githubusercontent.com/89489897/197075721-aaf3f99f-88ca-4549-a76c-df391453669c.png">
<br/><br/>
Additionally, User's homepage(Activity Feed Page)  would update if a user he/she is following creates a new post:  <br/><br/>
<img width="1275" alt="image" src="https://user-images.githubusercontent.com/89489897/197092278-5ba5d0de-207b-4090-b070-f8a4483c6909.png">
<br/><br/>

### User Registration
User can also register a new account on the registration page by inputing the new username and password and click the Sign Up button: <br/><br/>
<img width="1278" alt="image" src="https://user-images.githubusercontent.com/89489897/197076071-a2d4b738-414f-4905-890c-c54fe1cc7b80.png">
<br/><br/>
**The homepage will empty since the whole new user has never followed anybody. And, user can create new post through profile page.**


### Post likes & unliking
Users can like and unlike other users' post and the number of likes received by post could also be displayed on post: <br/><br/>
**Post before liked by someone.**
<br/><br/>
<img width="1275" alt="image" src="https://user-images.githubusercontent.com/89489897/201246098-d8fea16d-0f84-47f9-b017-08e655a87bd3.png">
<br/><br/>
**Post after liked by someone.**
<br/><br/>
<img width="1278" alt="image" src="https://user-images.githubusercontent.com/89489897/201246513-cf7e3a6e-d8fc-4b66-a122-5a89d5caeb5e.png">
<br/><br/>

### Post comments
Users can add comment to post and the comment could also be displayed on post: <br/><br/>
**Add comment in create comment page throught clicking Add comment button.**
<br/><br/>
<img width="1280" alt="image" src="https://user-images.githubusercontent.com/89489897/201247478-e42f83b3-50e6-4eda-897f-c65ee9941aed.png">
<br/><br/>
**The comment will be displayed on post view.**
<br/><br/>
<img width="1277" alt="image" src="https://user-images.githubusercontent.com/89489897/201247579-640794a9-78d6-42ae-8167-24151e5f72ff.png">
<br/><br/>

### Editing/Deleting Posts (caption/replacing images/videos) & Comments
Users can edit or delete their posts at any time in post detail page through directly clicking post: <br/><br/>
**Post detail page.**
<br/><br/>
<img width="1279" alt="image" src="https://user-images.githubusercontent.com/89489897/201247937-d93947be-aa94-4692-96f1-f4b95e6ee2bd.png">
<br/><br/>
**The comment could be deleted by clicking the delete button right below comment.**
<br/><br/>
<img width="346" alt="image" src="https://user-images.githubusercontent.com/89489897/201248088-3e7e4b32-47c9-4501-944e-5e82fccba5cc.png">
<br/><br/>

### Follower suggestions
Users would receive suggested follower if there is someone who followed same three persons: <br/><br/>
**Through click the only icon on the right of header, user can access to follower suggestion page.**
<br/><br/>
<img width="1279" alt="image" src="https://user-images.githubusercontent.com/89489897/201249351-88b050c3-acf7-4bdf-b361-e0a558bf6195.png">
<br/><br/>

### Tagging photos or @mentions in comments
Users can mention other user through using @ signal when create comment: <br/><br/>
**Creating comment.**
<br/><br/>
<img width="1278" alt="image" src="https://user-images.githubusercontent.com/89489897/201249604-9297a06a-e66d-4021-99df-d3fcc6d5800f.png">
<br/><br/>
**The mentioned user is acutally a hyperlink and through clicking it, user can access to their profile page.**
<br/><br/>
<img width="1278" alt="image" src="https://user-images.githubusercontent.com/89489897/201250033-ab4dc6dc-8406-4205-89cc-40839d551134.png">
<br/><br/>

## Test
Run following commands under both the client folder and the server folder in terminal: <br/>
```
npm install
npm test
```
Client Test Result:<br/>

<img width="736" alt="image" src="https://user-images.githubusercontent.com/89489897/201244483-61f709d7-f265-4ec8-8377-ba54da83f539.png">

Server Test Result: <br />

<img width="736" alt="image" src="https://raw.githubusercontent.com/minghuin/testRepo/master/server_test_result.png">
