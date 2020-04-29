export interface Confirmed {
  date: string,
  healthCareDistrict: string,
  id: string,
  infectionSource?: string,
  infectionSourceCountry?: string
}

export interface Deaths {
  area: string,
  date: string,
  healthCareDistrict: string,
  id: string
}

export interface Recovered {
  date: string,
  healthCareDistrict: string,
  id: string
}

export interface FinnishCoronaData {
  confirmed: Confirmed[],
  deaths: Deaths[],
  recovered: Recovered[]
}