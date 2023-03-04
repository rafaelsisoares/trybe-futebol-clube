import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
// import LeaderboardService from '../services/LeaderboardService';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /leaderboard', () => {
  describe('Testa se', () => {
    it('retorna a classificacao dos times mandantes', async () => {
      await chai.request(app).get('/leaderboard/home').then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
      })
    });
  });
});