import { useState } from 'react'
import { useRouter } from 'next/router'
import { mutate } from 'swr'

interface FormData {
  name: string
  url: string
  owner_name: string
  start_date: string
  end_date: string
  image_url: string
}

interface Error {
  name?: string
  owner_name?: string
  start_date?: string
  end_date?: string
  url?: string
  image_url?: string
}

type Props = {
  formId: string
  eventForm: FormData
  forNewEvent?: boolean
}

const EventForm = ({ formId, eventForm, forNewEvent = true }: Props) => {
  const router = useRouter()
  const contentType = 'application/json'
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState('')

  const [form, setForm] = useState({
    name: eventForm.name,
    owner_name: eventForm.owner_name,
    url: eventForm.url,
    image_url: eventForm.image_url,
    start_date: eventForm.start_date,
    end_date: eventForm.end_date,
  })

  /* The PUT method edits an existing entry in the mongodb database. */
  const putData = async (form: FormData) => {
    const { id } = router.query

    try {
      const res = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString())
      }

      const { data } = await res.json()

      mutate(`/api/events/${id}`, data, false) // Update the local data without a revalidation
      router.push('/events')
    } catch (error) {
      setMessage('Failed to update pet')
    }
  }

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (form: FormData) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(form),
      })

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status.toString())
      }

      router.push('/')
    } catch (error) {
      setMessage('Failed to add event')
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const target = e.target
    const value =
      target.name === 'poddy_trained'
        ? (target as HTMLInputElement).checked
        : target.value
    const name = target.name

    setForm({
      ...form,
      [name]: value,
    })
  }

  /* Makes sure pet info is filled for pet name, owner name, species, and image url*/
  const formValidate = () => {
    let err: Error = {}
    if (!form.name) err.name = 'Name is required'
    if (!form.owner_name) err.owner_name = 'Owner is required'
    if (!form.start_date) err.start_date = 'Start date is required'
    if (!form.end_date) err.end_date = 'End date is required'
    if (!form.url) err.url = 'Event URL is required'
    if (!form.image_url) err.image_url = 'Image URL is required'
    return err
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const errs = formValidate()

    if (Object.keys(errs).length === 0) {
      forNewEvent ? postData(form) : putData(form)
    } else {
      setErrors({ errs })
    }
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          maxLength={20}
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="owner_name">Owner</label>
        <input
          type="text"
          maxLength={20}
          name="owner_name"
          value={form.owner_name}
          onChange={handleChange}
          required
        />

        <label htmlFor="start_date">Start Date</label>
        <input
          type="date"
          name="start_date"
          value={form.start_date}
          onChange={handleChange}
          required
        />

        <label htmlFor="end_date">End Date</label>
        <input
          type="date"
          name="end_date"
          value={form.end_date}
          onChange={handleChange}
        />

      <label htmlFor="url">URL</label>
        <input
          type="text"
          name="url"
          value={form.url}
          onChange={handleChange}
          required
        />

        <label htmlFor="image_url">Image URL</label>
        <input
          type="url"
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn">
          Submit
        </button>
      </form>
      <p>{message}</p>
      <div>
        {Object.keys(errors).map((err, index) => (
          <li key={index}>{err}</li>
        ))}
      </div>
    </>
  )
}

export default EventForm
