*Backend repository:

/routes:
Has the API Endpoints.
Listens for requests and forwards them to the correct place.
Defines which URLs exist, and which controller should handle them.

/controllers:
For business logic.
Does the actual work such as processing, database, responses.
Handles requests from routes and calls database models if needed.