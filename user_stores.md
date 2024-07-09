# User Stories

## Users

### Sign Up

* As an unregistered and unauthorized user, I want to be able to sign up for the website via a sign-up form.
  * When I'm on the `/signup` page:
    * I would like to be able to enter my email, username, first name, last name and preferred password on a clearly laid out form.
    * I would like the website to log me in upon successful completion of the sign-up form.
      * So that I can seamlessly access the site's functionality
  * When I enter invalid data on the sign-up form:
    * I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
    * So that I can try again without needing to refill forms I entered valid data into.

### Log in

* As a registered and unauthorized user, I want to be able to log in to the website via a log-in form.
  * When I'm on the `/login` page:
    * I would like to be able to enter my email and password on a clearly laid out form.
    * I would like the website to log me in upon successful completion of the log-up form.
      * So that I can seamlessly access the site's functionality, e.g. purchase products that are listed for sale
  * When I enter invalid data on the log-up form:
    * I would like the website to inform me of the validations I failed to pass, and repopulate the form with my valid entries (except my password).
      * So that I can try again without needing to refill forms I entered valid data into.

### Demo User

* As an unregistered and unauthorized user, I would like an easy to find and clear button on both the `/signup` and `/login` pages to allow me to visit the site as a guest without signing up or logging in.
  * When I'm on either the `/signup` or `/login` pages:
    * I can click on a Demo User button to log me in and allow me access as a normal user.
      * So that I can test the site's features and functionality without needing to stop and enter credentials.
    * This demo user will be a Seller and a Shopper user profile

### Log Out

* As a logged in user, I want to log out via an easy to find log out button on the navigation bar.
  * While on any page of the site:
    * I can log out of my account and be redirected to the home page, displaying products for sale.
      * So that I can easily log out to keep my information secure.

## 1. Kids

### Add Kids

* As a logged in user, I want to be able to add kids
  * When I'm on the `/add-kid` page:
    * I can write add and submit a new kid.
      * So that I can post this kid's daily_logs and upload this kid's daily_log_images in the future.

### Viewing Kids list

* As a logged in user, I want to be able to view all kids
  * When I'm on the `/kids` page:
    * I can view all kids that I added.
      * So that I can read kids information and post kids' daily_logs and upload kids' daily_log_images

* As a logged in user, I want to be able to view a specific kid
  * When I'm on the `/kids/:kidId` page:
    * I can view the kid detail page
      * So that I can review a full information of the kid including the kid's name and birthday.

### Updating Kids

* As a logged in user who added kids, I want to be able to edit kids information that I have added
  * When I'm on the `/kids/:kidId` page:
    * I can click "Edit" to make permanent changes to kids information
      * So that I can fix any errors I make.

### Deleting Kids

* As a logged in user, I want to be able to delete any kid that I added
  * When I'm on the `/kids/:kidId` page:
    * I can click "Delete" to permanently delete a kid that I have added
      * So that when I realize that kids become too annoying and I do not feel like posting their daily_logs any more.

## 2. Daily_logs

### Create Daily_logs 

* As a logged in user, I want to be able to post daily_logs and update daily_log_images for kids for the kids that I have added.
  * When I'm on the `/kids/:kidId/daily-logs` page:
    * I can create and submit a new daily_log.
      * So that I can record and share this moment with my family members and friends

### Viewing Daily_logs 

* As a logged in user, I want to be able to view all daily_logs that I posted and daily_log_images that I uploaded
  * When I'm on the `/kids/:kidId/daily-logs` page:
    * I can view all daily_logs that I posted for the specific kid.

* As a logged in user, I want to be able to view a specific daily_log that I posted and its related images that I uploaded.
  * When I'm on the `/kids/:kidId/daily-logs/:dailyLogId` page:
    * I can view the specific daily_log that I posted for the specific kid.

### Updating Daily_logs 
* As a logged in user who has posed daily_logs, I want to be able to update my daily_logs.
  * When I'm on the `/kids/:kidId/daily-logs/:dailyLogId` page:
    * I can click "Edit" to make permanent changes to the daily_log that I have posted.
      * So that I can change my the daily_log that I have posted.

### Deleting Daily_logs 
* As a logged in user who has posed daily_logs, I want to be able to delete my daily_logs.
  * When I'm on the `/kids/:kidId/daily-logs/:dailyLogId` page:
     * I can click "Delete" to permanently delete the review I have posted.
      * So that when I change my mind not to record or share this moment.

## 3. Friends

### Create a Friend Request

* As a logged in user, I want to be able to send a friend request to another user
  * When I'm on the `/friends/requests/new` page:
    * I can send a friend request to anther user
      * So that I and my friend  can view my each other's daily_logs and leave comments on on each other's daily_logs

### View Friend Requests

* As a logged in user, I want to be able to view all friends(status:pending)
  * When I'm on the `/friends/requests` page:
    * I can view all my friends requests that I have received

* As a logged in user, I want to be able to view a specific daily_log that I posted and its related images that I uploaded.
  * When I'm on the `/kids/:kidId/daily-logs/:dailyLogId` page:
    * I can view the specific daily_log that I posted for the specific kid.

### Accept Friend Requests
* As a logged in user who has posed daily_logs, I want to be able to update my daily_logs.
  * When I'm on the `/friends/requests/:requestId` page:
    * I can click "Accept" to accept a friend request
      * So that I and my friends could share incredible moments and communicate with each other.
 
  * When I'm on the `/friends/requests/:requestId` page:
     * I can click "Decline" to decline a friend request
      * So that when I do not know those users or do not want to share moments with those friends yet.

### Delete a friend
* As a logged in user who has posed daily_logs, I want to be able to delete my daily_logs.
  * When I'm on the `/friends/:friendId` page:
     * I can click "Delete" to delete a friend from the friend list
      * So that when I unfriend with those users

## 4. Comments

### Create Comments 

* As a logged in user who has friends, I want to be able to leave a comment on my own daily_logs and friends' daily_logs.
  * When I'm on the `/daily-logs/:dailyLogId/comments` page:
    * I can create and submit a new comment.
      * So that I can share my thoughts and interact with my friends.

### Viewing Comments  for a daily_log

* As a logged in user, I want to be able to view a list of comments of a daily_log.
  * When I'm on the `/daily-logs/:dailyLogId/comments`page:
    * I can view the ten most recently listed comment for that specific daily_log

### Updating Comments  for daily_logs
* As a logged in user who has commented the daily_logs, I want to be able to update my comments.
  * When I'm on the `/comments/:commentId` page:
    * I can click "Edit" to make permanent changes to the comment I have commented.
      * So that I can change my comment.

### Deleting Comments  for daily_logs
* As a logged in user who has has commented the daily_logs, I want to be able to delete my comments.
  * When I'm on the `/comments/:commentId` page:
     * I can click "Delete" to permanently delete the comment I have commented.
      * So that when I regret what I said.


