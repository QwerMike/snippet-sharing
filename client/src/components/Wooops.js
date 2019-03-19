import React from "react";
import { Image, Button } from "react-bootstrap";

const Wooops = () => {
    return (
        <div align='center'>
            <h1>Wooops...</h1>
            <Image className='image' src='/snippets-wooops.png' alt='snippet share wooops' width='30%' height='30%' circle />
            <div>
                <Button bsStyle="primary" bsSize="large" href="/" >
                    GET ME OUT OF HERE!
                </Button>
            </div>
        </div>
    );
}

export default Wooops;