import './App.css'
import { NavLink } from 'react-router'
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
    setDefaultTitle("setDefaultTitle")
    setDefaultBody("setDefaultBody")

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
    <div>
      <h4>Create New Entry</h4>
      <form onSubmit={(evt) => createNewEntry(evt)}>
        <table>
          <tbody>
          <tr>
            <td><label htmlFor="title">Title</label></td>
            <td><input id="title" name="title" placeholder='Title' defaultValue={defaultTitle} required/></td>
          </tr>
          <tr>
            <td><label htmlFor="body">Body</label></td>
            <td><textarea id="body" name="body" placeholder='Body' defaultValue={defaultBody} required/></td>
          </tr>
          </tbody>
        </table>
        <input type="submit" value="Create Entry" />
      </form>
      <button onClick={() => {mockEntry()}}>Mock Blog</button>
    </div>
    <div>
      <h2>Latest Entries</h2>
      {entries.map((entry, index) => 
        <div key={"index_"+index}>
          <h3>{entry[BLOG_FIELDS.title]}</h3>
          {
            entry?.[BLOG_FIELDS.summary] ?
            <p>{entry?.[BLOG_FIELDS.summary]}</p> :
            <button onClick={() => getEntrySummary(entry[BLOG_FIELDS.id], index)}>Summarize</button>
          }
          <NavLink to={`/detail/${entry[BLOG_FIELDS.id]}`}> Go to article </NavLink>
          
        </div>
      )}
    </div>
  </>
}

export default App
