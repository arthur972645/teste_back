import request from "supertest";
import app from "../app";
import { User } from "../models/User";
//O supertest  vai permitri testar em um servidor externo

//TESTE DE ROTAS DE API
describe("Testando rotas da API", () => {
  //caixa grande que dentro dessa caixa tem caixas menores, que no caso são os testes
  let email = "test@jest.com";
  let password = "1234";


   //faz a sincronização entre a estrutura do model e o que está no banco de dados
  //se não existir, ele cria, se existir o "force", faz com que ele delete, e cria uma nova
  beforeAll(async () => {
    await User.sync({ force: true });
  });

  // it("Deve ping pong", (done) => {
  //   request(app)
  //     .get("/ping") //Usa o supertest para enviar uma requisição GET para a rota /ping da aplicação Express.
  //     .then((response) => {
  //       expect(response.body.pong).toBeTruthy();//Verifica se a resposta contém uma propriedade pong que é verdadeira. Isso significa que a API deve retornar algo como { "pong": true } para que o teste passe.
  //       //O toBeTreuthy() verifica se o valor da propriedade "pong" é verdadeiro. ou qualquer outro valor seja verdadeiro verdadeiro
  //       return done();
  //     });
  // });

  it("deve registrar um novo usuario", (done) => {
    request(app)
      .post("/register")
      .send(`email=${email}&password=${password}`)
      .then((response) => {
        expect(response.body.error).toBeUndefined();
        done()
      });
  });


  it("Não deve registrar um usuário sem a senha", (done) => {
    request(app)
      .post("/register")
      .send(`email=${email}`)
      .then((response) => {
        expect(response.body.error).not.toBeUndefined();
        expect(response.body.error).toBe("E-mail e/ou senha não enviados."); 
        done();
      })
  });

  it("Não deve registrar um usuário sem o email",(done) => {
    request(app)
      .post("/register")
      .send(`password=${password}`)
      .then((response) => {
        expect(response.body.error).toBeDefined();
        done()
        
      })
  })

  it("Não deve registrar um usuário sem os dados", (done) => {
    request(app)
      .post("/register")
      .send({})
      .then((response) => {
        expect(response.body.error).toBeDefined();
        done()
      })
  })

  it("Deve logar corretamente", (done) => {
    request(app)
      .post("/login")
      .send(`email=${email}&password=${password}`)
      .then((response) => {
        expect(response.body.error).toBeUndefined();
        expect(response.body.status).toBe(true); 
        done();
      })

  });
});

