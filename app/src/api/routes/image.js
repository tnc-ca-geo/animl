const express = require('express');
const ImagesService = require('../../services/images');

const route = express.Router();

const imageRouter = (app) => {
  app.use('/images', route);

  // save images
  route.post(
    '/save',
    // add middleware for dupe checking? validating? , 
    async (req, res, next) => {
      try {
        const imageServiceInstance = new ImagesService;
        const savedImage = await imageServiceInstance.saveImage(req.body);
        const objects = await imageServiceInstance.detectObjects(req.body)
        return res.status(201).end('saved image metadata');
      } catch (e) {
        // logger.error('🔥 error: %o', e);
        return next(e);
      }
    },
  );

  // get images
  route.get(
    '/',
    async (req, res, next) => {
      console.log('requeset body: ', req.body)
      const imageServiceInstance = new ImagesService;
      const images = imageService.getImages(req);
      return res.status(202).json(images);
    },
  );

  // update image
  // route.post(
  //   '/update',
  //   async (req, res, next) => {
  //     //...
  //   },
  // );

};


module.exports = imageRouter;