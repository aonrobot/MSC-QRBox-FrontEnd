import React, {Component} from 'react';

import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default class Footer extends Component{
    constructor(props){
        super(props);
        this.state = {
            userInfo : []
        }
    }
    
    render(){
        return(
            <footer className="pl-5 pt-5 pt-md-5 border-top">
                <div className="row">
                    <div className="col-12 col-md">
                        <img className="pb-4" src="images/logo.png" alt="" width="250" height="100"/>
                    </div>
                    <div className="col-6 col-md">
                        <h5>Features</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#">Cool stuff</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>Resources</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#">Resource</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md">
                        <h5>About</h5>
                        <ul className="list-unstyled text-small">
                            <li><a className="text-muted" href="#">Team</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        )
    }
} 