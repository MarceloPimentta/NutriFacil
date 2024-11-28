import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const clienteSelect = document.getElementById('clienteSelect');
  const tabelaMonitoramento = document.getElementById('tabelaMonitoramento').getElementsByTagName('tbody')[0];
  const btnConsultar = document.getElementById('consultarMonitoramento');
  const btnLogout = document.getElementById('btnLogout');

  carregarClientes(clienteSelect);

  btnConsultar.addEventListener('click', () => {
    const clienteID = clienteSelect.value;
    listarMonitoramentos(tabelaMonitoramento, clienteID);
  });

  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login
  });
});

async function carregarClientes(clienteSelect) {
  const clientes = await getClientes();
  if (clientes && clientes.length > 0) {
    clientes.forEach(cliente => {
      const option = document.createElement('option');
      option.value = cliente.ID;
      option.textContent = `${cliente.NOME} (${cliente.EMAIL})`;
      clienteSelect.appendChild(option);
    });
  } else {
    console.error('Nenhum cliente encontrado.');
  }
}

async function listarMonitoramentos(tabelaMonitoramento, clienteID) {
  const monitoramentos = await getMonitoramentos(clienteID);
  tabelaMonitoramento.innerHTML = ''; // Limpa a tabela antes de inserir novos dados
  if (monitoramentos && monitoramentos.length > 0) {
    monitoramentos.forEach(monitoramento => {
      const row = tabelaMonitoramento.insertRow();
      row.insertCell(0).textContent = formatarMes(monitoramento.mes);
      row.insertCell(1).textContent = monitoramento.semana;
      row.insertCell(2).textContent = monitoramento.dia_semana;
      row.insertCell(3).textContent = monitoramento.alimentacao;
      row.insertCell(4).textContent = monitoramento.atividade;
      row.insertCell(5).textContent = monitoramento.hidratacao;
      row.insertCell(6).textContent = monitoramento.intestino;
      row.insertCell(7).textContent = monitoramento.descanso;
    });
  } else {
    console.error('Nenhum monitoramento encontrado.');
    const row = tabelaMonitoramento.insertRow();
    const cell = row.insertCell(0);
    cell.colSpan = 8;
    cell.textContent = 'Nenhum monitoramento encontrado.';
  }
}

function formatarMes(mes) {
  const [ano, mesNumero] = mes.split('-');
  return `${mesNumero}/${ano}`;
}

async function getClientes() {
  try {
    const { data, error } = await banco_supabase
      .from('TBUsuarios')
      .select('ID, NOME, EMAIL')
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

async function getMonitoramentos(clienteID) {
  try {
    const { data, error } = await banco_supabase
      .from('tbmonitoramento')
      .select('mes, semana, dia_semana, alimentacao, atividade, hidratacao, intestino, descanso')
      .eq('idcliente', clienteID);

    if (error) {
      console.error('Erro ao listar monitoramentos:', error.message);
      return [];
    }
    return data;
  } catch (err) {
    console.error('Erro inesperado ao listar monitoramentos:', err);
    return [];
  }
}