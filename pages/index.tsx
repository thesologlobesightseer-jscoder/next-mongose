import Link from 'next/link'
import dbConnect from '../lib/dbConnect'
import Pet, { Pets } from '../models/Pet'
import Event, { Events } from '../models/Event'
import { GetServerSideProps } from 'next'
import PetsList from './pets'
import EventsList from './events'

type Props = {
  pets: Pets[]
  events: Events[]
}

const Index = ({ pets, events }: Props) => {
  return (
    <>
    
    <PetsList pets={pets} />

    <EventsList events={events} />

    </>
  )
}

/* Retrieves pet(s) data from mongodb database */
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  await dbConnect()

  const result = await Pet.find({})

  const pets = result.map((doc) => {
    const pet = JSON.parse(JSON.stringify(doc))
    return pet
  })

  const event_res = await Event.find({})

  const events = event_res.map((doc) => {
    const event = JSON.parse(JSON.stringify(doc))
    return event
  })

  return { props: { pets: pets, events: events } }
}

export default Index
