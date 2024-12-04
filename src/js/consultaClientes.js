import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formPesquisaClientes = document.getElementById('formPesquisaClientes');
  const tabelaClientes = document.getElementById('tabelaClientes').getElementsByTagName('tbody')[0];
  const clienteSelect = document.getElementById('cliente');
  const generoSelect = document.getElementById('genero');
  const bairroInput = document.getElementById('bairro');
  const cidadeInput = document.getElementById('cidade');
  const telefoneInput = document.getElementById('telefone');

  // Inicializa o Select2 no campo de seleção de clientes
  $(clienteSelect).select2({
    placeholder: 'Selecione um cliente',
    allowClear: true
  });

  listarClientes(clienteSelect);

  formPesquisaClientes.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cliente = clienteSelect.value;
    const genero = generoSelect.value;
    const bairro = bairroInput.value.trim();
    const cidade = cidadeInput.value.trim();
    const telefone = telefoneInput.value.trim();

    const resultados = await pesquisarClientes(cliente, genero, bairro, cidade, telefone);
    exibirResultados(resultados);
  });
});

async function listarClientes(clienteSelect) {
  const clientes = await getClientes();
  if (clientes && clientes.length > 0) {
    clientes.forEach(cliente => {
      const option = new Option(cliente.NOME, cliente.ID, false, false);
      $(clienteSelect).append(option).trigger('change');
    });
  } else {
    console.error('Nenhum cliente encontrado.');
  }
}

async function getClientes() {
  try {
    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('ID, NOME')
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

async function pesquisarClientes(cliente, genero, bairro, cidade, telefone) {
  try {
    let query = banco_supabase.from('TBUsuarios').select('NOME, EMAIL, CPF, TELEFONE, GENERO, LOGRADOURO, NUMERO, BAIRRO, CIDADE, UF, CEP')
      .eq('TIPOUSUARIO', 'C'); // Clientes têm TIPOUSUARIO = 'C'

    if (cliente) {
      query = query.eq('ID', cliente);
    }

    if (genero) {
      query = query.eq('GENERO', genero);
    }

    if (bairro) {
      query = query.ilike('BAIRRO', `%${bairro}%`);
    }

    if (cidade) {
      query = query.ilike('CIDADE', `%${cidade}%`);
    }

    if (telefone) {
      query = query.ilike('TELEFONE', `%${telefone}%`);
    }

    const { data: clientes, error } = await query;

    if (error) {
      console.error('Erro ao pesquisar clientes:', error.message);
      return [];
    }

    return clientes;
  } catch (err) {
    console.error('Erro inesperado ao pesquisar clientes:', err);
    return [];
  }
}

function exibirResultados(clientes) {
  const tabelaClientes = document.getElementById('tabelaClientes').getElementsByTagName('tbody')[0];
  tabelaClientes.innerHTML = ''; // Limpar resultados anteriores

  if (clientes.length === 0) {
    const row = tabelaClientes.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 11;
    cell.textContent = 'Nenhum cliente encontrado.';
    return;
  }

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
}