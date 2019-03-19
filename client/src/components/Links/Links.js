import React from "react";
import {
    Button,
    Modal
} from "react-bootstrap";

const Links = (props) => {
    const handleHide = () => props.hide();
    return (
        <div>
            <Modal
                show={props.show}
                onHide={() => handleHide()}
                container={this}
                aria-labelledby="contained-modal-title"
                className="modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title">
                        Enjoy your links
                </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Editable Link:</h4>
                    <p>{props.privateLink}</p>
                    <h4>Read-only Link:</h4>
                    <p>{props.publicLink}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => handleHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Links;
