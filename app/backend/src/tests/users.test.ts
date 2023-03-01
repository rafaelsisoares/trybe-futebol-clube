import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Example from '../database/models/ExampleModel';
import UserModel from '../database/models/UserModel';

import { Response } from 'superagent';
import { token } from './mocks/users.mock';

chai.use(chaiHttp);

const { expect } = chai;

describe('Testes do endpoint /login', () => {

  beforeEach(async () => {
    sinon.stub(UserModel, 'findOne').resolves({
      id: 1,
      username: 'admin',
      role: 'admin',
      email: 'admin@admin.com',
      password: 'secret_admin'
    } as UserModel)
  })

  afterEach(() => {
    (UserModel.findOne as sinon.SinonStub).restore();
  })

  describe('Testa se', () => {
    it('retorna uma mensagem de erro se o email estiver ausente', async () => {
      await chai.request(app)
      .post('/login')
      .send({ password: 'p4$$w0rD' })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.eq('All fields must be filled');
      });
    });

    it('retorna uma mensagem de erro se a senha estiver ausente', async () => {
      await chai.request(app)
      .post('/login')
      .send({ email: 'user@example.com' })
      .then((res) => {
        expect(res).to.have.status(400);
        expect(res.body.message).to.be.eq('All fields must be filled');
      });
    });

      it('retorna uma mensagem de erro se o email for invalido', async () => {
        await chai.request(app)
        .post('/login')
        .send({ email: 'user.example.com', password: 'p4$$w0rD' })
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.be.eq('Invalid email or password');
        })
      })

      it('retorna uma mensagem de erro se a senha for invalida', async () => {
        await chai.request(app)
        .post('/login')
        .send({ email: 'user@example.com', password: '123' })
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.be.eq('Invalid email or password');
        })
      })

      it('retorna um token se os dados estiverem corretos', async () => {
        await chai.request(app)
        .post('/login')
        .send({ email: 'admin@admin.com', password: 'secret_admin' })
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res.body.token).to.be.an('string');
        });
      });
    });
  });
  
  describe('Testes do endpoint /login/role', () => {
    before(() => {
      sinon.stub(jwt, 'sign').resolves(token);
    });
    
    after(() => {
      (jwt.sign as sinon.SinonStub).restore();
    })
    describe('Testa se', () => {
      it('retorna uma mensagem de erro se não houver token', async () => {
        await chai.request(app)
        .get('/login/role')
        .then((res) => {
          expect(res).to.have.status(401);
          expect(res.body.message).to.be.eq('Token not found');
        });

        it('retorna uma mensagem de erro se o token for invalido', async () => {
          await chai.request(app)
          .get('/login/role')
          .set('Authorization', 'token23245234dsv')
          .then((res) => {
            expect(res).to.have.status(401);
            expect(res.body.message).to.be.eq('Token must be a valid token');
          });
        });

        it('retorna o tipo de usuario se o token for valido', async () => {
          await chai.request(app)
          .get('/login/role')
          .set('Authorization', token)
          .then((res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.eq({ role: 'admin' });
          });
        });
      });
    });
  });