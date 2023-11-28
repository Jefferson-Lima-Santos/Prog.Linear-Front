export default async function getIdealVacation (
  maxFunc: number,
  minFunc: number,
  folgasPreferidas: number[][] = [],
  tipo: string
) {
  try {
    const response = await fetch('http://127.0.0.1:5000/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        numFuncionarios: maxFunc,
        minFuncionarios: minFunc,
        tipo: tipo,
        folgasPreferenciais: folgasPreferidas
      })
    })
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    const result = await response.json()
    return result
  } catch (error) {
    return false
  }
}
