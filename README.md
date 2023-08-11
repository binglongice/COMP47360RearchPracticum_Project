# COMP47360RearchPracticum_Project

Submission link for group 5:
https://csi6220-2-vm4.ucd.ie/#

Group members:
- Zhan Li
- Cormac Egan
- Maximilian Girt
- Nicholas Hegarty
- Colmán Larkin
- Yuntao Wei

Steps:
To access our website you can use the link provided above

Alternatively, if you wish to run the website locally you can clone our repository (ensuring that you work off of main). 
 It is recommended that you create an anaconda environment and use the requirements.txt file to install the necessary modules to run the python backend. 

To install the necessary frontend packages you will have to use node packet manager (npm) in COMP47360RearchPracticum_Project/coffee-compass, running npm install will install the neccessary packages as detailed in package.json and package-lock.json

Currently the code is configured on main so that it connects to the __endpoints on the server__. This means you will solely be running the __frontend__ locally. In order to do this you must open up terminal and navigate to the folder called “coffee-compass” (COMP47360RearchPracticum_Project/coffee-compass) and run npm start. This will launch the local development server on http://localhost:3000

Should you wish to run the backend locally you must 
1. Install redis and redis-stack (this will be used for caching)
2. Create a postgresql db populating it with predictions and cafe data. This is done by:
    1. Going to COMP47360RearchPracticum_Project/backend in terminal and running 
        1. python manage.py makemigrations
        2. python manage.py migrate
    2. Running the code in the jupyter notebook “using_predictions.ipynb” to populate the predictions table
    3. Going to COMP47360RearchPracticum_Project/backend in terminal and running manage.py populate_aggregated_predictions
3. Change the code in settings.py to use the local redis server
4. Change the code in settings.py to use the local postgresql db rather than the AWS RDS
5. Change the code in store.js to use the locally hosted api endpoints (rather than the endpoints hosted on the ucd server)
6. Create 2 terminal tabs
    1. In the first go to COMP47360RearchPracticum_Project/backend and run “python manage.py runserver”. This will start the django development server on http://127.0.0.1:8000
    2. In the second again go to COMP47360RearchPracticum_Project/backend and run redis-stack-server. This will launch the redis stack server to enable caching on the website

If you complete these steps you should now be running both the backend and the frontend of the website locally!
