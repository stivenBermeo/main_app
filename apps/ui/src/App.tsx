import './App.css'
import HttpClient from './utils/HttpClient';
import { BLOG_FIELDS } from './constants';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';


function App() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entries, setEntries] : [any[], Dispatch<SetStateAction<any[]>>] = useState([] as any[])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entry, setEntry]: [any[]|null, Dispatch<SetStateAction<any[]|null>>] = useState(null as any[]|null)
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
        (entries: string[]) => entries.map((entry, index) => index === entryIndex ? [...entry, response.data] : entry)
      )
    })
  }

  const updateField = (field: 'title' | 'body', newValue: string, stateToggle: (bool: boolean) => void ) => {
      const payload = { [field]: newValue };
      
      if (entry)
        HttpClient.simpleRequest(`blogs/${entry[BLOG_FIELDS.id]}`, {
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
      <h1 className='text-center'>Journal</h1>
      <div className='d-flex h-90'>
        <div className='col-md-6 d-inline-block px-3 border border-danger'>
          <div className='px-3 h-50 border border-danger'>
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
          <div className='px-3 h-50 overflow-scroll border border-danger'>
            {!entry && "No entry selected"}
            {entry && (<div>
              {
                updatingTitle ?
                <input className="form-control" onBlur={(evt) => updateField('title', evt.target.value, setUpdatingTitle)} defaultValue={entry[BLOG_FIELDS.title]}/> :
                <h2 onClick={() => setUpdatingTitle(true)}>{entry[BLOG_FIELDS.title]}</h2>
              }
              {
        
                updatingBody ?
                <input className="form-control"onBlur={(evt) => updateField('body', evt.target.value, setUpdatingBody)} defaultValue={entry[BLOG_FIELDS.body]}/> :
                <p onClick={() => setUpdatingBody(true)}>{entry[BLOG_FIELDS.body]}</p>
              }
              <small>{new Date(entry[BLOG_FIELDS.timestamp]).toLocaleString()} </small>
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
                  <h4 onClick={()=>{fetchEntry(entryItem[BLOG_FIELDS.id])}}>{entryItem[BLOG_FIELDS.title]}</h4>
                </div>
                <div className='d-inline-block'>
                  {!entryItem?.[BLOG_FIELDS.summary] && <button className="btn btn-secondary" onClick={() => getEntrySummary(entryItem[BLOG_FIELDS.id], index)}>Summarize</button>}
                </div>
              </div>
              {
                entryItem?.[BLOG_FIELDS.summary] &&
                <p>{entryItem?.[BLOG_FIELDS.summary]}</p>
              }
            </div>
          )}
        </div>
      </div>
    </div>
  </> 
}

export default App
