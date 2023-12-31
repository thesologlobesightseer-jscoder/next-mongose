import PetForm from '../../components/PetForm'

const NewPet = () => {
  const petForm = {
    name: '',
    owner_name: '',
    species: '',
    age: 0,
    poddy_trained: false,
    diet: [],
    image_url: '',
    likes: [],
    dislikes: [],
  }

  return <PetForm formId="add-pet-form" petForm={petForm} />
}

export default NewPet
