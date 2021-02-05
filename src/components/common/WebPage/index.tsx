import React, {useEffect, useMemo, useState} from "react";
import ReactDOM from "react-dom"

import {Button, Empty} from "antd";

interface WebPageProps{
    iframe:string;
}


class WebPage extends React.PureComponent<WebPageProps,any>{

    componentDidMount() {
    }
    render() {
        return (
            <div style={{height:"100%",backgroundColor:"rgba(0,0,0,0.5)"}}>
                <Empty
                    image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                    imageStyle={{
                        height: 60,
                    }}
                    description={
                        <span>
        Customize <a href="#API">{this.props.iframe}</a>
      </span>
                    }
                >
                    {this.props.iframe}
                </Empty>
            </div>
        );
    }
}




export default WebPage;