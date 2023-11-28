import notify from './sistemaNotificacao.ts'
import getIdealVacation from '../services/getIdealVacation.ts'

const uploadFile = async (event: any, tipo: string) => {
  return new Promise(async (resolve, reject) => {
    debugger;
    const file = event.target.files[0];
    if(file == undefined)
      return;
    const extension = file.name.split('.').pop().toLowerCase();

    if (extension !== 'txt') {
      notify('Formato de arquivo inválido! Apenas arquivos TXT e JSON são permitidos.', 'error');
      reject('Formato de arquivo inválido');
      return;
    }

    const reader = new FileReader();

    let maxFunc: number = 0;
    let minFunc: number = 0;
    let folgasPreferidas: number[][] = [];

    reader.onload = async (event) => {
      if (!event.target) {
        notify('Erro ao ler arquivo', 'error');
        reject('Erro ao ler arquivo');
        return;
      }

      const content = event.target.result as string;
      const lines = content.split('\n');

      if (lines.length >= 2) {
        maxFunc = parseInt(lines[0].trim(), 10);
        minFunc = parseInt(lines[1].trim(), 10);
      }

      if (lines.length >= maxFunc + 2) {
        for (let i = 2; i < maxFunc + 2; i++) {
          const line = lines[i].trim();
          const choosedDate = line.split(' ');
          const folgaPreferida = choosedDate.map((date) => parseInt(date, 10));

          folgasPreferidas.push(folgaPreferida);
        }
      }

      try {
        const result = await getIdealVacation(maxFunc, minFunc, folgasPreferidas, tipo);
        resolve(result);
      } catch (error) {
        notify('Erro ao carregar arquivo não mapeado!', 'error');
        reject('Erro ao carregar arquivo não mapeado');
      }
    };

    reader.readAsText(file);
  });
}

export default uploadFile
