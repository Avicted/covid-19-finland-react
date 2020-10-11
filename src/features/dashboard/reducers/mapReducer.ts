import produce from 'immer'
import { SelectedHealcareDistrict } from '../../../entities/SelectedHealthcareDistrict'
import { AppState } from '../../../framework/store/rootReducer'
import { MapActions, MapActionTypes } from '../actions/mapActions'

interface MapState {
    selectedHealthcareDistrict: SelectedHealcareDistrict | undefined;
    previouslySelectedHealthcareDistrict: SelectedHealcareDistrict | undefined;
}

const initialState: MapState = {
    selectedHealthcareDistrict: undefined,
    previouslySelectedHealthcareDistrict: undefined,
}

export function mapReducer(state: MapState = initialState, action: MapActions) {
    switch (action.type) {
        case MapActionTypes.SetSelectedHealthcareDistrict:
            return produce(state, (draft) => {
                draft.previouslySelectedHealthcareDistrict = draft.selectedHealthcareDistrict === undefined ? undefined : draft.selectedHealthcareDistrict; 
                draft.selectedHealthcareDistrict = action.selectedHealthcareDistrict;
            })
        default:
            return state;
    }
}

export function getSelectedHealthcareDistrict(state: AppState): SelectedHealcareDistrict | undefined {
    return state.map.selectedHealthcareDistrict;
}

export function getPreviouslySelectedHealthcareDistrict(state: AppState): SelectedHealcareDistrict | undefined {
    return state.map.previouslySelectedHealthcareDistrict;
}
