import { dbService } from 'fBase';
import React, { useState } from 'react';

const Home = () => {
    const [rweet, setRweet] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("rweets").add({ // add가 promise를 return
            rweet,
            createdAt: Date.now(),
        })
        setRweet("");
    };
    const onChange = (event) => {
        const { target: {value}} = event;
        setRweet(value);
    };   
    return (
    <div>
        <form onSubmit={onSubmit}>
            <input value={rweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={120} />
            <input type="submit" value="Rweet" />
        </form>
    </div>
    ); 
}; 

    
export default Home; 