import { PROJECT_URL, API_KEY } from './secrets.js';

const banco_supabase = supabase.createClient(PROJECT_URL, API_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const tabelaAlimentacao = document.getElementById('tabelaAlimentacao').getElementsByTagName('tbody')[0];
  const tabelaMonitoramento = document.getElementById('tabelaMonitoramento').getElementsByTagName('tbody')[0];
  const btnLogout = document.getElementById('btnLogout');

  listarMonitoramentos(tabelaAlimentacao, tabelaMonitoramento);

  btnLogout.addEventListener('click', () => {
    localStorage.clear(); // Limpa o localStorage
    window.location.href = 'index.html'; // Redireciona para a página de login
  });
});

async function listarMonitoramentos(tabelaAlimentacao, tabelaMonitoramento) {
  const monitoramentos = await getMonitoramentos();
  if (monitoramentos && monitoramentos.length > 0) {
    // Ordenar os dados por semana e dia da semana
    const diasDaSemana = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
    monitoramentos.sort((a, b) => {
      if (a.semana !== b.semana) {
        return a.semana - b.semana;
      } else {
        return diasDaSemana.indexOf(a.dia_semana) - diasDaSemana.indexOf(b.dia_semana);
      }
    });

    monitoramentos.forEach(monitoramento => {
      const rowAlimentacao = tabelaAlimentacao.insertRow();
      rowAlimentacao.insertCell(0).textContent = formatarMes(monitoramento.mes);
      rowAlimentacao.insertCell(1).textContent = monitoramento.semana;
      rowAlimentacao.insertCell(2).textContent = monitoramento.dia_semana;
      rowAlimentacao.insertCell(3).textContent = monitoramento.cafe === 'SIM' ? '✔️' : '❌';
      rowAlimentacao.insertCell(4).textContent = monitoramento.colacao === 'SIM' ? '✔️' : '❌';
      rowAlimentacao.insertCell(5).textContent = monitoramento.almoco === 'SIM' ? '✔️' : '❌';
      rowAlimentacao.insertCell(6).textContent = monitoramento.lanche === 'SIM' ? '✔️' : '❌';
      rowAlimentacao.insertCell(7).textContent = monitoramento.jantar === 'SIM' ? '✔️' : '❌';
      rowAlimentacao.insertCell(8).textContent = monitoramento.ceia === 'SIM' ? '✔️' : '❌';
      rowAlimentacao.insertCell(9).textContent = monitoramento.refeicao_livre === 'SIM' ? '✔️' : '❌';

      const rowMonitoramento = tabelaMonitoramento.insertRow();
      rowMonitoramento.insertCell(0).textContent = formatarMes(monitoramento.mes);
      rowMonitoramento.insertCell(1).textContent = monitoramento.semana;
      rowMonitoramento.insertCell(2).textContent = monitoramento.dia_semana;
      rowMonitoramento.insertCell(3).textContent = monitoramento.atividade === 'SIM' ? '✔️' : '❌';
      rowMonitoramento.insertCell(4).textContent = monitoramento.hidratacao === 'SIM' ? '✔️' : '❌';
      rowMonitoramento.insertCell(5).textContent = monitoramento.intestino === 'SIM' ? '✔️' : '❌';
      rowMonitoramento.insertCell(6).textContent = monitoramento.descanso === 'SIM' ? '✔️' : '❌';
    });
  } else {
    console.error('Nenhum monitoramento encontrado.');
    const rowAlimentacao = tabelaAlimentacao.insertRow();
    const cellAlimentacao = rowAlimentacao.insertCell(0);
    cellAlimentacao.colSpan = 10;
    cellAlimentacao.textContent = 'Nenhum monitoramento encontrado.';

    const rowMonitoramento = tabelaMonitoramento.insertRow();
    const cellMonitoramento = rowMonitoramento.insertCell(0);
    cellMonitoramento.colSpan = 7;
    cellMonitoramento.textContent = 'Nenhum monitoramento encontrado.';
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
      .select('mes, semana, dia_semana, cafe, colacao, almoco, lanche, jantar, ceia, refeicao_livre, atividade, hidratacao, intestino, descanso')
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
