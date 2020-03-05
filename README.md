# animl
A platform for managing camera trap data

## Table of Contents

- [Overview](#overview)
- [Development](#usage)

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

![dataflow diagram](/assets/camera-trap-data-pipeline.jpg)

## Development

### Start backend Express app and frontend React app concurrently

```sh
npm run start-all
```