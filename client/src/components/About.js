import React, { Component } from "react";
import { Image } from "react-bootstrap";

class About extends Component {
    render() {
        return (
            <div align='center'>
                <h1>Snippet Sharing</h1>
                <Image className='image' src='/snippets-hero-icon.png' alt='snippet share logo' width='200px' height='200px' circle/>
                <p>
                    You can paste a text snippet, and then you will get two links.
                </p>
                <p>
                    First link allows you to modify and delete the snippet.
                </p>
                <p>
                    The second link grants only read-only access.
                </p>
                <h3> Contributors:</h3>
                <p>Anastasiia Kolomoiets</p>
                <p>Michael Kaskun</p>
                <p>Yaroslav Kormushyn</p>
                <p>Yurii Posivnych</p>
            </div>
        )
    }
}

export default About;