import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const tabelaMonitoramento = document.getElementById('tabelaMonitoramento').getElementsByTagName('tbody')[0];
  const btnLogout = document.getElementById('btnLogout');

  listarMonitoramentos(tabelaMonitoramento);

  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login
  });
});

async function listarMonitoramentos(tabelaMonitoramento) {
  const monitoramentos = await getMonitoramentos();
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

async function getMonitoramentos() {
  try {
    const IDUsuario = localStorage.getItem('IDUsuario');
    if (!IDUsuario) {
      console.error('ID do usuário não encontrado no localStorage.');
      return [];
    }

    const { data, error } = await banco_supabase
      .from('tbmonitoramento')
      .select('mes, semana, dia_semana, alimentacao, atividade, hidratacao, intestino, descanso')
      .eq('idcliente', IDUsuario);

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