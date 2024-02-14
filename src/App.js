
import React from "react";
import NavBar from "./Components/NavBar/NavBar";
import { Routes , Route} from "react-router-dom";
import Groups from "./Pages/Groups/Groups";
import Home from "./Pages/Home/Home";
import SignIn from "./Pages/SignIn/SignIn";
import Dashboard from "./Dashboard";
import { useDispatch } from "react-redux";
import { setActive } from "./State/StudentsSlice";
import PersisistLogin from "./PersisistLogin";

function App() {
  const dispatch = useDispatch();

  React.useEffect(()=>{
    const user =JSON.parse(localStorage.getItem('cms-user'));
   
    if(user){
        dispatch(setActive(user));
    }
    

}, [])

  return (
    <div className="App">
     <Routes>

      <Route path='/signin' element={<SignIn/>} />
      
      <Route path="/" element={<PersisistLogin/>}>
        <Route path="/" element={<Dashboard/>}>
          <Route path="/" element={<Home/>} />
          <Route path='/groups' element={<Groups/>} />
        </Route>
      </Route>
      
     </Routes>


    </div>
  );
}

export default App;
