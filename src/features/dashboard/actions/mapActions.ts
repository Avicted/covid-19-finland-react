import { Action } from 'redux'
import { SelectedHealcareDistrict } from '../../../entities/SelectedHealthcareDistrict';

export enum MapActionTypes {
    SetSelectedHealthcareDistrict = 'Map/SetSelectedHealthcareDistrict',
}

export interface SetSelectedHealthcareDistrict extends Action {
    type: MapActionTypes.SetSelectedHealthcareDistrict;
    selectedHealthcareDistrict: SelectedHealcareDistrict;
}

export const mapActions = {
    SetSelectedHealthcareDistrict: (selectedHealthcareDistrict: SelectedHealcareDistrict): SetSelectedHealthcareDistrict => ({
        type: MapActionTypes.SetSelectedHealthcareDistrict,
        selectedHealthcareDistrict,
    }),
}

export type MapActions =
    SetSelectedHealthcareDistrict;
