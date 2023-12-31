import { useRouter } from 'next/router'
import useSWR from 'swr'
import Form from '../../../components/EventForm'

const fetcher = (url: string) =>
  fetch(url)
    .then((res) => res.json())
    .then((json) => json.data)

const EditEvent = () => {
  const router = useRouter()
  const { id } = router.query
  const {
    data: event,
    error,
    isLoading,
  } = useSWR(id ? `/api/events/${id}` : null, fetcher)

  if (error) return <p>Failed to load</p>
  if (isLoading) return <p>Loading...</p>
  if (!event) return null

  const eventForm = {
    name: event.name,
    owner_name: event.owner_name,
    start_date: event.start_date,
    end_date: event.end_date,
    image_url: event.image_url,
    url: event.url,
  }

  return <Form formId="edit-event-form" eventForm={eventForm} forNewEvent={false} />
}

export default EditEvent
