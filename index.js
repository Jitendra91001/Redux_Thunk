import axios from "axios";
import { combineReducers, legacy_createStore as createStore } from "redux";
import { applyMiddleware } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

//contextCreate action

const increment='account/increment'
const decriment='account/decriment'
const IncrementByAmount='account/IncrementByAmount'
const getAccountUserfullfil='account/getAccountUser/fullfill'
const getAccountUserPending='account/getAccountUser/Pending'
const getAccountUserRejected='account/getAccountUser/Rejected'
const BonusInc='bonus/Increment'

const store = createStore(
    combineReducers({
        amountReducer:Amountreducer,
        bonusreducer:bonusReducer
    })
    ,applyMiddleware(logger.default,thunk.default))

//reducer
function Amountreducer(state = { amount: 1 }, action) {
    switch (action.type) {
        //immutability
        case increment:
            return { amount: state.amount + 1 }

        case decriment:
            return { amount: state.amount - 1 }

        case IncrementByAmount:
            return { amount: state.amount + action.payload }
        case getAccountUserfullfil:
            return { amount: action.payload ,pending:false}
        case getAccountUserRejected:
            return {...state,error:action.error,pending:false}
        case getAccountUserPending:
            return {...state,pending:true}
        default:
            return state;
    }
}

//bonus reducer

function bonusReducer(state={points:0},action){
    switch(action.type){
        case BonusInc:
            return {points:state.points+1}
        // case getAccountUserfullfil:
        //     return {points:action.payload}
        case IncrementByAmount:
           return  action.payload >=100 ?  {points:state.points+1} :null
            // if(action.payload>=100)
            //    return {points:state.points+1}
        default:
            return state;
    }
}



//create a emty array 

const history = []

//store 
// store.subscribe(() => {
//     history.push(store.getState())
//     console.log(history)
// })

// console.log(store.getState())

//API call axios

const getUser= (id)=>{
    return async(dispatch,getState)=>{
   try{
    dispatch(getAccountPen())
    let {data}=await axios.get(`http://localhost:5000/users/${id}`)
    dispatch(getAccountFull(data.amount))
   }catch(error){
    dispatch(getAccountRej(error.message))
   }
    }
}


//action creation

function getAccountFull(value){
    return {type:getAccountUserfullfil,payload:value}
}

function getAccountRej(error){
    return {type:getAccountUserRejected,error:error}
}

function getAccountPen(){
    return {type:getAccountUserPending}
}

function BonusIncrement(){
    return {type:BonusInc}
}

function Increment(){
    return {
        type:increment
    }
}


function incrementByAmount(value){
    return {
        type:IncrementByAmount,
        payload:value
    }
}


function Decriment(){
    return {
        type:decriment
    }
}

//action
setTimeout(() => {
    // store.dispatch(incrementByAmount(500))
    // store.dispatch(Increment())
    // store.dispatch(Decriment())
    store.dispatch(getUser(2))
    
    // store.dispatch(BonusIncrement())
}, 2000)

