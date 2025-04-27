import { useParams, NavLink } from "react-router";
import { BLOG_FIELDS } from "./constants";

import './App.css'
import { useState, useEffect } from "react";

function Detail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entry, setEntry]: any = useState([])
  const params = useParams();

  const [updatingBody, setUpdatingBody] = useState(false)
  const [updatingTitle, setUpdatingTitle] = useState(false)

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/blogs/${params.entryId}`, { mode: 'cors', })
    .then(response => response.json())
    .then(response => setEntry(response.data[0]))
  }, [params.entryId, setEntry]);

  const updateField = (field: 'title' | 'body', newValue: string, stateToggle: (bool: boolean) => void ) => {
    const payload = { [field]: newValue };
    console.log({ payload })
    fetch(`http://127.0.0.1:8000/blogs/${params.entryId}`,
      {
        mode: 'cors',
        method: 'put',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    .then(response => response.json())
    .then(response => {
      setEntry(response.data[0])
      stateToggle(false)
    })
  }

  return (
    <>
      <div>
        <NavLink to="/">Go Back</NavLink>
      </div>
      {
        updatingTitle ?
        <input onBlur={(evt) => updateField('title', evt.target.value, setUpdatingTitle)} defaultValue={entry[BLOG_FIELDS.title]}/> :
        <h2 onClick={() => setUpdatingTitle(true)}>{entry[BLOG_FIELDS.title]}</h2>
      }
      {

        updatingBody ?
        <input onBlur={(evt) => updateField('body', evt.target.value, setUpdatingBody)} defaultValue={entry[BLOG_FIELDS.body]}/> :
        <p onClick={() => setUpdatingBody(true)}>{entry[BLOG_FIELDS.body]}</p>
      }
      <small>{new Date(entry[BLOG_FIELDS.timestamp]).toLocaleString()} </small>
      
    </>
  )
}

export default Detail
