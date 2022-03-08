import React from "react"
import './modal.css'
const modal = props=>(
        <div className="modal">
            <header className="modal-header"> <h1>{props.title} </h1></header>
            <section className="modal_content">
                {props.children}
                
                </section>
        <section className="modal_buttons">
            {props.canCancel &&<button className="btn_modal" onClick={props.onCancel}>Cancel</button>}
            {props.canAdd && <button  className="btn_modal" onClick={props.onAdd} >Add</button>}
            </section>
            




        </div>
)


export default modal