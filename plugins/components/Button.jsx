import {buttonStyle} from "../helpers/styles"
import React, {FunctionComponent} from "react"
import {Btn} from "./Btn"

export const Button = ({processing, onClick, on, off}) => {
    return (
        <Btn style={buttonStyle(processing)} onClick={onClick} disabled={processing}>
            {processing ? on : off}
        </Btn>
    )
}
