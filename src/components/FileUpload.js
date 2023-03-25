import React,{useState,useEffect} from 'react';
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({contract,account,provider}) => {

  const [file,setFile] = useState();
  const [fileName,setFileName] = useState("No Image selected");

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(file){
      try{
        const formData = new FormData();
        formData.append("file",file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "45328c18a8b24a93811a",
            pinata_secret_api_key: 'b373ca5a98d2d0a0a76302366dd47296d8611088bbbea6ba3562ed8ba85b3d14',
            "Content-Type": "multipart/form-data"
          }
        });
        const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
        contract.add(account,ImgHash);
        alert("Successfully image uploaded");
        setFileName("No Image selected ");
        setFile(null);
      }catch{
        alert("Unable to upload image to pinata")
      }
    }
  } 
  const retrieveFile = (e) => {
    const data = e.target.files[0]; //array of files object
    console.log(data)
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    }
    setFileName(e.target.files[0].name);
    e.preventDefault();
  } 

  return (
    <div className='top'>
      <form className='form' onSubmit={handleSubmit}>
        <label htmlFor='file-upload' className='choose'>
          Choose Image
        </label>
        <input disabled={!account} type="file" id="file-upload" name="data" onChange={retrieveFile}/>
        <span className='textArea'>Image: {fileName}</span>
      <button type='submit' className='upload' disabled={!file}>Upload File</button>
      </form>
    </div>
  )
}

export default FileUpload