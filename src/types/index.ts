export interface Breed {
  id: string
  name: string
  weight: { metric: string }
  height: { metric: string }
  life_span: string
  bred_for: string
  temperament: string
  origin?: string
}

export interface Dog {
  id: string
  url: string
  breeds: Breed[]
  width: number
  height: number
}

export interface FavoriteDog {
  id: string
  dogId: string
  imageUrl: string
  breed: string
  addedAt: number
}
