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
    const [chapterList, setChapterList] = useState<SelectOption[]>([]);
    const [chapterDetail, setChapterDetail] = useState<ChapterRes>();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch('/api/chapter')
            .then(res => res.json())
            .then(data => {
                setChapterList(data);
                getChapterDetail("1");
            });
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
        setLoading(true);
        getChapterDetail(e.target.value);
        setLoading(false);
    }

    function getChapterDetail(chapterNo: string) {
        Promise.all(
            [
                fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/tha-kingfahadquranc/${chapterNo}.min.json`),
                fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-jalaladdinalmah/${chapterNo}.json`)
            ]
        ).then(async ([dataTh, dataAr]) => {
            let resTh = await dataTh.json();
            let resAr = await dataAr.json();

            let chapterDtl = [];
            for (let i = 0; i < resTh.chapter.length; i++) {
                let verse: ChapterDetail = {
                    chapter: resTh.chapter[i].chapter,
                    verse: resTh.chapter[i].verse,
                    text: `${resTh.chapter[i].verse} - ${resAr.chapter[i].text} - ${resTh.chapter[i].text}`
                };
                chapterDtl.push(verse);
            }
            let chapters = {
                chapter: chapterDtl
            }
            setChapterDetail(chapters);

        });

    }

    function renderChapter() {
        if(chapterDetail !== undefined) {
            return (
                chapterDetail.chapter.map(c => {
                    return (
                        <li className="text-md" key={c.verse}>{c.text}</li>
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
              { !loading  ?
                  <ul className="divide-y-2 divide-gray-100 w-full">
                      {
                          renderChapter()
                      }
                  </ul> :
                  <div role="status">
                      <svg aria-hidden="true"
                           className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                           viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"/>
                          <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"/>
                      </svg>
                      <span className="sr-only">Loading...</span>
                  </div>
              }

          </div>
      </main>

    </div>
  )
}
