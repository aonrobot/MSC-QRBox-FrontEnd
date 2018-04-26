import React, {Component} from 'react';

import Util from '../../library/Util';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

//Filepond
import {FilePond, File, registerPlugin } from 'react-filepond';
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilepondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilepondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import GetQRCodeBtn from '../GetQRCodeBtn';
import ListFile from '../ListFile';

registerPlugin(FilePondImagePreview);
registerPlugin(FilepondPluginFileValidateSize);
registerPlugin(FilepondPluginFileValidateType);

export default class Home extends Component{
    constructor(props) {
        super(props);

        this.state = {
            token: document.head.querySelector('meta[name="csrf-token"]').content,
            login: document.head.querySelector('meta[name="basic-auth"]').content,

            files: [],
            countAddFile: 0,
            showListFile: false
        };

        this.uploadUIlabel = 'Drag & Drop ไฟล์ของคุณลงตรงพื้นที่สีเทา หรือ <span class="badge badge-pill badge-primary filepond--label-action"> กด Browse ที่นี่ </span>';

        this.removeFile = this.removeFile.bind(this);
        this.toggleShowListFile = this.toggleShowListFile.bind(this);
    }

    componentDidMount() {
        //this.setState({login: document.head.querySelector('meta[name="basic-auth"]').content});
        
    }

    removeFile(id) {
        //this.pond._pond.removeFile(id);
        let login = this.state.login;
        axios.post('api/file/delete', {id, login}).then((response) => {
            if(response.status === 200){
                let files = this.state.files;
                files = files.filter((el) => (
                    el.id != id
                ))
                this.setState({files})
            }
            console.log(this.state.files);            
        })
    }

    toggleShowListFile(checkGenQRCodeBtn = true) {
        this.setState({countAddFile: 0});
        this.setState({showListFile: !this.state.showListFile})
    }

    handleInit() {

        this.pond._pond.on('processfile', (error, file) => {                  
            let files = this.state.files;
            files.unshift(file)
            this.setState({files})
            //this.pond._pond.removeFile(file.id)
            //this.divShowQRCode.scrollIntoView({ behavior: "smooth", block: "start" });
            this.setState({countAddFile: this.state.countAddFile++});
            console.log(file, this.state.countAddFile)            
        });
        
        this.pond._pond.on('removefile', (file) => {             
            let files = this.state.files;
            files = files.filter((el) => (
                el.id != file.id
            ))
            this.setState({files})
        });
    }

    handleProcessing(fieldName, file, metadata, load, error, progress, abort) {
    }

    handleAddFile(error, file){
        let countAddFile = this.state.countAddFile;
        countAddFile++;
        this.setState({countAddFile});
    }

    render(){
        
        return(
            <div className="d-flex flex-column justify-content-center h-100 mt-5">
                <div className="d-flex flex-column align-self-center">
                    <div className="title text-center">
                        <FontAwesomeIcon icon={["fas", "qrcode"]} color="#74b9ff" /> QR Box
                    </div>
                    <div className="links text-center">
                        <p className="mb-5">By <span className="color-w-primary">Metrosystems</span> Cop. PCL.</p>

                        { (this.state.files.length > 0) && !this.state.showListFile ?

                            <GetQRCodeBtn handleClick={this.toggleShowListFile} login={this.state.login} files={this.state.files} countAddFile={this.state.countAddFile}/>

                        : ''}
                        
                        { !this.state.showListFile ?
                            
                            <div>
                                <div className="alert alert-info" role="alert">
                                    <ul>
                                        <li>สามารถ upload ได้ครั้งละ 3 ไฟล์</li>
                                        <li>แต่ละไฟล์ต้องมีขนาดไม่เกิน 1Gb</li>
                                        <li>และขนาดไฟล์รวมทั้งหมด 3 ไฟล์ต้องไม่เกิน 1Gb</li>
                                    </ul>
                                </div>
                                <FilePond   allowMultiple={true} 
                                        maxFiles={10}
                                        maxFileSize={'1024MB'}
                                        maxTotalFileSize={'1024MB'}
                                        acceptedFileTypes={['image/*', 'video/mp4', 'audio/*', 'application/pdf']}
                                        ref={ref => this.pond = ref}
                                        server={{
                                            url: 'api/uploadBox',
                                            process: {
                                                headers: {
                                                    'X-CSRF-TOKEN': this.state.token,
                                                    'BASIC-AUTH': this.state.login
                                                }
                                            },
                                            revert: {
                                                headers: {
                                                    'X-CSRF-TOKEN': this.state.token,
                                                    'BASIC-AUTH': this.state.login
                                                }
                                            }
                                        }}
                                        labelIdle={this.uploadUIlabel}
                                        instantUpload={true}
                                        onaddfile={(error, file) => this.handleAddFile(error, file)}
                                        oninit={() => this.handleInit()}
                                ></FilePond>
                            </div>

                        : '' }

                        { (this.state.files.length > 0) && !this.state.showListFile ?

                            <GetQRCodeBtn handleClick={this.getQRCodeClick} login={this.state.login} files={this.state.files} countAddFile={this.state.countAddFile}/>
                        
                        : '' }

                    </div>
                </div>

            { this.state.showListFile ?

                <ListFile files={this.state.files} uploadNewFile={true} toggleShowListFile={this.toggleShowListFile} removeFile={this.removeFile}/>

            : ''}

            </div>
        )
    }
}