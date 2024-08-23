# Bundle Of Joy

Bundle of Joy is a heartwarming website for users to capture and share their children's cherished moments with family members and friends. Celebrate every smile, step, and adventure together, no matter the distance.

# Live Link
https://solo-capstone.onrender.com/


## Tech Stack
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![Redux](https://img.shields.io/badge/redux-%23593d88.svg?style=for-the-badge&logo=redux&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)


 ### Database:
 ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)


  ### Hosting:
 ![Render](https://img.shields.io/badge/Render-%46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)


# Index

 [MVP's feature List](https://github.com/Sally-HuiWen/solo-capstone/wiki/MVP's-Feature-List) | [Database Schema](https://github.com/Sally-HuiWen/solo-capstone/wiki/Database-Schema) | [User Stories](https://github.com/Sally-HuiWen/solo-capstone/wiki/User-Stories) | [Wireframes](https://github.com/Sally-HuiWen/solo-capstone/wiki/WireFrames)


# Landing Page
![Landing Page Screenshot](react-vite/public/kid-dailyLogs-screenshot.png)

# Kids list Page
![Kids List Screenshot](react-vite/public/kids-list-screenshot.png)

# kid Daily Logs Page
 ![kid Daily Logs Screenshot](react-vite/public/kid-dailyLogs-screenshot.png)

# Endpoints
## Auth Routes

### Current User
##
* Purpose: Authenticates a user
* Method: ```GET```
* URL: ```/api/auth/```
* Successful Response: HTTP Status Code 200
```python
{
    "email": "demo@aa.io",
    "first_name": "Demo",
    "id": 1,
    "last_name": "User",
    "username": "Demo"
}
```
* Error Response: HTTP Status Code 401
```python
{ "errors": { "message": "Unauthorized" } }
```
### Unauthorized (from @login_required)
##
* Purpose: This endpoint will be routed to in the case that a protected route does not pass validations for the current user.
* Method ```POST```
* URL: ```/api/auth/unauthorized```
* Successful Response: NA 
* Error Response: HTTP Status Code 401
```python
{ "errors": { "message": "Unauthorized" } }
```
### Sign Up
##
* Purpose: This fetch sends the signup form data to the backend to process the creation of a new user.
* Method: ```POST```
* URL: ```/api/auth/signup```
* Successful Response: HTTP Status 201
```python
{ 
    "email": "test@aa.io", 
    "first_name": "Test", 
    "id": 4, 
    "last_name": "Testor",
     "username": "test" 
}
```
* Error Response: HTTP Status 401
```python
{
    "username": [
        "This field is required.",
         "Username must be between 3 and 30 characters", 
         "Username is already in use."
         ],
    "first_name": [
        "This field is required.", 
        "First name must be between 3 and 30 characters"
        ],
    "last_name": [
        "This field is required.", 
        "Last name must be between 3 and 30 characters"
        ],
    "email": [ 
        "This field is required.",  
        "Email address is already in use."
        ], 
    "password": [ 
        "This field is required.", 
        "Password must be between 6 and 20 characters" 
        ],
}
```
### Login
##
* Purpose: This fetch attempts to login a user with the provided credentials.
* Method: ```POST```
* URL: ```/api/auth/login```
* Successful Response: HTTP Status 200
```python
{ 
    "email": "demo@aa.io", 
    "first_name": "Demo", 
    "id": 1, 
    "last_name": "User", 
    "username": "Demo" 
}
```
* Error Response: HTTP Status 401
```python
{
    "email": [ 
        "This field is required.",  
        "Email provided not found." 
        ], 
    "password": [ 
        "This field is required.", 
        "No such user exists.", 
        "Password was incorrect." ] 
}
```
### Logout
##
* Purpose: This fetch will logout the current user.
* Method: ```GET```
* URL: ```/api/auth/logout```
* Successful Response: HTTP Status 200
```python
{
   'message': 'User logged Out'
}
```

## kid Routes

### Add a New Kid
##
* Purpose: This fetch is to add a new kid to kids list
* Method: ```POST```
* URL: ```/api/kids/new```
* Body:
```python
{
    "birth_date": "2024-01-01",
    "kid_image_url": "test-image",
    "name": "Emily",
    "relationship": "Mom",
}
```
* Successful Response: HTTP Status 201
```python
{
    "birth_date": "Mon, 01 Jan 2024 00:00:00 GMT",
    "id": 15,
    "kid_image_url": "test-image",
    "name": "Emily",
    "relationship": "Mom",
    "user_id": 1
}
```
* Error Response: HTTP Status 400
```python
{
    "errors": {
        "name": [
            "This field is required.",
            "Name can not be more than 50 characters"
        ],
        "birth_date": [
            "This field is required."
        ],
        "relationship": [
            "This field is required."
        ],
        "image": [
            "File type is not allowed."
        ]
    }
}
```

### Get Current User's Kids
##
*Purpose: This fetch is to view the kids list of the current logged-in user.
* Method: ```GET```
* URL: ```/api/kids/current```
* Successful Response: HTTP Status 200
```python
{
    "kids": [
        {
            "birth_date": "Wed, 06 Jun 2018 00:00:00 GMT",
            "id": 1,
            "kid_image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Elsa-profile-image.png",
            "name": "Elsa",
            "relationship": "Mom",
            "user_id": 1
        },
        {
            "birth_date": "Tue, 07 Jul 2020 00:00:00 GMT",
            "id": 2,
            "kid_image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Anna-profile-image.png",
            "name": "Anna",
            "relationship": "Mom",
            "user_id": 1
        }
    ]
}
```

### Get a Specific Kid by ID
##
*Purpose: This fetch is to retrieve a specific kid's details by their ID for the current logged-in user.
* Method: ```GET```
* URL: ```/api/kids/<int:kid_id>```
* Successful Response: HTTP Status 200
```python
{
    "birth_date": "Wed, 06 Jun 2018 00:00:00 GMT",
    "id": 1,
    "kid_image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/kid-Elsa-profile-image.png",
    "name": "Elsa",
    "relationship": "Mom",
    "user_id": 1
}
```

### Update a Kid by ID
##
* Purpose: This fetch is to allow the current logged-in user to update the details of a specific kid by their ID.
* Method: ```PUT```
* URL: ```/api/kids/<int:kid_id>```
* Body:
```python
{
    "birth_date": "2024-02-01",
    "kid_image_url": "image-test2",
    "name": "Hans",
    "relationship": "Mom",
}
```
* Successful Response: HTTP Status 200
```python
{
    "birth_date": "Thu, 01 Feb 2024 00:00:00 GMT",
    "id": 15,
    "kid_image_url": "image-test2",
    "name": "Hans",
    "relationship": "Mom",
    "user_id": 1
}
```
* Error Response 1: HTTP Status 400
```python
{
    "errors": {
        "name": [
            "This field is required.",
            "Name can not be more than 50 characters"
        ],
        "birth_date": [
            "This field is required."
        ],
        "relationship": [
            "This field is required."
        ],
        "image": [
            "File type is not allowed."
        ]
    }
}
```
* Error Response 2: HTTP Status 403
```python
{
    "errors": {
        "message": "You are not authorized"
    }
}
```
* Error Response 3: HTTP Status 404
```python
{
    "errors": {
        "message": "Kid not found"
    }
}
```

### Remove a Kid by ID
##
* Purpose: This fetch is to allow the current logged-in user to delete a specific kid by their ID.
* Method: ```DELETE```
* URL: ```/api/kids/<int:kid_id>```
* Successful Response: HTTP Status 200
```python
{
    "message": "kid remove successfully"
}
```

* Error Response 1: HTTP Status 403
```python
{
    "errors": {
        "message": "You are not authorized"
    }
}
```
* Error Response 2: HTTP Status 404
```python
{
    "errors": {
        "message": "Kid not found"
    }
}
```

## Daily logs routes
### Create a New Daily Log for a Specific Kid
##
* Purpose: This fetch is to allow the current logged-in user to create a new daily log for a specific kid by their ID.
* Method: ```POST```
* URL: ```/kids/<int:kid_id>/daily_logs/new```
* Body:
```python
{
    "title": "pumpkin farm fun",
    "content": "Elsa went to the Queens Farm and had a wonderful time!",
    "image": "Elsa-pumpkin-farm-image.png", 
}
```
* Successful Response: HTTP Status 201
```python
{
    "content": "Elsa went to the Queens Farm and had a wonderful time!",
    "created_at": "Fri, 23 Aug 2024",
    "id": 44,
    "image_url": "https://bundle-of-joy-july24.s3.amazonaws.com/c03faf5e0e8842378b80865f228461a2.png",
    "kid_id": 1,
    "title": "pumpkin farm fun"
}
```
* Error Response: HTTP Status 400
```python
{
    "errors": {
        "content": [
            "This field is required."
        ],
        "title": [
            "This field is required."
        ],
        "image": [
            "File type is not allowed."
        ]
    }
}
```
### Get All Daily Logs by Kid ID
##
* Purpose: This fetch is to retrieve all daily logs for a specific kid by their ID for the current logged-in user.
* Method: ```GET```
* URL: ```/api/kids/<int:kid_id>/daily_logs```
* Successful Response: HTTP Status 200
```python
{
    "daily_logs": [
        {
            "content": "Elsa went to the Queens Farm and had a wonderful time!",
            "created_at": "Fri, 23 Aug 2024",
            "id": 45,
            "image_url": "https://bundle-of-joy-july24.s3.amazonaws.com/c03faf5e0e8842378b80865f228461a2.png",
            "kid_id": 1,
            "title": "punpkin farm fun cool"
        },
        {
            "content": "ELsa invited all her kindergarten classmates to attend her birthday party. She had so much fun",
            "created_at": "Thu, 06 Jun 2024",
            "id": 1,
            "image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/daily-log-image1-Elsa-birthday-party.png",
            "kid_id": 1,
            "title": "Six-year-old Birthday Party"
        },
        {
            "content": "First day of kindergarten! She is a elementary student now! ",
            "created_at": "Wed, 16 Aug 2023",
            "id": 2,
            "image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/daily-log-image2-Elsa-first-day.png",
            "kid_id": 1,
            "title": "First Day of Kindergarten"
        },
        {
            "content": "chasing waves near the beautiful beach!",
            "created_at": "Sat, 15 Jul 2023",
            "id": 3,
            "image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/daily-log-image3-elsa-chase-waves.png",
            "kid_id": 1,
            "title": "Running Near Carmel-by-the-sea"
        },
        {
            "content": "ELsa just unlock the skill of  backward crossover! ",
            "created_at": "Sat, 20 May 2023",
            "id": 4,
            "image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/daily-log-image4-elsa-iceskating.png",
            "kid_id": 1,
            "title": "Ice-skating Progress "
        }
    ]
}
```
* Error Response 1: HTTP Status 403
```python
{
    "errors": {
        "message": "You are not authorized"
    }
}
```
* Error Response 2: HTTP Status 404
```python
{
    "errors": {
        "message": "Kid not found"
    }
}
```

### Get Daily Log by ID
##
* Purpose: This fetch is to retrieve the details of a specific daily log by its ID. 
* Method: ```GET```
* URL: ```/api/daily_logs/<int:daily_log_id>```
* Successful Response: HTTP Status 200
```python
{
    "content": "ELsa invited all her kindergarten classmates to attend her birthday party. She had so much fun",
    "created_at": "Thu, 06 Jun 2024",
    "id": 1,
    "image_url": "https://bundle-of-joy-july24.s3.us-west-1.amazonaws.com/capston-upload-images/daily-log-image1-Elsa-birthday-party.png",
    "kid_id": 1,
    "title": "Six-year-old Birthday Party"
}
```
* Error Response 1: HTTP Status 403
```python
{
    "errors": {
        "message": "You are not authorized"
    }
}
```
* Error Response 2: HTTP Status 404
```python
{
    "errors": {
        "message": "daily_log not found"
    }
}
```

### Update Daily Log by ID
##
* Purpose: This fetch is to update the details of a specific daily log by its ID for the current logged-in user..
* Method: ```PUT```
* URL: ```/api/daily_logs/<int:daily_log_id>```
* Body:
```python
{
    "title": "first-time playing chess",
    "content": "Elsa enjoy playing chess with Grandpa",
    "image": "Elsa-playing-chess.png",
}
```
* Successful Response: HTTP Status 200
```python
{
    "content": "Elsa enjoy playing chess with Grandpa",
    "created_at": "Fri, 23 Aug 2024",
    "id": 44,
    "image_url": "https://bundle-of-joy-july24.s3.amazonaws.com/efdc5c1297ae4b459fefaf2b416ab98d.png",
    "kid_id": 1,
    "title": "first-time playing chess"
}
```
* Error Response 1: HTTP Status 400
```python
{
    "errors": {
        "content": [
            "This field is required."
        ],
        "title": [
            "This field is required."
        ],
        "image": [
            "File type is not allowed."
        ]
    }
}
```
* Error Response 2: HTTP Status 403
```python
{
    "errors": {
        "message": "You are not authorized"
    }
}
```
* Error Response 3: HTTP Status 404
```python
{
    "errors": {
        "message": "daily_log not found"
    }
}
```
### Delete Daily Log by ID
##
* Purpose: This fetch is to delete a specific daily log by its ID for the current logged-in user..
* Method: ```DELETE```
* URL: ```/api/daily_logs/<int:daily_log_id>```
* Successful Response: HTTP Status 200
```python
{
    "message": "This daily_log is deleted successfully"
}
```

* Error Response 1: HTTP Status 403
```python
{
    "errors": {
        "message": "You are not authorized"
    }
}
```
* Error Response 2: HTTP Status 404
```python
{
    "errors": {
        "message": "daily_log not found"
    }
}
```
##

# Feature List
1. Kids
2. Daily Logs
3. Friendships
4. Likes
5. Comments

# Connect
<a href="https://www.linkedin.com/in/hui-wen-best/" target="_blank">
    <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="30" height="30" />
</a>

