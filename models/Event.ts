import mongoose from 'mongoose'

export interface Events extends mongoose.Document {
  name: string
  url: string
  owner_name: string
  start_date: string
  end_date: string
  image_url: string
}

/* Eventchema will correspond to a collection in your MongoDB database. */
const EventSchema = new mongoose.Schema<Events>({
  name: {
    type: String,
    required: [true, 'Please provide a name for this event.'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  owner_name: {
    type: String,
    required: [true, "Please provide the event owner's name"],
    maxlength: [60, "Owner's Name cannot be more than 60 characters"],
  },
  start_date: {
    required: [true, 'Please provide an start date for this event.'],
    type: String,
  },
  end_date: {
    required: [true, 'Please provide an end date for this event.'],
    type: String,
  },
  url: {
    type: String,
    required: [true, 'Please provide a unique url for this event.'],
    maxlength: [60, 'URL cannot be more than 60 characters'],
  },
  image_url: {
    required: [true, 'Please provide an image url for this event.'],
    type: String,
  }
})

export default mongoose.models.Event || mongoose.model<Events>('Event', EventSchema)
