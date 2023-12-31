import { useContext, useState } from "react"
import { useDropzone } from 'react-dropzone';
import { Container, Row, Button } from "reactstrap";
import styles from "./Track_Upload.module.css"
import axios from "axios";
import MultiTrackUpload from "./MultiTrackUpload/MultiTrackUpload";
import SingleTrackUpload from "./SingleTrackUpload/SingleTrackUpload";
import { LoginContext } from "../../../App";


const Track_Upload = () => {

    const loginID = useContext(LoginContext);

    // 업로드할 음원 파일을 저장하는 변수
    const [files, setFiles] = useState([]);

    // 데이터베이스에 음원목록을 가져오는 변수
    const [tracks, setTracks] = useState([]);

    const [imageview, setImageview] = useState({});

    // 선택된 태그를 가져지고 있는 state
    const [selectTag, setSelectTag] = useState([]);


    // 데이터베이스에 존재하는 모든 음원 정보를 가져오는 기능
    const handlelist = () => {
        axios.get(`/api/track/findById/${loginID.loginID}`).then(resp => {
            console.log(resp.data);
            setTracks(resp.data)
        })
    }


    const onDrop = (acceptedFiles) => {
        acceptedFiles.forEach(file => {
            const url = URL.createObjectURL(file);
            const audio = new Audio(url);

            audio.onloadedmetadata = () => {
                const duration = audio.duration;
                const image_path = "/assets/groovy2.png";
                const fileNameWithoutExtension = file.name.split('.').slice(0, -1).join('.');

                const newFile = {
                    file: file,
                    name: fileNameWithoutExtension,
                    duration: duration,
                    imageFile: null,
                    image_path: image_path,
                    writer: "익명의 제작자",
                    tags: []
                };

                if (acceptedFiles.length === 1) {
                    // Handle single file upload
                    setFiles([newFile]);
                } else {
                    // Handle multiple file upload
                    setFiles(prevFiles => [...prevFiles, newFile]);
                }
            };
        });
    };


    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'audio/*' // 오디오 파일만 허용
    });

    const filesList = files.map((file, index) => {
        if (!file || !file.file) {
            return <li key={index}>파일 정보를 읽을 수 없음</li>;
        }
        return (
            <li key={index}>
                {file.file.name} - {file.file.size} bytes - 길이: {file.duration}초
            </li>
        );
    });

    return (
        <Container fluid>
            <Row className={styles.uploadBox}>
                {files.length === 0 ? (
                    <div className={styles.Dropzone} {...getRootProps()}>
                        <div className={styles.viewUpload}>
                            <input {...getInputProps()} style={{ display: 'none' }} />
                            <div className={styles.dropFiles}>
                                음악 파일을 드래그 앤 드롭하거나 클릭하여 파일을 선택하세요.
                            </div>
                            <div>
                                <Button color="primary" className={styles.Button} >파일을 선택하세요</Button>
                            </div>
                        </div>
                    </div>
                ) : files.length === 1 ? (
                    <SingleTrackUpload files={files} setFiles={setFiles} imageview={imageview} setImageview={setImageview}
                        selectTag={selectTag} setSelectTag={setSelectTag} />
                ) :
                    <MultiTrackUpload files={files} setFiles={setFiles} imageview={imageview} setImageview={setImageview}
                        selectTag={selectTag} setSelectTag={setSelectTag} />
                }
            </Row>
        </Container>

    );
}

export default Track_Upload;