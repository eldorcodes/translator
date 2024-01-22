import React, { useState, useRef } from 'react';
import './Translator.css';
import { FaLongArrowAltRight } from "react-icons/fa";
import { CiLocationArrow1 } from "react-icons/ci";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { IoCopyOutline } from "react-icons/io5";

export default function Translator() {
const [from,setFrom] = useState('en');
const [to,setTo] = useState('uz');
const [text,setText] = useState('');
const [translatedText,setTranslatedText] = useState([]);
const [copySuccess, setCopySuccess] = useState('');
const textAreaRef = useRef(null);
const [isCopied,setIsCopied] = useState(false);

function copyToClipboard(e) {
  textAreaRef.current.select();
  document.execCommand('copy');
  // This is just personal preference.
  // I prefer to not show the whole text area selected.
  e.target.focus();
  setCopySuccess('Copied!');
};

async function translator(from, to, text) {
    let res = '';
    const url =
      "https://google-translate113.p.rapidapi.com/api/v1/translator/text";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": "98405912eamshd9518930844d7ecp11ec3bjsnea7984244fd0",
        "X-RapidAPI-Host": "google-translate113.p.rapidapi.com",
      },
      body: new URLSearchParams({
        from: from,
        to: to,
        text: text,
      }),
    };
  
    try {
      const response = await fetch(url, options);
      const result = await response.json();
     console.log(result.trans);
     
     res = result.trans

    } catch (error) {
      console.error(error);
    }

    return res
  }

  async function fetchData(t){
    let text = await translator(from,to,t);
    console.log(text)
    return text
  }

  async function translate(e){
    e.preventDefault();
    let message = await fetchData(text);
    setTranslatedText([...translatedText,{translated:message,original:text}]);
    setText('')
  }
  


  return (
    <div className='translator-container'>
        <div className='options'>
        <select 
        onChange={(e) => setFrom(e.target.value)}
        className='option'>
        <option value={'en'} selected>ENGLISH</option>
        <option value={'uz'}>UZBEK</option>
        <option value={'ru'}>RUSSIAN</option>
      </select>
      <select 
    onChange={(e) => setTo(e.target.value)}
      className='option'>
         <option value={'en'}>ENGLISH</option>
        <option value={'uz'} selected>UZBEK</option>
        <option value={'ru'}>RUSSIAN</option>
      </select>
        </div>
         <ul id="messages">
            {
                translatedText?.map((t,i) => (
                    <>
                    <li key={i}>{t?.original}</li>
                    <li ref={textAreaRef} key={Math.random().toString()}>
                        {t?.translated}

                        <CopyToClipboard text={t?.translated}
          onCopy={() => {
            setIsCopied(true);
            //alert(`Copied successfully`)
            }}>
          <IoCopyOutline color={isCopied ? 'green':'black'} />
        </CopyToClipboard>

                        </li>
                    </>
                ))
            }
         </ul>
    <form 
    onSubmit={translate}
    id="form" action="">
      <input 
      id="input" 
      autocomplete="off" 
      onChange={(e) => setText(e.target.value)}
      value={text}
      placeholder={from == 'en' ? 'Enter text' : from == 'uz' ? `So'z kiriting` : 'Введите текст'}
      required
      />
     
      <button>
      <CiLocationArrow1 />
      </button>
    </form>
    </div>
  )
}
