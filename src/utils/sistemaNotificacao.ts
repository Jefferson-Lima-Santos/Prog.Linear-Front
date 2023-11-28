import { toast } from 'react-toastify'

const notify = (mensagem, tipo) => {
  if (tipo === 'success') {
    toast.success(mensagem, {
      autoClose: 1500
    })
  } else {
    toast.warn(mensagem, {
      autoClose: 1500
    })
  }
}

export default notify;