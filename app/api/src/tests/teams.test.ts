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

  afterEach(() => {
    sinon.restore();
  });

    it('Testa se retorna todos os times', async () => {
      sinon.stub(TeamModel, 'findAll').resolves(teams as TeamModel[]);
      chaiHttpResponse = await chai.request(app).get('/teams');
      expect(chaiHttpResponse.status).to.be.eq(200);
      expect(chaiHttpResponse.body).to.be.an('array');
    });

    it('Testa se retorna um erro caso não exista um time com o id passado', async () => {
      sinon.stub(TeamModel, 'findAll').resolves(undefined);
      chaiHttpResponse = await chai.request(app).get('/teams/1000');
      expect(chaiHttpResponse.status).to.be.eq(404);
      expect(chaiHttpResponse.body).to.deep.eq({ message: 'Team not found' });
    });

    it('Testa se retorna um time pelo seu id', async () => {
      chaiHttpResponse = await chai.request(app).get('/teams/10');
      expect(chaiHttpResponse.status).to.be.eq(200);
      expect(chaiHttpResponse.body).to.deep.eq(teams[9]);
    });
});
