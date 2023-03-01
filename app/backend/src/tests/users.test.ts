import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';
import UserModel from '../database/models/UserModel';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /login', () => {
  let chaiHttpResponse: Response;
  before(async () => {
    sinon.stub(UserModel, 'findOne').resolves({
      id: 1,
      username: 'user',
      role: 'role',
      email: 'user@example.com',
      password: 'p4$$w0rD'
    } as UserModel)
  })

  after(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  })

  describe('Testa se', () => {
    it('retorna uma mensagem de erro se o email estiver ausente', async (done) => {
      chaiHttpResponse = await chai.request(app)
      .post('/login')
      .send({ password: 'p4$$w0rD' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.eq('All fields must be filled');
        done();
      });
    });

    it('retorna uma mensagem de erro se a senha estiver ausente', async (done) => {
      chaiHttpResponse = await chai.request(app)
      .post('/login')
      .send({ email: 'user@example.com' })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.eq('All fields must be filled');
        done();
      });

      it('retorna um token se os dados estiverem corretos', async (done) => {
        chaiHttpResponse = await chai.request(app)
        .post('/login')
        .send({ email: 'user@example.com', password: 'p4$$w0rD' })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.token).to.be.an('string');
          done();
        });
      });
    });
  });
});
