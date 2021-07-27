import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'
import FileViewer from "react-file-viewer";
import AWS from 'aws-sdk'
import styled, { keyframes } from 'styled-components'

import styles from "../static/css/main.module.css"
import { formatSize } from '../utils/utils';
import api from '../service/api';

AWS.config.update({
  accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS
})

const MainApp = () => {
    const [uploaded, setUploaded] = useState(false);
    const [file, setFile] = useState({});
    const [isScanning, setIsScanning] = useState(false);
    const [scanData, setScanData] = useState(null);
    const [scanResult, setScanResult] = useState(null);
    const [timer, setTimer] = useState(0);
    
    const [results, setResults] = useState({
        wordCount: 0,
        sourcesCount: 0
    });

    const bucket = new AWS.S3({
        params: { Bucket: 'bitsmss' },
        region: 'eu-west-2',
    });
    
    const uploadFile = (file) => {
        const params = {
            ACL: 'public-read',
            Key: file.name,
            ContentType: file.type,
            Body: file,
        }
        
        bucket.putObject(params)
            .on('httpUploadProgress', (evt) => {
                const prog = (evt.loaded / evt.total) * 100
                if (prog === 100) {
                    setUploaded(true);
                    scan(file);
                }
            }).send((err) => { if (err) console.log(err) });
    }

    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0])
        uploadFile(acceptedFiles[0])
    }, [])

    const dateModified = new Date(file?.lastModified)
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const onError = (error) => console.log(error)

    const scan = async (file) => {
        setIsScanning(true)
        const scan_response = await api.scan(file.name);
        if (scan_response.ok) {
            setScanData(scan_response.data);
            return checkResults(scan_response.data);
        }
        setIsScanning(false)
    }

    const checkResults = async (scanned_data) => {
        const results_response = await api.checkResults({
            access_token: scanned_data.access_token,
            scan_id: scanned_data.scan_id
        })

        if (results_response.ok) {
            if (results_response.data.data.attributes.state === "in_progress") {
                await sleep(5000);
                return checkResults(scanned_data);
            }
            clearTimeout(timer);
            console.log("results_response.data");
            console.log(results_response.data);
            console.log("results_response.data");
            setScanResult(results_response.data);
        }
        setIsScanning(false)
    }
    
    const sleep = async (ms) => {
        clearTimeout(timer);
        return new Promise((resolve) => {
            const timeout = setTimeout(resolve, ms);
            setTimer(timeout);
        });
    };

    const grow = keyframes`from { width: 0; } to { width: ${scanResult?.data?.attributes?.similarity}vw; }`
    
    const Progress = styled.div`
        animation: 3s ${grow} ease-in forwards;
        width: 40vw;
        height: 50px;
        background-color: red;
        border-radius: 20px;
        cursor: pointer;
        box-shadow: 1px 1px 23px 2px rgba(0,0,0,0.75);
        -webkit-box-shadow: 1px 1px 23px 2px rgba(0,0,0,0.75);
        -moz-box-shadow: 1px 1px 23px 2px rgba(0,0,0,0.75);`

    return (
        <div className={styles.container}>
            {uploaded ?
                <div className={styles.mainAppContainer}>
                    <header className={styles.header}>
                        <div className={styles.logo}></div>
                        <h3 className={styles.title}>Plagiarism Detector</h3>
                        <div className={styles.fileDetailContainer}>
                            <div className={styles.filenameContainer}>
                                <div className={styles.fileIcon}></div>
                                <span className={styles.filename} title={file.name}>{file?.name.length > 30 ? file?.name.slice(0,30) + "......" : file?.name || "Loading..."}</span>
                            </div>
                            <span className={styles.lastUpdated}>Last Modified: {dateModified.toLocaleDateString('en-US', {month: "long", day: "numeric", year: "numeric"}) } at {dateModified.toLocaleTimeString()}</span>
                        </div>
                        {
                            scanResult && !isScanning && <div className={styles.plagiarismPercentageProgressContainer}>
                                <Progress title="Percentage of plagiarism detected" className={styles.plagiarismPercentageProgress}>
                                    <h2 className={styles.plagiarismPercentageText}>{scanResult.data.attributes.similarity}%</h2>
                                </Progress>
                            </div>
                        }
                    </header>
                    <div className={styles.subHeader}>
                        {
                            !scanResult ?
                                <div className={styles.sourceCountContainer}>
                                    <div className={styles.subHeaderLoader}></div>
                                    <span className={styles.scanningText}>Scanning, Crunching the internet in search for plagiarism ...</span>
                                </div>
                                :
                                <div className={styles.sourceCountContainer}>
                                    <span className={styles.sourceText}>Internet Sources: {scanResult.data.meta.originality.sources_count}</span>
                                    <span className={styles.sourceText}>File Size: {formatSize(file.size)}</span>
                                    <span className={styles.sourceText}>No of Words: 8</span>
                                </div>
                        }
                    </div>
                    <main className={styles.workarea}>
                        {
                            isScanning ?
                                <section className={styles.sourcesPlaceholderArea}>
                                    <div className={styles.sourcePlaceholder}>
                                        <div></div>
                                    </div>
                                    <div className={styles.sourcePlaceholder}>
                                        <div></div>
                                    </div>
                                    <div className={styles.sourcePlaceholder}>
                                        <div></div>
                                    </div>
                                        <div className={styles.sourcePlaceholder}>
                                        <div></div>
                                    </div>
                                        <div className={styles.sourcePlaceholder}>
                                        <div></div>
                                    </div>
                                        <div className={styles.sourcePlaceholder}>
                                        <div></div>
                                    </div>
                                </section>
                                :
                                <section className={styles.sourcesContentArea}>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                            <a target="_blank" href="http://web-source.unicheck.com/66274811?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">
                                                Wikimili
                                            </a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274788?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">
                                            Wikipedia
                                        </a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274780?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">DBpedia</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274777?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Codewithin Amul</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274769?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">DBpedia</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274768?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Heroku.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274804?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Softwarepracticeslk.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274803?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Softwarepracticeslk</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274813?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Coursehero.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274809?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Thereaderwiki</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274787?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Wikipedia</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274828?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Programshelp.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274797?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Kuchewar.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274799?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Onemancode.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274820?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">i2Tutorials.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274806?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Thecleverprogrammer.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274815?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Coursehero</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274807?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Thepocketuniverisity.in</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274783?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Ebookee</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274826?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Onlinetutorials.org</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274824?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Onlinetutorials.org</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274782?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Dealchat.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274781?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">dead-programmer.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274818?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Coursejoiner.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274829?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Udemy</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274785?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Interviewgig.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274817?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Coursehero.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274805?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Ampercomputing.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                    <div className={styles.source}>
                                        <span className={styles.globeIcon}></span>
                                        <a target="_blank" href="http://web-source.unicheck.com/66274801?at=cacf683d31194d48a150a079c2b248af&au=e17efcb9059145298057695ccfe36f61">Saveitsafer.com</a>
                                        <span className={styles.edge}></span>
                                    </div>
                                </section>
                        }
                        <section className={styles.textareaContainer}>
                            <div className={styles.textarea}>
                                <FileViewer
                                    fileType="docx"
                                    filePath={`https://bitsmss.s3.eu-west-2.amazonaws.com/${file.name}`}
                                    onError={onError}
                                />
                            </div>
                            { isScanning && <div className={styles.textareaOverlay}></div>}
                        </section>
                    </main>
                </div>
                :
                <div {...getRootProps()} className={styles.uploadContainer}>
                    <input {...getInputProps()} className={styles.fileInput} />
                    {
                        isDragActive ?
                            <div className={styles.dragContainer}>
                                <p className={styles.dragText}>Good, drop the file</p>
                                <span className={styles.dropIcon}></span>
                                <p className={styles.dragTitle}>Let's dig the internet for some plagiarism</p>
                            </div>:
                            <div className={styles.dragContainer}>
                                <p className={styles.dragText}>Upload a document to scan plagiarism</p>
                                <span className={styles.dragIcon}></span>
                                <p className={styles.dragTitle}>Drag & drop some files here, or click anywhere on the screen to select files</p>
                            </div>
                    }
                </div>
            }
        </div >
    );
}

export default MainApp;
