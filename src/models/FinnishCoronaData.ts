export interface Confirmed {
  data: String,
  healthCareDistrict: String,
  id: String,
  infectionSource?: String,
  infectionSourceCountry?: String
}

export interface Deaths {
  area: String,
  date: String,
  healthCareDistrict: String,
  id: String
}

export interface Recovered {
  date: String,
  healthCareDistrict: String,
  id: String
}

export interface FinnishCoronaData {
  confirmed: Confirmed[],
  deaths: Deaths[],
  recovered: Recovered[]
}