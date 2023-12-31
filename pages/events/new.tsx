import EventForm from '../../components/EventForm'

const NewEvent = () => {
  const eventForm = {
    name: '',
    owner_name: '',
    url: '',
    start_date: '',
    end_date: '',
    image_url: ''
  }

  return <EventForm formId="add-event-form" eventForm={eventForm} />
}

export default NewEvent
