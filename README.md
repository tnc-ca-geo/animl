# Animl
A platform for managing camera trap data

## Related repos

- Animl base program      http://github.com/tnc-ca-geo/animl-base
- Animl lambda function   http://github.com/tnc-ca-geo/animl-lambda
- Animl ML resources      http://github.com/tnc-ca-geo/animl-ml
- Animl desktop app       https://github.com/tnc-ca-geo/animl-desktop

## Overview

Animl is an open, extensible, cloud-based platform for managing camera trap data.
We are developing this platform because there currently are no software tools that allow 
organizations using camera traps to:

- ingest data from a variety of camera trap types (wireless, SD card based, IP, etc.)
- systematically store and manage images in a single centralized, cloud-based repository
- upload custom object detection and species clasification ML models and configure 
automated assisted-labeling pipelines
- Offer frontend web application to view images, review ML-assisted labels, 
perform manual labeling
- Offer an API for advanced querying and analysis of camera trap data
- Offer tools for exporting ML model training data

![dataflow diagram](/assets/camera-trap-data-pipeline.jpg)

## Development

### Clone the repo and add a .env file
We use dotenv to manage secrets, so you'll need to create your own in the ```animl/app``` directory with the following fields:

```
# Mongo DB Atlas
DB_USER = xxxxx
DB_PASS = xxxxx
DB_URI  = xxxxx

# AWS
AWS_ACCESS_KEY_ID      = xxxxx
AWS_SECRET_ACCESS_KEY  = xxxxx
AWS_REGION             = us-west-1

# Port
PORT = 8080

# Debug 
LOG_LEVEL = 'debug'
```

### Repo structure
The backend server application is in the ```animl/app``` directory, and the frontend client app is in the ```animl/frontend``` directory.

### Start backend Express app and frontend React app concurrently

```sh
npm run start-all
```

### Some tips for testing the API endponts
You can use Postman to make requests to localhost, for example, to test saving an image, send a POST request to ```http://localhost:8080/api/v1/images/save``` with the following body: 

```json
{"FileName": "1c566221-0795-4f9c-a337-d8f81f9ec938p_003048.jpg20191002.jpg", "MIMEType": "image/jpeg", "Make": "BuckEyeCam", "Model": "X7D", "DateTimeOriginal": "2019:10:02 08:39:49", "SerialNumber": "X01002E7", "ImageWidth": 1280, "ImageHeight": 960, "Megapixels": 1.2, "text_1": "-122.228118", "text_2": "37.406889", "Path": "p_003048.jpg20191002.jpg"}
```

If you want to test real requests being made from the [animl-lambda function](http://github.com/tnc-ca-geo/animl-lambda), [ngrok](https://ngrok.com/) is a super cool tool for safely creating a tunnel from the external internet to your localhost. It's free, super east to set up, and will allow you to view and interact with real requests coming in in real time. _NOTE: with the free version of ngrok, you don't get persistent tunnel URLs, so if you do this, you'll have to replace the ```ANIML_IMG_API``` constant at the top of [animl-lambda/lambda_function.py]](https://github.com/tnc-ca-geo/animl-lambda/blob/master/lambda_function.py) with the new tunnel URL ngrok gives you and upate the live lambda function._

