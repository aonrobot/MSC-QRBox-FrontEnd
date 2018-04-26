import React, {Component} from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class GetQRCodeBtn extends Component{

    saveFile(){
        let login = this.props.login;
        let files = this.props.files;
        let files_detail = []

        for(let index in files){
            files_detail.push({
                id : files[index].id,
                serverId : files[index].serverId,
                filename : files[index].filename,
                filenameWithoutExtension : files[index].filenameWithoutExtension,
                fileType : files[index].fileType,
                fileExtension : files[index].fileExtension,        
                fileSize : files[index].fileSize,
                fileLastModified : files[index].file.lastModified
                
            })
        }
        console.log(this.props.countAddFile)

        if(this.props.countAddFile <= 0){
            Swal('ไม่สามารถสร้าง QR Code ได้', 'กรุณาเลือกไฟล์อย่างน้อย 1 ไฟล์ครับ', 'error');
        }else{
            axios.post('api/file/store', {login, files : files_detail}).then((response) => {
                console.log(response);
                if(response.status === 200){
                    Swal('สร้าง QR Code สำเร็จ', 'คุณสามารถ Share QR Code ของคุณได้เลย :)', 'success');                
                    this.props.handleClick();
                }
            })
        }        
    }

    render(){
        return(
            <button className="btn btn-success btn-lg btn-block mb-3" onClick={() => this.saveFile()}>Get QR Code <FontAwesomeIcon icon={["fas", "qrcode"]} /></button>
        )
    }
}