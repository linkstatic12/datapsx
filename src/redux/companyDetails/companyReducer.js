import { GET_COMPANY } from "./companyTypes"
const initialState = {
    currentCompany: 0 
}
const companyReducer = (state=initialState,action) => {
switch(action.type){
  case GET_COMPANY: return{
    ...state,
    currentCompany:state.currentCompany +1
  }
  default: return state


}


}

export default companyReducer