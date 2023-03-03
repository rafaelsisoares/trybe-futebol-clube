import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchesModel from '../database/models/MatchesModel';

import { Response } from 'superagent';
import { matches, correctReturn, token, validMatch } from './mocks/matches.mock';
import generateToken from '../utils/generateToken';
import MatchesService from '../services/MatchesService';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /matches', () => {
  const inProgress = matches.filter((match) => match.inProgress === 1);
  const finished = matches.filter((match) => match.inProgress === 0);
  describe('Testa se', () => {
    /* before(async () => {
      sinon.stub(MatchesModel, "findAll")
       .resolves(matches as unknown as MatchesModel[]);
       sinon.stub(MatchesModel, "findAll")
       .resolves(inProgress as unknown as MatchesModel[]);
        sinon.stub(MatchesModel, "findAll")
        .resolves(finished as unknown as MatchesModel[]);
   }); */
 
    afterEach(()=>{
    /* (MatchesModel.findAll as sinon.SinonStub).restore();
    (MatchesModel.findAll as sinon.SinonStub).restore(); */
    sinon.restore();
   });

    it('retorna todas as partidas', async () => {
      await chai.request(app).get('/matches').then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
      });
    });

    it('retorna todas as partidas em andamento', async () => {
      await chai.request(app).get('/matches?inProgress=true').then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.be.eq(inProgress);
      });
    });

    it('é possível criar uma partida', async () => {
      sinon.stub(MatchesModel, 'create').resolves(correctReturn as MatchesModel);
      await chai.request(app).post('/matches').set('authorization', token)
      .send(validMatch)
      .then((res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.deep.eq(correctReturn);
      })
    });
  });
});
