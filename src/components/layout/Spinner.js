import React from 'react'
import spinner from './spinner.gif'
/* eslint import/no-anonymous-default-export: [2, {"allowArrowFunction": true}] */
export default () => {
    return (
        <div>
            <img src={spinner}
                alt="Loading..."
                style={{width: '200px', margin: ' 40px auto', display: 'block'}}>
                
            </img>
        </div>
    )
}
