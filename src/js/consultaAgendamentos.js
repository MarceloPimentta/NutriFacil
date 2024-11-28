import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const formPesquisaAgendamentos = document.getElementById('formPesquisaAgendamentos');
  const tabelaAgendamentos = document.getElementById('tabelaAgendamentos').getElementsByTagName('tbody')[0];
  const clienteSelect = document.getElementById('cliente');
  const nutricionistaSelect = document.getElementById('nutricionista');
  const btnLogout = document.getElementById('btnLogout');

  // Inicializa o Select2 no campo de seleção de clientes e nutricionistas
  $(clienteSelect).select2({
    placeholder: 'Selecione um cliente',
    allowClear: true
  });

  $(nutricionistaSelect).select2({
    placeholder: 'Selecione um nutricionista',
    allowClear: true
  });

  listarClientes(clienteSelect);
  listarNutricionistas(nutricionistaSelect);

  formPesquisaAgendamentos.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cliente = clienteSelect.value;
    const nutricionista = nutricionistaSelect.value;
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    const resultados = await pesquisarAgendamentos(cliente, nutricionista, data, hora);
    exibirResultados(resultados);
  });

  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login
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

async function listarNutricionistas(nutricionistaSelect) {
  const nutricionistas = await getNutricionistas();
  if (nutricionistas && nutricionistas.length > 0) {
    nutricionistas.forEach(nutricionista => {
      const option = new Option(nutricionista.NOME, nutricionista.ID, false, false);
      $(nutricionistaSelect).append(option).trigger('change');
    });
  } else {
    console.error('Nenhum nutricionista encontrado.');
  }
}

async function getNutricionistas() {
  try {
    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('ID, NOME')
      .eq('TIPOUSUARIO', 'A'); // Nutricionistas têm TIPOUSUARIO = 'A'

    if (error) {
      console.error('Erro ao listar nutricionistas:', error.message);
      return [];
    }
    return data;
  } catch (err) {
    console.error('Erro inesperado ao listar nutricionistas:', err);
    return [];
  }
}

async function pesquisarAgendamentos(cliente, nutricionista, data, hora) {
  try {
    let query = banco_supabase.from('tbagendamento').select(`
      idcliente, nomecliente,
      idnutricionista, nomenutricionista,
      data, hora, motivo
    `);

    if (cliente) {
      query = query.eq('idcliente', cliente);
    }

    if (nutricionista) {
      query = query.eq('idnutricionista', nutricionista);
    }

    if (data) {
      query = query.eq('data', data);
    }

    if (hora) {
      query = query.eq('hora', hora);
    }

    const { data: agendamentos, error } = await query;

    if (error) {
      console.error('Erro ao pesquisar agendamentos:', error.message);
      return [];
    }

    return agendamentos;
  } catch (err) {
    console.error('Erro inesperado ao pesquisar agendamentos:', err);
    return [];
  }
}

function exibirResultados(agendamentos) {
  const tabelaAgendamentos = document.getElementById('tabelaAgendamentos').getElementsByTagName('tbody')[0];
  tabelaAgendamentos.innerHTML = ''; // Limpar resultados anteriores

  if (agendamentos.length === 0) {
    const row = tabelaAgendamentos.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 5;
    cell.textContent = 'Nenhum agendamento encontrado.';
    return;
  }

  agendamentos.forEach(agendamento => {
    const row = tabelaAgendamentos.insertRow();
    row.insertCell(0).textContent = agendamento.nomecliente;
    row.insertCell(1).textContent = agendamento.nomenutricionista;
    row.insertCell(2).textContent = agendamento.data;
    row.insertCell(3).textContent = agendamento.hora;
    row.insertCell(4).textContent = agendamento.motivo;
  });
}
