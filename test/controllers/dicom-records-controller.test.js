const express = require('express');
const request = require('supertest');
const multer = require('multer');

const {FileUploadService} = require('../../src/services/file-upload-service');
const {
  DICOMRecordsController,
} = require('../../src/controllers/dicom-records-controller');

jest.mock('multer');

multer.mockImplementation(() => {
  return {
    single() {
      return (req, res, next) => {
        req.body = {title: req.query.title};
        req.file = {
          originalname: 'IM00001',
          mimetype: 'application/octet-stream',
          path: '/tmp/dicom',
        };
        return next();
      };
    },
  };
});

const controller = new DICOMRecordsController();
const fileService = new FileUploadService({
  fileFieldName: controller.fileUploadFieldName,
});
const mockApp = express();
mockApp.post('/', [fileService.middleware()], (req, res) =>
  controller.create(req, res),
);

describe('DICOMRecordsController', () => {
  describe('create()', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-03-14T00:00:00.000Z'));

    it('responds with a DICOM record when DICOM file is valid', async () => {
      const res = await request(mockApp).post('/');

      expect(res.statusCode).toBe(201);
      expect(res.body).toStrictEqual({
        data: {
          id: expect.any(String),
          fileUploadedAt: '2024-03-14T00:00:00.000Z',
          fileUrl: '/tmp/dicom',
        },
      });
    });
  });
});
