# Yelpcamp

YelpCamp is a website where users can create and review campgrounds all across the globe.

## Build :
This fully responsive project was Built on a MongoDB/Express/Node stack, utilizing RESTful architecture with the Bootstrap 5 CSS framework for styling, Passport.js was used to handle authentication.
The app performs CRUD operations for users, the campground, and the comments. These pieces are referenced within the database through various associations. Actionable commands are displayed dynamically on the site (edit/delete) for campground and comments, depending on a user’s authorization/ownership. Flash messages handle error and success messages to provide the visitor with feedback.

## Features :

### 1. Authentication

a) User signup with a username, password, and email

b) User login with username and password

c) Admin login with admin username and password

### 2. Authorization

a) One cannot create new posts or view user profiles without being authenticated

b) One cannot edit or delete existing posts and comments created by other users

c) Admin can manage all posts and comments

### 3. Manage campground posts with basic functionalities:

a)Create, edit, and delete posts and comments

b)Upload campground photos

c)Search existing campgrounds
