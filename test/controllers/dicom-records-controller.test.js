const request = require('supertest');

const {app} = require('../../src/app');

describe('DICOMRecordsController', () => {
  describe('create()', () => {
    it('responds with a DICOM record when DICOM file is valid', async () => {
      const res = await request(app).post('/dicom-records');

      expect(res.statusCode).toBe(201);
      expect(res.body).toStrictEqual({data: {id: expect.any(String)}});
    });
  });
});
