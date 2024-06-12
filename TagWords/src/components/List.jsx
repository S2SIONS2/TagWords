const List = ({ valueArray, definitions }) => {
    return (
        <div className='ListWrap'>
            {valueArray.map((value, index) => {
                const className = index % 2 === 0 ? 'List List_USER1' : 'List List_USER2';
                return (
                    <div className={className} key={index}>
                        {index % 2 === 0 ? '<<<' : '>>>'}: {value} <span className='definition'>{definitions[value]}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default List;
