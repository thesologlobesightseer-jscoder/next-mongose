import Link from 'next/link'
import dbConnect from './../../lib/dbConnect'
import Event, { Events } from './../../models/Event'
import { GetServerSideProps } from 'next'

type Props = {
  events: Events[]
}

const EventsList = ({ events }: Props) => {
  return (
    <>
      {events.map((event) => (
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
                <Link href={{ pathname: '/events/[id]/edit', query: { id: event._id } }}>
                  <button className="btn edit">Edit</button>
                </Link>
                <Link href={{ pathname: '/events/[id]', query: { id: event._id } }}>
                  <button className="btn view">View</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

/* Retrieves event(s) data from mongodb database */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await dbConnect()

  /* find all the data in our database */
  const result = await Event.find({})

  /* Ensures all objectIds and nested objectIds are serialized as JSON data */
  const events = result.map((doc) => {
    const event = JSON.parse(JSON.stringify(doc))
    return event
  })

  return { props: { events: events } }
}

export default EventsList
