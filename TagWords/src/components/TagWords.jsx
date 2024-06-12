import './TagWords.css';
import { useCallback, useState, useEffect } from 'react';
import axios from "axios";

const Tagwords = () => {
    /* input 값 배열에 넘기기*/   
    const [inputedValue, setInputedValue] = useState('');
    const [valueArray, setValueArray] = useState([]);
    
    const [definitions, setDefinitions] = useState({});

    const onChangeValue = useCallback((e) => {
        setInputedValue(e.target.value);
    }, []);

    /* 값 입력 시 조건 설정 추가 */
    const enteredValue = async (e) => {
        const firstChar = inputedValue.slice(0, 1);
        const lastChar = valueArray.length > 0 ? valueArray[valueArray.length - 1].slice(-1) : '';

        const checkRepeatWord = valueArray.includes(inputedValue);
        const inputElement = document.querySelector('.inputWord');

        if (valueArray.length <= 0) { // 처음 단어 입력 시
            if (e.key === 'Enter' && inputedValue.length === 3 && await checkWordApi(inputedValue)) { // 글자가 3글자 인지 확인
                setValueArray(prevArray => [...prevArray, inputedValue]);
                setInputedValue('');
                inputElement.style.border = '2px solid #fff';
            }
        } else if (valueArray.length > 0 && inputedValue.length === 3 && lastChar === firstChar && await checkWordApi(inputedValue)){ // 3글자이며 중복된 단어가 있는지 체크
            if (e.key === 'Enter' && !checkRepeatWord) { // 중복단어 체크 통과시
                setValueArray(prevArray => [...prevArray, inputedValue]);
                setInputedValue('');
                inputElement.style.border = '2px solid #fff';
            } else { // 중복단어 체크 불통시          
                inputElement.style.border = '2px solid red';
            }
        } else {
            inputElement.style.border = '2px solid red';
        }
    }

    const apiData = async (query) => {
        const url = '/api/search.do'; // 국립국어원 api 호출
        const apiKey = import.meta.env.VITE_API_KEY; //api key 암호화
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

    useEffect(() => {
        const fetchDefinitions = async () => {
            const defs = {};
            for (let value of valueArray) {
                if (!definitions[value]) { // 이미 정의를 가져온 단어는 다시 가져오지 않음
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
        <div className='TagWords modalWrap'>
            <div className='content'>
                <div className='gameTitle'>끝 말 잇기</div>
                <section className='chatLog'>
                    <div className='playerNum'>참여 인원: 2명</div>
                    <div className='chatWrap'>
                        {valueArray.map((value, index) => {
                            if (index % 2 === 0) {
                                return (
                                    <div className='chat chat_USER1' key={index}>
                                        &gt;&gt;&gt;: {value} <span className='definition'> {definitions[value]} </span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className='chat chat_USER2' key={index}>
                                        &lt;&lt;&lt;: {value} <span className='definition'> {definitions[value]} </span>
                                    </div>
                                );
                            }
                        })}
                    </div>
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
        </div>
    );
}

export default Tagwords;
