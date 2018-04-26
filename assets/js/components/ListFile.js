import React, {Component} from 'react';
import ReactDOMServer from 'react-dom/server';
import { Link } from 'react-router-dom'

import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import Util from '../library/Util';

import 'datatables.net-bs4/js/dataTables.bootstrap4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';

import 'datatables.net-responsive-bs4/js/responsive.bootstrap4.min';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';

export default class ListFile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            token: document.head.querySelector('meta[name="csrf-token"]').content,
            rows: []
        }
    }

    componentWillMount(){
    }

    componentDidMount(){
        let files = this.props.files;
        let data = [];
        files.map((file)=>{
            data.push({file})
        })

        var $table = $(this.table);
        var oTable = $table.DataTable({
            /*procressing: true,
            serverSide: true,
            ajax: {
                url: 'api/file/listfile/table',
                dataType: 'JSON',
                type: 'POST',
                data: {
                    _token: this.state.token
                }
            },*/
            responsive: true,
            columns: [
                {
                    width: "1%",
                    orderable: false,
                    searchable: false
                },
                {
                    title: 'File Name',
                    width: "15%"
                },
                {
                    width: "1%"                    
                },
                {
                    title: 'Preview',
                    orderable: false,
                    searchable: false
                },
                {
                    title: 'QR Code',
                    width: "20%",
                    orderable: false,
                    searchable: false
                },
                {
                    title: 'Actions',
                    width: "15%",
                    orderable: false,
                    searchable: false
                }
            ]
        })

        var $searchBox = $(this.searchBox);
        $searchBox.keyup(() => {
            console.log('oTable', oTable, $searchBox.val());
            oTable.search($searchBox.val()).draw();
        })

        $('#shareSettingModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget) // Button that triggered the modal
            var fileId = button.data('fileid') // Extract info from data-* attributes
            // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
            // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
            var modal = $(this)
            modal.find('#fileId').html(fileId)
        })

        console.log('data', data, files)
    }

    filePreview(fileId, mimeType, filename = "filename"){
        let mimeTypeCore = mimeType.split('/')[0];
        let mimeTypeSub = mimeType.split('/')[1];
        switch(mimeTypeCore){
            case 'application' :
                return (
                    <div>
                        (to-do) Image Tag src to image preview from first page of pdf
                        <h5 className="mt-2">
                            <FontAwesomeIcon className="mr-1" icon={["fas", "file"]}/>
                            Click here to view <span className="badge badge-light">{mimeTypeSub}</span> file.                   
                        </h5>
                    </div>
                )
            case 'image' :
                return (
                    <img src={"file/" + fileId} className="img-fluid" />
                )
            case 'video' :
                return  (
                    <video>
                        <source src={"file/" + fileId} type="video/mp4"/>
                        Your browser does not support the video tag.
                    </video>  
                )          
        }
    }

    checkAllFile(){
        console.log('Check All File');
        $('input[name=chkBoxFile]').prop('checked', $('input[name=chkBoxAllFile]').prop('checked'));
    }

    render(){
        return(
            <div className="d-flex flex-column align-self-center p-3 w-100">
                <div className="text-left mb-3">
                    <h3><FontAwesomeIcon className="mr-1" icon={["fas", "qrcode"]}/> All your QR Code</h3>
                    <hr/>                                           
                </div>
                {
                    (this.props.uploadNewFile) ? 
                        <button className="btn btn-success btn-lg btn-block mb-3" onClick={() => this.props.toggleShowListFile()}><FontAwesomeIcon icon={["fas", "plus-circle"]} /> Upload New File</button>
                    : ''
                }

                {
                    (this.props.files.length <= 0) ?
                        <div>
                            <h5><FontAwesomeIcon className="mr-1" icon={["far", "file"]}/> Not have any file.</h5>
                            <Link to="/"><FontAwesomeIcon className="mr-1" icon={["fas", "upload"]}/> Click Here To Upload New File</Link>
                        </div>
                    :
                        <div className="table-responsive p-1">
                            <div className="input-group input-group-lg mb-4">
                                <div className="wrapSearchBox">
                                    <span className="mr-3"><FontAwesomeIcon className="searchBox mr-2" icon={["fas", "search"]}/> Search File</span>
                                    <input type="text" className="searchBox" ref={el => this.searchBox = el}/>   
                                </div>
                            </div>
                            <table className="table table-bordered display responsive" width="100%" ref={el => this.table = el}>
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col"><input type="checkbox" name="chkBoxAllFile" onClick={() => this.checkAllFile()}/></th>                                        
                                        <th scope="col">File Name</th>
                                        <th scope="col">Size</th>
                                        <th scope="col" className="w-25">Preview</th>
                                        {/*<th scope="col">Type</th>*/}
                                        
                                        <th scope="col">QR Code</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.props.files.map((file) => {
                                                let fileId = (file.id === undefined) ? file.fileId : file.id;
                                                return (
                                                    <tr key={fileId}>
                                                        <td>
                                                            <input type="checkbox" name="chkBoxFile" value={fileId} />
                                                        </td>                                                        
                                                        <td>{file.filename}</td>
                                                        <td>{Util.capacityUnit(file.fileSize)}</td>
                                                        <td>
                                                            <p>
                                                                <button className="btn btn-outline-primary" type="button" data-toggle="collapse" data-target={"#collapsePreview-" + fileId} aria-expanded="false">
                                                                    <FontAwesomeIcon icon={["fas", "eye"]} /> View File
                                                                </button>
                                                            </p>
                                                            <div className="collapse" id={"collapsePreview-" + fileId}>
                                                                <div className="card card-body">
                                                                    <a href={"file/" + fileId} target="_blank" src={file.filename}>
                                                                        {this.filePreview(fileId, file.fileType, file.filename)}
                                                                    </a>
                                                                </div>
                                                            </div>
                                                            
                                                        </td>
                                                        {/*<td>{file.fileExtension}</td>*/}
                                                        <td>
                                                            <p>
                                                                <button className="btn btn-outline-primary mb-3" type="button" data-toggle="collapse" data-target={"#collapseQRCode-" + fileId} aria-expanded="false">
                                                                    <FontAwesomeIcon icon={["fas", "eye"]} /> View QR Code
                                                                </button>
                                                                
                                                                <br/> 
                                                                <a className="btn btn-secondary" href={"services/genqrcode/" + fileId} download><FontAwesomeIcon icon={["fas", "download"]} /> Download QR Code</a>                                                            
                                                            </p>
                                                            <div className="collapse" id={"collapseQRCode-" + fileId}>
                                                                <div className="m-2">
                                                                    <img src={'services/genqrcode/' + fileId} className="d-none d-sm-none d-lg-block img-thumbnail"/>    
                                                                </div>  
                                                            </div>
                                                            
                                                        </td>
                                                        <td>
                                                            <div className="m-2">
                                                                {
                                                                    (this.props.shareSettingBtn) ? 
                                                                        <button className="btn btn-light mr-3 mb-3" data-toggle="modal" data-target="#shareSettingModal" data-fileid={fileId}><FontAwesomeIcon icon={["fas", "cog"]} /> Share Setting</button>
                                                                    : 
                                                                        ''
                                                                }
                                                                <button className="btn btn-danger mr-3 mb-3" onClick={() => this.props.removeFile(fileId)}><FontAwesomeIcon icon={["fas", "trash-alt"]} /> Delete</button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            } 
                                        )
                                    }
                                </tbody>
                            </table>
                        </div>
                }

                <div className="modal fade" id="shareSettingModal" tabIndex="-1" role="dialog" aria-labelledby="shareSettingModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="shareSettingModalLabel"><FontAwesomeIcon icon={["fas", "cog"]} /> Share Setting</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            
                            <h3>Share File <small id="fileId"></small></h3>
                            <label className="switch">
                                <input type="checkbox" defaultChecked/>
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            {/*<button type="button" className="btn btn-primary" onClick={() => alert('Share Setting Modal')}>Save changes</button>*/}
                        </div>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}