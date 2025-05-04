import { toast } from 'react-toastify';

class HttpClient {

  api = 'http://127.0.0.1:8000'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  simpleRequest (path: string, params: any = {}) {
    const url = `${this.api}/${path}`;
    console.log({ path, params })
    return fetch(url, { mode: 'cors', ...params})
    .then(response => { 

      if (response.ok) return response.json();

      throw response;

    })
    .catch(async response => {
      const data = await response.json()
      console.log({ data })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = data?.detail.map(({ msg }: any) => msg).join(', ')
      toast(error)
      
    })
  }

}

export default new HttpClient()