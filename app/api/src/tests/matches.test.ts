import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchesModel from '../database/models/MatchesModel';

import { Response } from 'superagent';
import { matches, correctReturn, token, validMatch, invalidMatches } from './mocks/matches.mock';
import MatchesService from '../services/MatchesService';
import { jwtVerifyMock } from './mocks/users.mock';
import { IMatch } from '../interfaces/IMatch';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /matches', () => {
  const inProgress = matches.filter((match) => match.inProgress === 1);
  const finished = matches.filter((match) => match.inProgress === 0);
  describe('Testa se', () => {
    afterEach(()=>{
    sinon.restore();
  });

    it('retorna todas as partidas', async () => {
      sinon.stub(MatchesModel, 'findAll').resolves(matches as unknown as MatchesModel[]);
      await chai.request(app).get('/matches').then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.deep.equal(matches);
      });
    });

    it('retorna todas as partidas em andamento', async () => {
      sinon.stub(MatchesModel, 'findAll').resolves(matches as unknown as MatchesModel[])
      await chai.request(app).get('/matches?inProgress=true').then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.deep.eq(inProgress);
      });
    });

    it('é possível criar uma partida', async () => {
      sinon.stub(MatchesModel, 'create').resolves(correctReturn as MatchesModel);
      sinon.stub(jwt, 'verify').resolves(jwtVerifyMock);
      await chai.request(app).post('/matches').set('authorization', token)
      .send(validMatch)
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.deep.eq(correctReturn);
      });
    });

    it('não é possível criar uma partida entre dois times iguais', async () => {
      sinon.stub(MatchesModel, 'create').resolves({
        status: 422,
        message: 'It is not possible to create a match with two equal teams'
      } as unknown as MatchesModel);
      sinon.stub(jwt, 'verify').resolves(jwtVerifyMock);

      await chai.request(app).post('/matches').set('authorization', token)
      .send(invalidMatches[0])
      .then((res) => {
        expect(res).to.have.status(422);
        expect(res.body).to.deep.eq({ message: 'It is not possible to create a match with two equal teams' });
      });
    });

    it('não é possível criar uma partida com um time inexistente', async () => {
      sinon.stub(MatchesModel, 'create').resolves({
        status: 404,
        message: 'There is no team with such id!',
      } as unknown as MatchesModel);
      sinon.stub(jwt, 'verify').resolves(jwtVerifyMock);

      await chai.request(app).post('/matches').set('authorization', token)
      .send(invalidMatches[1])
      .then((res) => {
        expect(res).to.have.status(404);
        expect(res.body).to.deep.eq({ message: 'There is no team with such id!' });
      });
    });
  });
});
