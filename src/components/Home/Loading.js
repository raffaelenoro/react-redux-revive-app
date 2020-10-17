import React from 'react';
import Loader from 'react-loader-spinner'

export const Loading = (props) => {
    const width = props.width;
    const height = props.height;
    const altText = props.altText;

    return (
        <React.Fragment>
            <div style={{margin: "3em auto 0", width: width + "px"}}>
                <div>
                    <Loader type="Grid" color="rgb(26, 188, 156)" height={height} width={width} />
                </div>
            </div>
            <div style={{margin: "0 auto", textAlign: "center"}}>
                <p>{altText}</p>
            </div>
        </React.Fragment>
    );
}
