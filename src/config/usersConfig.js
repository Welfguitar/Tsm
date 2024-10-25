// src/config/usersConfig.js
const usersConfig = {
  '12345678900': { // Exemplo de CPF
    name: 'João da Silva',
    privileges: ['driver'],
  },
  '98765432100': { // Outro exemplo de CPF
    name: 'Maria Oliveira',
    privileges: ['operational'],
  },
  '15412619762': { // Outro exemplo de CPF
    name: 'Welington',
    privileges: ['driver', 'operational', 'admin'],
  },// Adicione mais CPFs e configurações conforme necessário
};

export default usersConfig;
