import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const tabelaClientes = document.getElementById('tabelaClientes').getElementsByTagName('tbody')[0];
  const btnLogout = document.getElementById('btnLogout');

  listarClientes(tabelaClientes);

  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login
  });
});

async function listarClientes(tabelaClientes) {
  const clientes = await getClientes();
  if (clientes && clientes.length > 0) {
    clientes.forEach(cliente => {
      const row = tabelaClientes.insertRow();
      row.insertCell(0).textContent = cliente.NOME;
      row.insertCell(1).textContent = cliente.EMAIL;
      row.insertCell(2).textContent = cliente.CPF;
      row.insertCell(3).textContent = cliente.TELEFONE;
      row.insertCell(4).textContent = cliente.GENERO;
      row.insertCell(5).textContent = cliente.LOGRADOURO;
      row.insertCell(6).textContent = cliente.NUMERO;
      row.insertCell(7).textContent = cliente.BAIRRO;
      row.insertCell(8).textContent = cliente.CIDADE;
      row.insertCell(9).textContent = cliente.UF;
      row.insertCell(10).textContent = cliente.CEP;
    });
  } else {
    console.error('Nenhum cliente encontrado.');
    const row = tabelaClientes.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 11;
    cell.textContent = 'Nenhum cliente encontrado.';
  }
}

async function getClientes() {
  try {
    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('NOME, EMAIL, CPF, TELEFONE, GENERO, LOGRADOURO, NUMERO, BAIRRO, CIDADE, UF, CEP')
      .eq('TIPOUSUARIO', 'C'); // Clientes têm TIPOUSUARIO = 'C'

    if (error) {
      console.error('Erro ao listar clientes:', error.message);
      return [];
    }
    return data;
  } catch (err) {
    console.error('Erro inesperado ao listar clientes:', err);
    return [];
  }
}