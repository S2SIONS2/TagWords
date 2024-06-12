import './reset.css'
import './App.css'
import Tagwords from './components/TagWords';

function App() {

  const openTagWords = () => {
    const modalState = document.querySelector('.modalWrap');

    modalState.style.display = 'block';
  } 

  return (
    <>
       <button
          className='openTagWords'
          onClick={openTagWords}
        />
        <Tagwords 
          
        />
    </>
  )
}

export default App
