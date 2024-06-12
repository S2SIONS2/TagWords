import './ControlModal.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const closeApp = () => {
    const modalState = document.querySelector('.modalWrap');
    const confirmResult = confirm('프로그램이 종료 되고, 모든 정보가 지워집니다.');
    if(confirmResult === true){
        modalState.style.display = 'none';
        
    }else{
        modalState.style.display = 'block';
    }
    
    
}

const ControlModal = () => {
    return(
        <div className="ControlModal">
            <button 
                className='closeModal' 
                onClick={closeApp}
                
            >
                <FontAwesomeIcon icon={faX} />
            </button>
            
        </div>
    )
}

export default ControlModal;