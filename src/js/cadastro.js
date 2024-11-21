import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formCadastro = document.getElementById('formCadastro');
  const email_usuario_input = document.getElementById('EMAIL');
  const nome_verificacao = document.getElementById('email_verificacao');

  if (email_usuario_input) {
    email_usuario_input.addEventListener('input', async () => {
      const email_usuario = email_usuario_input.value;

      const existe = await verificarEmailUsuario(email_usuario);
      if (existe) {
        nome_verificacao.textContent = `O e-mail ${email_usuario} já está presente no banco de dados.`;
        nome_verificacao.style.color = 'red';
      } else {
        nome_verificacao.textContent = `O e-mail ${email_usuario} está disponível.`;
        nome_verificacao.style.color = 'green';
      }
    });
  }

  if (formCadastro) {
    formCadastro.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nome = document.getElementById('NOME').value;
      const cpf = document.getElementById('CPF').value;
      const email = document.getElementById('EMAIL').value;
      const genero = document.getElementById('GENERO').value;
      const senha = document.getElementById('SENHA').value;
      const telefone = document.getElementById('TELEFONE').value;
      const tipo_usuario = document.getElementById('TIPOUSUARIO').value;

      const cep = document.getElementById('CEP').value;
      const logradouro = document.getElementById('LOGRADOURO').value;
      const numero = document.getElementById('NUMERO').value;
      const bairro = document.getElementById('BAIRRO').value;
      const cidade = document.getElementById('CIDADE').value;
      const uf = document.getElementById('UF').value;

      const sucesso = await inserirUsuario(nome, cpf, email, genero, senha, telefone, tipo_usuario, cep, logradouro, numero, bairro, cidade, uf);

      if (sucesso) {
        window.location.href = 'admin.html'; // Redireciona para a tela de ADMIN após o cadastro
      }
    });
  }

  const formEditarCadastro = document.getElementById('formEditarCadastro');
  const btnVoltarCliente = document.getElementById('btnVoltarCliente');
  const btnLogout = document.getElementById('btnLogout');

  if (formEditarCadastro) {
    formEditarCadastro.addEventListener('submit', async (event) => {
      event.preventDefault();

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const genero = document.getElementById('genero').value;
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
          GENERO: genero,
          CPF: cpf,
          TELEFONE: telefone,
          SENHA: senha
        })
        .eq('ID', IDUsuario);

      if (error) {
        console.error('Erro ao atualizar cadastro:', error.message);
      } else {
        alert('Cadastro atualizado com sucesso!');
        localStorage.setItem('nomeUsuario', nome);
      }
    });

    carregarDadosDoLocalStorage();
  }

  if (btnVoltarCliente) {
    btnVoltarCliente.addEventListener('click', () => {
      const nome = document.getElementById('nome').value;
      localStorage.setItem('nomeUsuario', nome);
      window.location.href = 'cliente.html';
    });
  }

  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = 'index.html';
    });
  }
});

async function inserirUsuario(nome, cpf, email, genero, senha, telefone, tipo_usuario, cep, logradouro, numero, bairro, cidade, uf) {
  try {
    const { error } = await banco_supabase
      .from('TBUsuarios')
      .insert({ NOME: nome, CPF: cpf, EMAIL: email, GENERO: genero, SENHA: senha, TELEFONE: telefone, TIPOUSUARIO: tipo_usuario, CEP: cep, LOGRADOURO: logradouro, NUMERO: numero, BAIRRO: bairro, CIDADE: cidade, UF: uf });
    if (error) {
      console.error('Erro ao inserir dados:', error.message);
      alert('Erro ao inserir usuário. Por favor, tente novamente.');
      return false;
    } else {
      alert('Usuário inserido com sucesso!');
      return true;
    }
  } catch (err) {
    console.error('Erro inesperado:', err);
    alert('Erro inesperado. Por favor, tente novamente.');
    return false;
  }
}

async function verificarEmailUsuario(EMAIL) {
  try {
    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('EMAIL')
      .eq('EMAIL', EMAIL);

    if (error) {
      console.error('Erro ao verificar e-mail:', error.message);
      return false;
    }

    return data.length > 0;
  } catch (err) {
    console.error('Erro inesperado:', err);
    return false;
  }
}

function carregarDadosDoLocalStorage() {
  const nome = localStorage.getItem('clienteNome');
  const email = localStorage.getItem('clienteEmail');
  const cpf = localStorage.getItem('clienteCpf');
  const telefone = localStorage.getItem('clienteTelefone');
  const senha = localStorage.getItem('clienteSenha');
  const genero = localStorage.getItem('clienteGenero');

  document.getElementById('nome').value = nome;
  document.getElementById('email').value = email;
  document.getElementById('genero').value = genero;
  document.getElementById('cpf').value = cpf;
  document.getElementById('telefone').value = telefone;
  document.getElementById('senha').value = senha;
}