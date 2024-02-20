import { useEffect, useRef, useState } from "react";
import ReactSelect from "react-select";
import swapIcon from '../assets/images/swap.png';
import '../App.css'

export default function Home(){

    const [currencyList, setCurrencyList]= useState([]);
    const [from, setFrom]= useState(null);
    const [to, setTo]= useState(null);
    const [amount, setAmount]= useState('');
    const [display, setDisplay]= useState(false);
    const [inpuntAmout, setInputAmount]= useState('');
    const [prevResults, setPrevResults]= useState([]);
    

    async function getCurrencyList(){
        const response= await fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies.json');
        
        const result= await response.json();
        const options = Object.keys(result).map((keys) => ({
            value: result[keys],
            label: keys
        }));
        setCurrencyList(options);
    }

    async function handleConversion(){
        if(from !== null && to!== null){
            const response= await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${from.label}.json`)
            const result= await response.json();
            const value= result[from.label][to.label];
            setAmount(inpuntAmout*value)
            setDisplay(true)
            const val=inpuntAmout*value;
            handleResults({
                amount:inpuntAmout,
                from:from.label,
                to:to.label,
                result:val
            })
        }
    }
    const ref= useRef(false);
    useEffect(() => {
        const content = ref.current;
        if(!display){ 
            content.style.display = `none`
        } else {
            content.style.display = `block`
        }
        
    }, [display]);

    function handleInput(e){
        setInputAmount(e.replace(/[^0-9]/g, '')); 
        setDisplay(false)
    }

    function handleSwitch(){
        const temp= from ;
        setFrom(to);
        setTo(temp);
        setDisplay(false)
    }

     function handleResults(value){
        if(prevResults.length>4){
            prevResults.pop()
            setPrevResults(prevResults);
        }
        prevResults.unshift(value)
        setPrevResults(prevResults)
        console.log(prevResults);
    }

    useEffect(()=>{
        getCurrencyList();
    },[])
    return(
        <div className="main-container">
            <h1 className="main-heading">Currency converter</h1>
            <div className="input-container">
                <div className="label-input-div">
                    <label>Amount</label>
                    <input value={inpuntAmout} onChange={(e)=>handleInput(e.target.value)} id="input-amount" placeholder="Enter your amount"/>
                </div>
                <div className="label-input-div">
                    <label>From</label>
                <ReactSelect
                        value={from}
                        onChange={(e)=>{setFrom(e);setDisplay(false)}}
                        options={currencyList}
                        id="from-input"
                        className="react-select"
                    />
                </div>
                <img onClick={()=>handleSwitch()} src={swapIcon} alt="swap icon" title="swap" className="swap-img"/>
                <div className="label-input-div">
                    <label>To</label>
                    <ReactSelect
                        value={to}
                        onChange={(e)=>{setTo(e);setDisplay(false)}}
                        options={currencyList}
                        id="to-input"
                        className="react-select"
                    />
                </div>
            </div>
            <button onClick={()=>handleConversion()}>Convert</button>
                <h2>Converted Amount:</h2>
                <div ref={ref}>
                <h3 className="result">
                    {inpuntAmout} {from ? from.label : ''} = {amount} {to ? to.label : ''}
                </h3>
            </div>
            <div className="previous-results">
                <h2 className="results-heading">Previous results:</h2>
                    <ol>
                {
                    prevResults.map((obj,index)=>{
                        return(
                            <li key={obj.from+{index}} className="results-list">{obj.amount} <span className="span-text">{obj.from}</span> = {obj.result} <span className="span-text">{obj.to}</span></li>
                        )
                    })
                }
                </ol>

            </div>
        </div>
    )
}