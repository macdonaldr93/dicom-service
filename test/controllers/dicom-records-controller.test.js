const express = require('express');
const request = require('supertest');

const {
  DICOMRecordsController,
} = require('../../src/controllers/dicom-records-controller');

const controller = new DICOMRecordsController();
const mockApp = express();

mockApp.post('/', (req, res) => controller.create(req, res));

describe('DICOMRecordsController', () => {
  describe('create()', () => {
    it('responds with a DICOM record when DICOM file is valid', async () => {
      const res = await request(mockApp).post('/');

      expect(res.statusCode).toBe(201);
      expect(res.body).toStrictEqual({data: {id: expect.any(String)}});
    });
  });
});
