import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formEditarCadastro = document.getElementById('formEditarCadastro');
  const btnVoltarCliente = document.getElementById('btnVoltarCliente');
  const btnLogout = document.getElementById('btnLogout');

  formEditarCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const cpf = document.getElementById('cpf').value;
    const telefone = document.getElementById('telefone').value;
    const senha = document.getElementById('senha').value;
    const IDUsuario = localStorage.getItem('IDUsuario');

    if (!IDUsuario) {
      alert('ID do usuário não encontrado. Faça login novamente.');
      window.location.href = 'index.html';
      return;
    }

    const { error } = await banco_supabase
      .from('TBUsuarios')
      .update({
        NOME: nome,
        EMAIL: email,
        CPF: cpf,
        TELEFONE: telefone,
        SENHA: senha
      })
      .eq('ID', IDUsuario);

    if (error) {
      console.error('Erro ao atualizar cadastro:', error.message);
    } else {
      alert('Cadastro atualizado com sucesso!');
      // Atualizar o nome do cliente no localStorage
      localStorage.setItem('nomeUsuario', nome);
    }
  });

  carregarDadosDoLocalStorage();

  btnVoltarCliente.addEventListener('click', () => {
    // Atualizar o nome do cliente no localStorage
    const nome = document.getElementById('nome').value;
    localStorage.setItem('nomeUsuario', nome);
    window.location.href = 'cliente.html';
  });

  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login
  });
});

function carregarDadosDoLocalStorage() {
  const nome = localStorage.getItem('clienteNome');
  const email = localStorage.getItem('clienteEmail');
  const cpf = localStorage.getItem('clienteCpf');
  const telefone = localStorage.getItem('clienteTelefone');
  const senha = localStorage.getItem('clienteSenha');

  document.getElementById('nome').value = nome;
  document.getElementById('email').value = email;
  document.getElementById('cpf').value = cpf;
  document.getElementById('telefone').value = telefone;
  document.getElementById('senha').value = senha;
}