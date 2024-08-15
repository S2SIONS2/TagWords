import { useCallback, useState, useEffect } from 'react';
import axios from "axios";
import './WordList.css';
import List from './List';

const WordList = () => {
    const [inputedValue, setInputedValue] = useState(''); // 단어 입력
    const [valueArray, setValueArray] = useState([]); // 입력된 단어 배열
    const [definitions, setDefinitions] = useState({}); // 단어 정의
    const [isProcessing, setIsProcessing] = useState(false); // 중복 입력 방지
    const [timer, setTimer] = useState(60); // 타이머 시간 초
    const [timerInterval, setTimerInterval] = useState(null); // 타이머 인터벌 ID

    // 게임 타이머
    useEffect(() => {
        if (timer <= 0) {
            clearInterval(timerInterval);
            alert('게임이 종료 되었습니다.');
            location.reload(true);
        }
    }, [timer]);

    const startTimer = useCallback(() => {
        const timerDiv = document.querySelector('.timer');
        setTimer(60); // 타이머를 60초로 초기화
        clearInterval(timerInterval); // 기존 인터벌 클리어
        const intervalId = setInterval(() => {
            setTimer(prev => {
                const newTime = prev - 1;
                if (newTime <= 30) {
                    timerDiv.style.color = 'yellow';
                }
                if (newTime <= 10) {
                    timerDiv.style.color = 'red';
                }
                return newTime;
            });
        }, 1000);
        setTimerInterval(intervalId);
    }, [timerInterval]);

    // input value 이벤트 핸들링
    const onChangeValue = useCallback((e) => {
        setInputedValue(e.target.value);
    }, []);

    // 값 입력 시 
    const enteredValue = async (e) => {
        const firstChar = inputedValue.slice(0, 1); // 첫글자
        const lastChar = valueArray.length > 0 ? valueArray[valueArray.length - 1].slice(-1) : ''; // 마지막 글자

        const checkRepeatWord = valueArray.includes(inputedValue); // 반복 단어 체크
        const inputElement = document.querySelector('.inputWord');

        if (e.key !== 'Enter' || isProcessing) return; // 중복 입력 방지
        setIsProcessing(true);

        if (valueArray.length <= 0) {
            if (await checkWordApi(inputedValue) !== true || inputedValue.length !== 3) { // 처음 입력 시에 api 체크 
                alert('국립국어원에 기재된 단어 혹은 3글자만 입력 가능합니다.');
                inputElement.style.border = '2px solid red';
            }
            if (inputedValue.length === 3 && await checkWordApi(inputedValue)) {
                addWord(inputedValue);
                setInputedValue('');
                startTimer(); // 타이머 시작 또는 리셋
                inputElement.style.border = '2px solid #fff';
            }
        } else if (valueArray.length > 0 && inputedValue.length === 3 && lastChar === firstChar && await checkWordApi(inputedValue)) {
            if (!checkRepeatWord) {
                addWord(inputedValue);
                setInputedValue('');
                startTimer(); // 타이머 시작 또는 리셋
                inputElement.style.border = '2px solid #fff';
            } else {
                inputElement.style.border = '2px solid red';
            }
        } else {
            inputElement.style.border = '2px solid red';
        }

        setIsProcessing(false); 
    }

    const apiData = async (query) => {
        const url = '/api/search.do';
        const apiKey = import.meta.env.VITE_API_KEY;
        let params = {
            key: apiKey,
            q: encodeURI(query),
            req_type: 'json',
            type1: 'word',
            pos: '1,2'
        };
        const response = await axios.get(url, { params });
        return response.data;
    };

    const apiDataDefinition = async (query) => {
        const data = await apiData(query);
        return data.channel.item[0].sense.definition;
    };

    const checkWordApi = async (query) => {
        return await apiData(query) !== '' ? true : false;
    }

    const addWord = (word) => {
        setValueArray(prevArray => [...prevArray, word]);
    };

    useEffect(() => {
        const fetchDefinitions = async () => {
            const defs = {};
            for (let value of valueArray) {
                if (!definitions[value]) {
                    try {
                        const definition = await apiDataDefinition(value);
                        defs[value] = definition;
                    } catch (error) {
                        console.error(`Error fetching definition for ${value}:`, error);
                        defs[value] = "정의를 가져오지 못했습니다.";
                    }
                } else {
                    defs[value] = definitions[value];
                }
            }
            setDefinitions(defs);
        };
        fetchDefinitions();
    }, [valueArray]);

    return (
        <div className="WordList">
            <section className="logWrap">
                <div className='timer'>{timer}</div>
                <div className='playerNum'>참여 인원: 2명</div>
                <List valueArray={valueArray} definitions={definitions} />
            </section>
            <section className='enterWord'>
                <div className='info'>
                    <ul>
                        <li>입력: Enter</li>
                        <li>게임 재시작: Ctrl + R</li>
                    </ul>
                </div>
                <div className='inputArea'>
                    <input
                        className='inputWord'
                        type='text'
                        maxLength={3}
                        value={inputedValue || ""}
                        onChange={onChangeValue}
                        onKeyPress={enteredValue}
                    />
                </div>
            </section>
        </div>
    );
}

export default WordList;
