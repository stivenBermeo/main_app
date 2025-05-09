import './App.css'
import HttpClient from './utils/HttpClient';
import { Entry } from './constants';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';


function App() {
  const [entries, setEntries] : [Entry[], Dispatch<SetStateAction<Entry[]>>] = useState([] as Entry[])
  const [entry, setEntry]: [Entry|null, Dispatch<SetStateAction<Entry|null>>] = useState(null as Entry|null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [defaultTitle, setDefaultTitle] : [any[], any] = useState([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [defaultBody, setDefaultBody] : [any[], any] = useState([])
  const [updatingBody, setUpdatingBody] = useState(false)
  const [updatingTitle, setUpdatingTitle] = useState(false)

  useEffect(() => {
    HttpClient.simpleRequest('blogs')
      .then(response => {
        setEntries(response.data)
      })
  }, [])

  const fetchEntry = (entryId: number) => {
    HttpClient.simpleRequest(`blogs/${entryId}`)
      .then(response => setEntry(response.data[0]))
  }

  const getEntrySummary = (entryId: number, entryIndex: number) => {
    HttpClient.simpleRequest(`summarize/${entryId}`)
    .then(response => {
      setEntries(
        (entries: Entry[]) => entries.map((entry, index) => index === entryIndex ? { ...entry, summary: response.data } : entry)
      )
    })
  }

  const updateField = (field: 'title' | 'body', newValue: string, stateToggle: (bool: boolean) => void ) => {
      const payload = { [field]: newValue };
      
      if (entry)
        HttpClient.simpleRequest(`blogs/${entry.id}`, {
          method: 'put',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (response) {
            setEntry(response.data[0])
            stateToggle(false)
          }
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
    HttpClient.simpleRequest('blogs', {
      method: 'post',
      body: JSON.stringify(payload),
      headers: {'Content-Type': 'application/json'},
    })
    .then(response => {
      setEntries(response.data)
    })
  }

  const mockEntry = () => {
    HttpClient.simpleRequest('blogs/mock')
      .then(response => {
        setDefaultTitle(response.data.title)
        setDefaultBody(response.data.body)
      })
  }

  return <>
    <div className='container-fluid vh-100 py-1'>
      <h1 className='text-center py-1'>Journal</h1>
      <div className='d-flex h-90'>
        <div className='col-md-6 d-inline-block px-3 border border-danger'>
          <div className='px-3 h-50 border border-danger'>
            <h2>Create New Entry</h2>
            <h5 className="btn text-primary mx-auto" onClick={() => {mockEntry()}}>Or Mock Entry With AI!</h5>
            <form onSubmit={(evt) => createNewEntry(evt)}>
              <div className='my-3'>
                <input className="form-control" id="title" name="title" placeholder="Title" defaultValue={defaultTitle} required/>
              </div>
              <div className='my-3'>
                <textarea className="form-control" id="body" name="body" placeholder='Body' defaultValue={defaultBody} required/>
              </div>
              <div className='d-flex'>
                <button className='btn btn-primary mx-auto'>Create Entry</button>
              </div>
            </form>
          </div>
          <div className='px-3 h-50 overflow-scroll border border-danger'>
            {!entry && <div className="btn btn-primary col-lg-12 text-center">Click an entry to see details here ! -{'>'}</div>}
            {entry && (<div>
              {
                updatingTitle ?
                <input className="form-control" onBlur={(evt) => updateField('title', evt.target.value, setUpdatingTitle)} defaultValue={entry.title}/> :
                <h2 onClick={() => setUpdatingTitle(true)}>{entry.title}</h2>
              }
              {
        
                updatingBody ?
                <input className="form-control"onBlur={(evt) => updateField('body', evt.target.value, setUpdatingBody)} defaultValue={entry.body}/> :
                <p onClick={() => setUpdatingBody(true)}>{entry.body}</p>
              }
              <small>{new Date(entry.created_at).toLocaleString()} </small>
              </div>
            )}
          </div>
          
        </div>
        <div className='col-md-6 d-inline-block px-3 overflow-scroll border border-danger'>
          <h2>Latest Entries</h2>
          {entries.map((entryItem, index) => 
            <div key={"index_"+index} className='my-1 shadow-sm p-2 btn btn-light w-100'>
              <div className='d-flex justify-content-between'>
                <div className='d-inline-block text-start'>
                  <h4 onClick={()=>{fetchEntry(entryItem.id)}}>{entryItem.title}</h4>
                </div>
                <div className='d-inline-block'>
                  {!entryItem?.summary && <button className="btn btn-small btn-primary" onClick={() => getEntrySummary(entryItem.id, index)}>Summarize</button>}
                </div>
              </div>
              {
                entryItem?.summary &&
                <p>{entryItem?.summary}</p>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  </> 
}

export default App
