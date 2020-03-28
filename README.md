# Google Cloud Run repro for slow child_process.execFile() execution

## Steps to set up repro case:

After cloning this repo:

1.  ```export PROJECT=<name of project you are an owner of>```
2.  ```gcloud gcloud builds submit --tag gcr.io/$PROJECT/gcr-repro```
3.  ```gcloud run deploy gcr-repro --project $PROJECT--image gcr.io/$PROJECT/gcr-repro \```
    ```  --platform managed --allow-unauthenticated ```
4.  navigate to the URL returned from the deploy to invoke the script

