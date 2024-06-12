import './TagWords.css';
import { useEffect } from 'react';
import WordList from './WordList';

const Tagwords = () => {
    /* 게임 리셋 버튼 */
    useEffect(() => {
        const gameReset = (e) => {
            if ((e.ctrlKey && e.key === 'r') || (e.ctrlKey && e.key === 'ㄱ')) {
                alert('게임이 종료 되었습니다.');
                location.reload(true);
            }
        };
        window.addEventListener('keydown', gameReset);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
            window.removeEventListener('keydown', gameReset);
        };
    }, []); 

    return (
        <div className='TagWords modalWrap'>
            <div className='content'>
                <div className='gameTitle'>
                    끝 말 잇기
                </div>  
                <WordList/>
            </div>
        </div>
    );
}

export default Tagwords;
