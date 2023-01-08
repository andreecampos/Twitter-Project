# twitter-clone App using Mongodb, NodeJS, Pug, JavaScript.

# Description
### Create account
A new user should be able to create an account on the service.
To create an account, the user enters a username and password. 
It should not be possible to create multiple users with the same username. It should also not be possible to enter a blank username or password.

### Log in and log out
After creating an account, the user should be able to log in to the service by entering their username and password.
A logged-in user should also be able to log out.

### Edit user profile
Each user should have a user profile consisting of a profile picture, a full name, and an email address.
It is optional for the user to add information to their user profile.
A logged-in user should be able to add and edit information in their user profile. To update their profile picture,
the user should be able to upload an image from their hard drive.

### Create post
A logged-in user should be able to create a post.
A post consists of text, which should be limited to a maximum of 140 characters. The time and date when the post was made should be saved in the database.

### Read post
There should be a page where all users' posts are listed. Each post in the list should include:

- Profile picture and username of the person who wrote the post
- The content of the post
- Time and date when the post was created

The posts should be sorted by date, with the most recent post first.
The profile picture and username in a post should link to the respective user's profile page (see below).
No login is required to read posts.

### Profile pages
Each user should have a profile page. On the profile page, the information from the user's profile should be displayed, 
as well as a list of their posts. The posts should have the same appearance and sorting as on the "read post" page (see above).
