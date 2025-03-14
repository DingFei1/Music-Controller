// import React from "react";
// import { useNavigate } from "react-router-dom";

// export function withRouter(Component) {
//     return function WithRouter(props) {
//         const navigate = useNavigate();
//         return <Component {...props} navigate={navigate} />;
//     };
// }


import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

export function withRouter(Component) {
    return function(props) {
        const params = useParams();
        const navigate = useNavigate();
        const location = useLocation();
        
        // 将路由信息传递给类组件
        return <Component {...props} params={params} navigate={navigate} location={location} />;
    };
}

//export default withRouter;

