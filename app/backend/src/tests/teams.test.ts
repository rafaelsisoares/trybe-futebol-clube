import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel from '../database/models/TeamModel';

import { Response } from 'superagent';
import teams from './mocks/teams.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /teams', () => {
  let chaiHttpResponse: Response;

  before(() => {
    sinon.stub(TeamModel, 'findAll').resolves(teams as TeamModel[]);
  });

  after(() => {
    (TeamModel.findAll as sinon.SinonStub).restore();
  });

    it('Testa se retorna todos os times', async () => {
      chaiHttpResponse = await chai.request(app).get('/teams');
      expect(chaiHttpResponse.body).to.be.eq(teams);
    });
});
