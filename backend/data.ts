import { IAddress, IUser } from "./interfaces"

const user: IUser = {
  firstName: "Ciro",
  lastName: "Monteiro",
  username: "cirossmonteiro",
  email: "cirossmonteiro@gmail.com",
  password: "ciro1234"
}

const home: IAddress = {
  title: "Home - Copacabana Palace",
  street: "Av. Atlântica - Copacabana",
  number: 1702,
  city: "Rio de Janeiro",
  state: "RJ",
  country: "Brazil",
  zipCode: "22021-001"
}

const college: IAddress = {
  title: "College - UFRJ",
  street: "Av. Athos da Silveira Ramos - Cidade Universitária",
  number: 149,
  complement: "Bloco C (Térreo)",
  city: "Rio de Janeiro",
  state: "RJ",
  country: "Brazil",
  zipCode: "21941-909"
}

const work: IAddress = {
  title: "Work - Shopping Rio Sul",
  street: "Rua Lauro Müller - Botafogo",
  number: 116,
  city: "Rio de Janeiro",
  state: "RJ",
  country: "Brazil",
  zipCode: "22290-160"

}

export default { user, address: { home, work, college } };