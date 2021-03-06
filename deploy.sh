#!/bin/bash

# THIS SCRIPT ASSUMES THE FOLLOWING:
# 
#   PROJECT is an environment variable passed in which is set to the GCP project name
# 
#   creds.json contains the key file from a serviceaccount named omri@$PROJECT.iam.gserviceaccount.com 
#     has been granted permission to deploy into GCR 

mkdir /tmp/gcr-repro
cp ./creds.json /tmp/gcr-repro
cd /tmp/gcr-repro

# set up gcloud authentication
gcloud auth activate-service-account gcr-repro@$PROJECT.iam.gserviceaccount.com --key-file=creds.json --project=$PROJECT

# build the image from the current directory using the credentials set up above
gcloud --account gcr-repro@$PROJECT.iam.gserviceaccount.com --project $PROJECT run deploy gcr-repro-service-deployed-from-script --image gcr.io/$PROJECT/gcr-repro --platform managed --allow-unauthenticated --region us-central1

# revoke the credentials
gcloud auth revoke gcr-repro@$PROJECT.iam.gserviceaccount.com

cd /
rm -fr /tmp/gcr-repro
