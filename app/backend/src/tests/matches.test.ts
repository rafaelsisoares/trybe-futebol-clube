import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchesModel from '../database/models/MatchesModel';

import { Response } from 'superagent';
import matches from './mocks/matches.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /matches', () => {
  describe('Testa se', () => {
    before(async () => {
      sinon.stub(MatchesModel, "findAll")
       .resolves(matches as unknown as MatchesModel[]);
   });
 
    after(()=>{
    (MatchesModel.findAll as sinon.SinonStub).restore();
   });

    it('retorna todas as partidas', async () => {
      await chai.request(app).get('/matches').then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
      });
    });
  });
});
