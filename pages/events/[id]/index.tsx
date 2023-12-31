import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import dbConnect from '../../../lib/dbConnect'
import Event, { Events } from '../../../models/Event'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { ParsedUrlQuery } from 'querystring'

interface Params extends ParsedUrlQuery {
  id: string
}

type Props = {
  event: Events
}

/* Allows you to view event card info and delete event card*/
const EventPage = ({ event }: Props) => {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const handleDelete = async () => {
    const petID = router.query.id

    try {
      await fetch(`/api/events/${petID}`, {
        method: 'Delete',
      })
      router.push('/events')
    } catch (error) {
      setMessage('Failed to delete the event.')
    }
  }

  return (
    <div key={event._id}>
      <div className="card">
        <img src={event.image_url} />
        <h5 className="event-name">{event.name}</h5>
        <div className="main-content">
          <p className="event-name">{event.name}</p>
          <p className="owner">Owner: {event.owner_name}</p>

          <p className="start_date">Start Date: {event.start_date}</p>
          <p className="end_date">End Date: {event.end_date}</p>

          <div className="btn-container">
            <Link href={`/events/${event._id}/edit`}>
              <button className="btn edit">Edit</button>
            </Link>
            <button className="btn delete" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
      {message && <p>{message}</p>}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
  params,
}: GetServerSidePropsContext) => {
  await dbConnect()

  if (!params?.id) {
    return {
      notFound: true,
    }
  }

  const event = await Event.findById(params.id).lean()

  if (!event) {
    return {
      notFound: true,
    }
  }

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const serializedEvent = JSON.parse(JSON.stringify(event))

  return {
    props: {
      event: serializedEvent,
    },
  }
}

export default EventPage
