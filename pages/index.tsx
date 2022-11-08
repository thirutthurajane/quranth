import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useEffect, useState} from "react";

type SelectOption = {
    value: String,
    label: String
}

type ChapterRes = {
    chapter: ChapterDetail[]
}

type ChapterDetail = {
    chapter: number,
    verse: number,
    text: string
}

export default function Home() {
    let [chapterList, setChapterList] = useState<SelectOption[]>([]);
    let [chapterDetail, setChapterDetail] = useState<ChapterRes>();
    let [arabDetail, setArabDetail] = useState<ChapterRes>();

    useEffect(() => {
        fetch('/api/chapter')
            .then(res => res.json())
            .then(data => {
                setChapterList(data);
                getChapterDetail("1");
            })
    },[]);

    function selectChapter() {
        return (
                    chapterList.map(c => {
                        return (
                            <option key={c.value.toString()} value={c.value.toString()}>{c.label}</option>
                        )
                    })
        )
    };

    function onSelectedChapterChange(e: any) {
        getChapterDetail(e.target.value);
    }

    function getChapterDetail(chapterNo: string) {
        Promise.all(
            [
                fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/tha-kingfahadquranc/${chapterNo}.min.json`),
                fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-jalaladdinalmah/${chapterNo}.json`)
            ]
        ).then(([dataTh, dataAr]) => {
            dataTh.json().then(r => setChapterDetail(r));
            dataAr.json().then(r => setArabDetail(r));
        });

    }

    function renderChapter() {
        if(chapterDetail !== undefined && arabDetail !== undefined) {
            return (
                chapterDetail.chapter.map(c => {
                    let arabData = arabDetail?.chapter.filter(a => a.verse == c.verse);
                    return (
                        <li className="text-md" key={c.verse}>{c.verse} - { arabData !== undefined ? arabData[0].text : ""} - {c.text}</li>
                    )
                })
            )
        } else {
            return (
                <>
                </>
            );
        }

    }

  return (
    <div className={styles.container}>
      <Head>
        <title>อัลกุรอานแปลไทยอัลกุรอานแปลไทย</title>
        <meta name="description" content="อัลกุรอานแปลไทย" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <div>
              <h2 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-blue-900 md:text-5xl lg:text-6xl dark:text-white">อัลกุรอานแปลไทย</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
               <select onChange={onSelectedChapterChange} className="block
                  w-full
                  px-3
                  py-1.5
                  text-base
                  font-normal
                  text-gray-700
                  bg-white bg-clip-padding bg-no-repeat
                  border border-solid border-gray-300
                  rounded
                  transition
                  ease-in-out
                  m-0
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
               ">
                { selectChapter() }
               </select>
          </div>
          <div className="block p-6 w-all mt-5 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
              <ul className="divide-y-2 divide-gray-100 w-full">
                  {
                     renderChapter()
                  }
              </ul>
          </div>
      </main>

    </div>
  )
}
