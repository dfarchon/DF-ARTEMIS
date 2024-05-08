import React from "react"
import ReactDom from "react-dom"
import {App} from "./views/App"
import {getArtemisContract} from "./helpers/helpers"

class ArtemisPlugin {
    constructor() {
        //@ts-expect-error
        this.root = null
        //@ts-expect-error
        this.container = null
    }

    async render(container) {
        //@ts-expect-error
        this.container = container

        container.style.width = "700px"

        try {
            const a = await getArtemisContract()
            // this.root = ReactDom.render(<App market={market} />, container);

            this.root = ReactDom.render(<App a={a} />, container)
        } catch (err) {
            console.error("[Artemis] Error starting plugin:", err)
            ReactDom.render(<div>{err.message}</div>, container)
        }
    }

    destroy() {
        ReactDom.render(null, this.container, this.root)
    }
}

export default ArtemisPlugin
