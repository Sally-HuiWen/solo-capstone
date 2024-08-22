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

### Add a new kid
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

### View Current User kids list
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
### Update Cart Item Quantity
##
* Purpose: This fetch is sent to update the quantity value of a cart item.
* Method: ```PUT```
* URL: ```/api/cart/quantity```
* Body:
```python
{
   'id': INT,
   'val': INT
}
```
* Successful Response: HTTP Status 200
```python
{
   'id': INT,
   'category': STRING,
   'vendor_name': STRING,
   'manufacturer_id': STRING,
   'name': STRING,
   'model': STRING,
   'serial': STRING,
   'description': STRING,
   'tech_specs': STRING,
   'price': FLOAT,
   'quantity': INT
}
```
* Error Response1: HTTP Status 404
```python
{
   'errors': 'Item with given id Not Found'
}
```
* Error Response2: HTTP Status 400
```python
{
   'errors': ARRAY_OF_STRINGS
}
```
### Remove Item from Cart
##
* Purpose: This fetch is sent to delete an item from the cart.
* Method: ```DELETE```
* URL: ```/api/cart/delete/int:id```
* Successful Response: HTTP Status 200
```python
{
   'message': 'Success'
}
```
* Error Response: HTTP Status 404
```python
{
   'errors': 'Item with given id Not Found'
}
```

### Empty Cart
##
* Purpose: This fetch is sent to delete all items from the cart.
* Method: ```DELETE```
* URL: ```/api/cart/clear/int:id```
* Successful Response: HTTP Status 200
```python
{
   'message': 'Cart Emptied'
}
```
* Error Response: HTTP Status 404
```python
{
   'errors': 'Cart with given id Not Found'
}
```

## Shipping Info Routes

### Get Current User Shipping Info
##
* Purpose: This fetch is sent to retrieve all shipping info records for the user specified by the id.
* Method: ```GET```
* URL: ```/api/shipping/int:user_id```
* Successful Response: HTTP Status 200
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response: HTTP Status 404
```python
{
   'errors': 'User with given id Not Found'
}
```

### Create a new Shipping Record
##
* Purpose: This fetch is sent to add a new entry to the shipping info table.
* Method: ```POST```
* URL: ```/api/shipping/add```
* Body:
```python
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
```
* Success Response: HTTP Status 201
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response1: HTTP Status 400
```python
{
   'errors': ARRAY_OF_STRINGS
}
```
* Error Response2: HTTP Status 404
```python
{
   'errors': 'User with given id Not Found'
}
```

### Update Shipping Record
##
* Purpose: This fetch is sent to update the shipping info record specified by the shipping id.
* Method: ```PUT```
* URL: ```/api/shipping/update/int:shipping_id```
* Body:
```python
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
```
* Successful Response: HTTP Status 200
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response1: HTTP Status 400
```python
{
   'errors': ARRAY_OF_STRINGS
}
```
* Error Response2: HTTP Status 404
```python
{
   'errors': 'Shipping Record with given id Not Found'
}
```

### Delete Shipping Record
##
* Purpose: This fetch sends a shipping info id in the body of the request of the record to be deleted.
* Method: ```DELETE```
* URL: ```/api/shipping/delete```
* Body:
```python
{
   'id': INT
}
```
* Successful Response: HTTP Status 200
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response: HTTP Status 404
```python
{
   'errors': 'Shipping Record with given id Not Found'
}
```
## Billing Info Routes

### Get Current User Billing Info
##
* Purpose: This fetch is sent to retrieve all billing info records for the user specified by the id.
* Method: ```GET```
* URL: ```/api/billing/int:user_id```
* Successful Response: HTTP Status 200
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response: HTTP Status 404
```python
{
   'errors': 'User with the given id Not Found'
}
```

### Create new Billing Record
* Purpose: This fetch is sent to add a new entry to the billing info table.
* Method: ```POST```
* URL: ```/api/billing/add```
* Body:
```python
{
   apt_number: INT,
   city: STRING,
   company: STRING,
   country: STRING,
   primary: BOOLEAN,
   shipping_name: STRING,
   state: STRING,
   street: STRING,
   user_id: INT,
   zip: STRING
}
```
* Successful Response: HTTP 201
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response1: HTTP Status 400
```python
{
   'errors': ARRAY_OF_STRINGS
}
```
* Error Response2: HTTP Status 404
```python
{
   'errors': 'User with given id Not Found'
}
```

### Update Billing Record
* Purpose: This fetch is sent to update the billing info record specified by the billing id.
* Method: ```PUT```
* URL: ```/api/shipping/update/int:billing_id```
* Body:
```python
{
   apt_number: INT,
   city: STRING,
   company: STRING,
   country: STRING,
   primary: BOOLEAN,
   shipping_name: STRING,
   state: STRING,
   street: STRING,
   user_id: INT,
   zip: STRING
}
```
* Successful Response: HTTP Status 200
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response1: HTTP Status 400
```python
{
   'errors': ARRAY_OF_STRINGS
}
```
* Error Response2: HTTP Status 404
```python
{
   'errors': 'Billing Record with given id Not Found'
}
```
* Error Response3: HTTP Status 404
```python
{
   'errors': 'User with given id Not Found'
}
```
### Delete Billing Record
##
* Purpose: This fetch sends a billing info id in the body of the request. Upon successful deletion we return the updated array of user entries.
* Method: ```DELETE```
* URL: ```/api/billing/delete```
* Body:
```python
{
   'id': INT
}
```
* Successful Response: HTTP Status 200
```python
[
   {
      apt_number: INT,
      city: STRING,
      company: STRING,
      country: STRING,
      primary: BOOLEAN,
      shipping_name: STRING,
      state: STRING,
      street: STRING,
      user_id: INT,
      zip: STRING
   }
]
```
* Error Response: HTTP Status 404
```python
{
   'errors': 'Billing record with given id Not Found'
}
```
##


# Connect
[LinkedIn](https://www.linkedin.com/in/hui-wen-best/)

