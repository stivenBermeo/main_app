import { useParams, NavLink } from "react-router";
import { BLOG_FIELDS } from "./constants";
import HttpClient from "./utils/HttpClient"
import './App.css'
import { useState, useEffect } from "react";

function Detail() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [entry, setEntry]: any = useState([])
  const params = useParams();

  const [updatingBody, setUpdatingBody] = useState(false)
  const [updatingTitle, setUpdatingTitle] = useState(false)

  useEffect(() => {
    HttpClient.simpleRequest(`blogs/${params.entryId}`)
    .then(response => setEntry(response.data[0]))
  }, [params.entryId, setEntry]);

  const updateField = (field: 'title' | 'body', newValue: string, stateToggle: (bool: boolean) => void ) => {
    const payload = { [field]: newValue };
    
    HttpClient.simpleRequest(`blogs/${params.entryId}`, {
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

  return (
    <div className="container py-5">
      <div>
        <NavLink to="/">Go Back</NavLink>
      </div>
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
  )
}

export default Detail
