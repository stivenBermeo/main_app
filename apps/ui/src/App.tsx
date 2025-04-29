import './App.css'
import { Link, NavLink } from 'react-router'
import { BLOG_FIELDS } from './constants';
import { useEffect, useState } from 'react';

function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entries, setEntries] : [any[], any] = useState([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [defaultTitle, setDefaultTitle] : [any[], any] = useState([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [defaultBody, setDefaultBody] : [any[], any] = useState([])
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/blogs`, {
      mode: 'cors',
    })
    .then(response => response.json())
    .then(response => {
      console.log({ response })
      setEntries(response.data)
    })
  }, [])


  const getEntrySummary = (entryId: number, entryIndex: number) => {
    fetch(`http://127.0.0.1:8000/summarize/${entryId}`, {
      mode: 'cors',
    })
      .then(response => response.json())
      .then(response => {
        setEntries(
          (entries: string[]) => entries.map((entry, index) => index === entryIndex ? [...entry, response.data] : entry)
        )
      })
    
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createNewEntry = (evt: any) => {
    evt.preventDefault();
    const [titleElement, bodyElement] = evt.target;
    const payload = {
      title: titleElement.value,
      body: bodyElement.value,
    }
    console.log({ payload })
    fetch(`http://127.0.0.1:8000/blogs`, {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {'Content-Type': 'application/json'},
      mode: 'cors',
    })
    .then(response => response.json())
    .then(response => {
      console.log({ response })
      setEntries(response.data)
    })
  }

  const mockEntry = () => {
    fetch(`http://127.0.0.1:8000/blogs/mock`, {
      mode: 'cors',
    })
      .then(response => response.json())
      .then(response => {
        setDefaultTitle(response.data.title)
        setDefaultBody(response.data.body)
      })
  }

  return <>
    <div className='container-fluid vh-100 py-5'>
      <h1 className='text-center'>Journal</h1>
      <div className='d-flex h-100'>
        <div className='col-md-6 d-inline-block px-3 border border-danger'>
          <h2>Create New Entry</h2>
          <form onSubmit={(evt) => createNewEntry(evt)}>
            <div className='my-3'>
              <input className="form-control" id="title" name="title" placeholder="Title" defaultValue={defaultTitle} required/>
            </div>
            <div className='my-3'>
              <textarea className="form-control" id="body" name="body" placeholder='Body' defaultValue={defaultBody} required/>
            </div>
            <div className='d-flex'>
              <div className="btn btn-secondary mx-auto" onClick={() => {mockEntry()}}>Mock Entry With AI</div>
              <button className='btn btn-primary mx-auto'>Create Entry</button>
            </div>
          </form>
        </div>
        <div className='col-md-6 d-inline-block px-3 overflow-scroll border border-danger'>
          <h2>Latest Entries</h2>
          {entries.map((entry, index) => 
            <div key={"index_"+index} className='my-5 shadow-sm p-2'>
              <div className='d-flex'>
                <div className='d-inline-block '>
                  <Link className='text-decoration-none' to={`/detail/${entry[BLOG_FIELDS.id]}`}>
                    <h3>{entry[BLOG_FIELDS.title]}</h3>
                  </Link>
                </div>
                <div className='d-inline-block mx-auto'>
                  {!entry?.[BLOG_FIELDS.summary] && <button className="btn btn-secondary" onClick={() => getEntrySummary(entry[BLOG_FIELDS.id], index)}>Summarize</button>}
                </div>
              </div>
              {
                entry?.[BLOG_FIELDS.summary] &&
                <p>{entry?.[BLOG_FIELDS.summary]}</p>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  </> 
}

export default App
